from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI, DB_NAME
import copy

client: AsyncIOMotorClient = None
db = None

class MockCursor:
    def __init__(self, data, limit_val=None):
        self.data = data
        self.limit_val = limit_val
        
    def limit(self, val):
        self.limit_val = val
        return self
        
    def sort(self, key, direction=-1):
        self.data = sorted(
            self.data,
            key=lambda x: x.get(key) if x.get(key) is not None else "",
            reverse=(direction == -1)
        )
        return self
        
    async def to_list(self, length=None):
        limit = self.limit_val if self.limit_val is not None else length
        if limit is not None:
            return self.data[:limit]
        return self.data

class MockCollection:
    def __init__(self, name, initial_data=None):
        self.name = name
        self._data = initial_data or []
        
    async def count_documents(self, query):
        filtered = self._filter(query)
        return len(filtered)
        
    async def insert_many(self, documents):
        docs = [copy.deepcopy(doc) for doc in documents]
        self._data.extend(docs)
        return docs
        
    async def insert_one(self, document):
        doc = copy.deepcopy(document)
        self._data.append(doc)
        return doc

    async def find_one(self, query, projection=None):
        filtered = self._filter(query)
        if not filtered:
            return None
        return copy.deepcopy(filtered[0])
        
    def find(self, query=None, projection=None):
        filtered = self._filter(query or {})
        return MockCursor([copy.deepcopy(item) for item in filtered])
        
    async def update_one(self, query, update, upsert=False):
        filtered = self._filter(query)
        if not filtered:
            if upsert:
                doc = {}
                if "$set" in update:
                    doc.update(update["$set"])
                if "$inc" in update:
                    doc.update(update["$inc"])
                self._data.append(doc)
                return True
            return False
        doc = filtered[0]
        if "$set" in update:
            for k, v in update["$set"].items():
                if "." in k:
                    parts = k.split(".")
                    curr = doc
                    for p in parts[:-1]:
                        if p not in curr:
                            curr[p] = {}
                        curr = curr[p]
                    curr[parts[-1]] = v
                else:
                    doc[k] = v
        if "$inc" in update:
            for k, v in update["$inc"].items():
                if "." in k:
                    parts = k.split(".")
                    curr = doc
                    for p in parts[:-1]:
                        if p not in curr:
                            curr[p] = {}
                        curr = curr[p]
                    curr[parts[-1]] = curr.get(parts[-1], 0) + v
                else:
                    doc[k] = doc.get(k, 0) + v
        return True

    async def delete_one(self, query):
        filtered = self._filter(query)
        if filtered:
            self._data.remove(filtered[0])
            return True
        return False
        
    def _filter(self, query):
        res = []
        for doc in self._data:
            match = True
            for k, v in query.items():
                if k == "$or":
                    or_match = False
                    for sub_query in v:
                        if all(doc.get(sub_k) == sub_v for sub_k, sub_v in sub_query.items()):
                            or_match = True
                            break
                    if not or_match:
                        match = False
                        break
                elif "." in k:
                    parts = k.split(".")
                    curr = doc
                    for p in parts:
                        if isinstance(curr, dict) and p in curr:
                            curr = curr[p]
                        else:
                            curr = None
                            break
                    if curr != v:
                        match = False
                        break
                else:
                    if doc.get(k) != v:
                        match = False
                        break
            if match:
                res.append(doc)
        return res

class MockDatabase:
    def __init__(self):
        self.collections = {}
        
    def __getattr__(self, name):
        if name not in self.collections:
            self.collections[name] = MockCollection(name)
        return self.collections[name]
        
    def __getitem__(self, name):
        return getattr(self, name)


async def connect_db():
    global client, db
    try:
        client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        await client.admin.command('ping')
        db = client[DB_NAME]
        print(f"✅ Connected to MongoDB: {DB_NAME}")
    except Exception as e:
        print(f"⚠️ Failed to connect to MongoDB ({e}). Falling back to In-Memory Mock Database.")
        db = MockDatabase()


async def close_db():
    global client
    if client:
        try:
            client.close()
            print("🔌 MongoDB connection closed")
        except Exception:
            pass


def get_db():
    return db
