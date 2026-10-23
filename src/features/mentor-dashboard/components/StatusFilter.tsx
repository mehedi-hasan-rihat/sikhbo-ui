"use client";

import type { StatusFilter } from "@/types/mentor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFilterProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

const OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL",      label: "All statuses" },
  { value: "PENDING",  label: "Pending"      },
  { value: "APPROVED", label: "Approved"     },
  { value: "REJECTED", label: "Rejected"     },
];

export function StatusFilterSelect({ value, onChange }: StatusFilterProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as StatusFilter)}
    >
      <SelectTrigger size="default" className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
