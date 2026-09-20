"use client";

import { LayoutGrid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  placeholder: string;
  selects?: { label: string; options: string[] }[];
  className?: string;
  onSearch?: (query: string) => void;
  onSelect?: (label: string, value: string) => void;
}

/** Search + dropdowns + grid/list toggle row used on database pages. */
export function FilterBar({ placeholder, selects = [], className, onSearch, onSelect }: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder={placeholder} 
          className="pl-9" 
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      {selects.map((s) => (
        <Select
          key={s.label}
          className="w-36"
          options={s.options.map((o) => ({ value: o, label: o }))}
          defaultValue={s.options[0]}
          onChange={(e) => onSelect?.(s.label, e.target.value)}
        />
      ))}
      <div className="flex items-center gap-1 rounded-lg border border-input p-1">
        <Button variant="solid" size="icon" className="h-7 w-7 rounded-md">
          <LayoutGrid className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
          <List className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
