"use client";

import React from "react";

/** Shared dark-theme form primitives for the admin editors. */

export const inputCls =
  "w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]";
export const labelCls = "block text-[11px] font-medium text-[#94A3B8] mb-1";

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{children}</div>;
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#1C2436] bg-[#0B0E14]/60 p-4 space-y-3">
      <h3 className="text-[11px] font-black uppercase tracking-wider text-[#818CF8]">{title}</h3>
      {children}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && <p className="mt-0.5 text-[10px] text-[#64748B]">{hint}</p>}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: number | null | undefined;
  onChange: (v: number | null) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === "" ? null : Number(raw));
        }}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && <p className="mt-0.5 text-[10px] text-[#64748B]">{hint}</p>}
    </div>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-[#1C2436] bg-[#0E131D] px-3 py-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0"
      />
      <span className="text-xs font-medium text-[#CBD5E1]">{label}</span>
    </label>
  );
}

/** Free-form list editor (one item per line) for tags, features, gallery... */
export function ListField({
  label,
  items,
  onChange,
  hint,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea
        value={(items || []).join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        rows={3}
        placeholder={"One per line, e.g.\nMissiles\nBulletproof Windows"}
        className={inputCls + " resize-y"}
      />
      {hint && <p className="mt-0.5 text-[10px] text-[#64748B]">{hint}</p>}
    </div>
  );
}
