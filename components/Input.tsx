import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="relative mb-4">
      <input
        {...props}
        className={`peer w-full rounded-md border-2 border-gray-200 bg-transparent px-3 pb-2.5 pt-4 text-sm font-medium text-gray-900 outline-none transition-all focus:border-teal-600 disabled:border-gray-200 disabled:bg-gray-50 ${
          error ? 'border-red-500 focus:border-red-500' : ''
        } ${className}`}
        placeholder=" "
      />
      <label
        className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 scale-75 bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:text-teal-600 ${
          error ? 'text-red-500 peer-focus:text-red-500' : ''
        }`}
      >
        {label}
      </label>
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="relative mb-4">
      <select
        {...props}
        className={`peer w-full appearance-none rounded-md border-2 border-gray-200 bg-transparent px-3 pb-2.5 pt-4 text-sm font-medium text-gray-900 outline-none transition-all focus:border-teal-600 ${className}`}
      >
        <option value="" disabled selected></option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 scale-75 bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:text-teal-600">
        {label}
      </label>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  );
};