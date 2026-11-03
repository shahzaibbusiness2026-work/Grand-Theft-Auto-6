"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  placeholder: string;
  selects?: { label: string; options: string[]; value?: string }[];
  className?: string;
  onSearch?: (query: string) => void;
  onSelect?: (label: string, value: string) => void;
}

/** Search and named, controlled dropdowns. */
export function FilterBar({
  placeholder,
  selects = [],
  className,
  onSearch,
  onSelect,
}: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          aria-label={placeholder}
          type="search"
          className="pl-9"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      {selects.map((s) => (
        <Select
          key={s.label}
          aria-label={s.label}
          className="w-36"
          options={s.options.map((o) => ({ value: o, label: o }))}
          {...(s.value === undefined
            ? { defaultValue: s.options[0] }
            : { value: s.value })}
          onChange={(e) => onSelect?.(s.label, e.target.value)}
        />
      ))}
    </div>
  );
}
