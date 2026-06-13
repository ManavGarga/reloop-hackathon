import React from "react";
import { ReturnProvider } from "../context/ReturnContext";

export default function ReturnFlow() {
  return (
    <ReturnProvider>
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">ReLoop Return Flow</h1>
        <p className="text-gray-400">Smart return decision and inspection system.</p>
      </div>
    </ReturnProvider>
  );
}
