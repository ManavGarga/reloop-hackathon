/**
 * ReLoop Shared UI Components
 * Amazon-inspired design system. Import these everywhere for consistency.
 */

import React from 'react';
import { AlertCircle, RefreshCw, ShoppingBag, Package, Search, Inbox } from 'lucide-react';

/* ─── Button ──────────────────────────────────────────────────────────────── */
/**
 * Primary/Secondary/Danger/Ghost button following the design system.
 * variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
 * size: 'sm' | 'md' | 'lg'
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
  icon,
  ...rest
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg border transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary:   'bg-[#FF9900] hover:bg-[#E88A00] text-[#111111] border-[#FF9900] hover:border-[#E88A00] focus-visible:ring-[#FF9900] shadow-sm',
    secondary: 'bg-white hover:bg-[#F7F8FA] text-[#111111] border-[#E7E7E7] hover:border-[#A5A5A5] focus-visible:ring-[#FF9900]',
    danger:    'bg-[#D13212] hover:bg-[#B82B10] text-white border-[#D13212] focus-visible:ring-[#D13212] shadow-sm',
    ghost:     'bg-transparent hover:bg-[#F7F8FA] text-[#111111] border-transparent focus-visible:ring-[#FF9900]',
    link:      'bg-transparent text-[#007185] hover:text-[#C45500] border-transparent hover:underline focus-visible:ring-[#007185] px-0 py-0 h-auto',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-sm',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${variant !== 'link' ? sizes[size] : ''} ${widthClass} ${className}`}
      {...rest}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

/* ─── Card ────────────────────────────────────────────────────────────────── */
export function Card({ children, className = '', hover = false, onClick, padding = 'default', ...rest }) {
  const paddings = { default: 'p-5', sm: 'p-3', lg: 'p-7', none: '' };
  const hoverClass = hover ? 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer' : '';
  const clickable = onClick ? 'cursor-pointer' : '';
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E7E7E7] rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-all duration-150 ${hoverClass} ${clickable} ${paddings[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ─── Input ───────────────────────────────────────────────────────────────── */
export function Input({
  label,
  error,
  hint,
  id,
  className = '',
  inputClassName = '',
  required,
  ...rest
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#111111]">
          {label}{required && <span className="text-[#D13212] ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`h-10 px-3 rounded-lg border text-sm bg-white text-[#111111] outline-none transition-all duration-150
          ${error
            ? 'border-[#D13212] focus:border-[#D13212] focus:ring-2 focus:ring-[#D13212]/20'
            : 'border-[#E7E7E7] focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20'}
          disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#565959]
          ${inputClassName}`}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-[#565959]">{hint}</p>}
      {error && <p className="text-xs text-[#D13212] flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

/* ─── Select ──────────────────────────────────────────────────────────────── */
export function Select({ label, error, id, className = '', selectClassName = '', required, children, ...rest }) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-[#111111]">
          {label}{required && <span className="text-[#D13212] ml-0.5">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`h-10 px-3 rounded-lg border text-sm bg-white text-[#111111] outline-none transition-all duration-150 cursor-pointer
          ${error
            ? 'border-[#D13212] focus:border-[#D13212] focus:ring-2 focus:ring-[#D13212]/20'
            : 'border-[#E7E7E7] focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20'}
          disabled:opacity-50 disabled:cursor-not-allowed
          ${selectClassName}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[#D13212] flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

/* ─── Textarea ────────────────────────────────────────────────────────────── */
export function Textarea({ label, error, id, className = '', textareaClassName = '', required, ...rest }) {
  const taId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={taId} className="text-xs font-semibold text-[#111111]">
          {label}{required && <span className="text-[#D13212] ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={taId}
        className={`px-3 py-2 rounded-lg border text-sm bg-white text-[#111111] outline-none transition-all duration-150 resize-y min-h-[80px]
          ${error
            ? 'border-[#D13212] focus:border-[#D13212] focus:ring-2 focus:ring-[#D13212]/20'
            : 'border-[#E7E7E7] focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20'}
          disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#565959]
          ${textareaClassName}`}
        {...rest}
      />
      {error && <p className="text-xs text-[#D13212] flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

/* ─── Badge ───────────────────────────────────────────────────────────────── */
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:  'bg-[#F7F8FA] text-[#565959] border border-[#E7E7E7]',
    success:  'bg-[#F0FDF4] text-[#067D62] border border-[#D1FAE5]',
    warning:  'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]',
    error:    'bg-[#FEF2F2] text-[#D13212] border border-[#FCA5A5]',
    primary:  'bg-[#FF9900] text-[#111111] border border-[#FF9900]',
    orange:   'bg-[#FEF3E2] text-[#C45500] border border-[#FDE68A]',
    info:     'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

/* ─── Spinner ─────────────────────────────────────────────────────────────── */
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-7 h-7 border-2', lg: 'w-10 h-10 border-3' };
  return (
    <div
      className={`rounded-full border-[#E7E7E7] border-t-[#FF9900] animate-spin ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

/* ─── LoadingScreen ───────────────────────────────────────────────────────── */
export function LoadingScreen({ message = 'Loading…' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-[#565959]">
      <Spinner size="lg" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-[#E7E7E7] animate-pulse rounded-lg ${className}`} aria-hidden="true" />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <Card className="space-y-3">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      {lines > 2 && <Skeleton className="h-4 w-2/3" />}
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-20" />
      </div>
    </Card>
  );
}

/* ─── EmptyState ──────────────────────────────────────────────────────────── */
const EMPTY_ICONS = {
  orders:   <Package size={48} className="text-[#E7E7E7]" />,
  search:   <Search size={48} className="text-[#E7E7E7]" />,
  wallet:   <Inbox size={48} className="text-[#E7E7E7]" />,
  cart:     <ShoppingBag size={48} className="text-[#E7E7E7]" />,
  default:  <Inbox size={48} className="text-[#E7E7E7]" />,
};

export function EmptyState({
  type = 'default',
  title = 'Nothing here yet',
  message = '',
  action,
  actionLabel,
  icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="mb-4">{icon || EMPTY_ICONS[type] || EMPTY_ICONS.default}</div>
      <h3 className="text-base font-semibold text-[#111111] mb-1">{title}</h3>
      {message && <p className="text-sm text-[#565959] max-w-xs leading-relaxed mb-5">{message}</p>}
      {action && actionLabel && (
        <Button variant="primary" size="md" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/* ─── ErrorState ──────────────────────────────────────────────────────────── */
export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\'t load this content right now. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}>
      <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-[#D13212]" />
      </div>
      <h3 className="text-base font-semibold text-[#111111] mb-1">{title}</h3>
      <p className="text-sm text-[#565959] max-w-xs leading-relaxed mb-5">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry} icon={<RefreshCw size={14} />}>
          Try Again
        </Button>
      )}
    </div>
  );
}

/* ─── Toast ───────────────────────────────────────────────────────────────── */
export function Toast({ message, type = 'success', onClose }) {
  const types = {
    success: 'bg-[#067D62] text-white',
    error:   'bg-[#D13212] text-white',
    warning: 'bg-[#FFB84D] text-[#111111]',
    info:    'bg-[#131921] text-white',
  };
  return (
    <div className={`fixed top-20 right-5 z-[9000] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold max-w-sm transition-all ${types[type]}`}>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity" aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
}

/* ─── Modal ───────────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, footer, maxWidth = '500px' }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[5000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E7E7]">
          <h2 className="text-[16px] font-semibold text-[#111111]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#565959] hover:bg-[#F7F8FA] hover:text-[#111111] transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#E7E7E7] flex justify-end gap-3 bg-[#F7F8FA]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Divider ─────────────────────────────────────────────────────────────── */
export function Divider({ className = '' }) {
  return <hr className={`border-[#E7E7E7] ${className}`} />;
}

/* ─── SectionHeader ───────────────────────────────────────────────────────── */
export function SectionHeader({ title, subtitle, action, actionLabel, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-[22px] font-semibold text-[#111111] leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[#565959] mt-0.5">{subtitle}</p>}
      </div>
      {action && actionLabel && (
        <Button variant="link" size="sm" onClick={action} className="shrink-0 mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/* ─── PageTitle ───────────────────────────────────────────────────────────── */
export function PageTitle({ children, className = '' }) {
  return (
    <h1 className={`text-[28px] font-semibold text-[#111111] leading-tight ${className}`}>{children}</h1>
  );
}

/* ─── StatusPill ──────────────────────────────────────────────────────────── */
export function StatusPill({ status }) {
  const map = {
    'Delivered': 'success',
    'In Transit': 'info',
    'Pending': 'warning',
    'Cancelled': 'error',
    'Eligible for Return': 'orange',
    'Returned': 'default',
  };
  return <Badge variant={map[status] || 'default'}>{status}</Badge>;
}

/* ─── StarRating ──────────────────────────────────────────────────────────── */
export function StarRating({ rating = 0, count, size = 14 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= full ? '#FF9900' : (i === full + 1 && half ? 'url(#half)' : '#E7E7E7')} className="shrink-0">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#FF9900"/>
                <stop offset="50%" stopColor="#E7E7E7"/>
              </linearGradient>
            </defs>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </span>
      {count !== undefined && (
        <span className="text-xs text-[#007185]">({count.toLocaleString()})</span>
      )}
    </span>
  );
}
