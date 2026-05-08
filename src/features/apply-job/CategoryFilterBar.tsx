import { CATEGORIES } from "@/entities/job/constants";
import { CategoryFilter } from "@/shared/types";

interface CategoryFilterBarProps {
  selected: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}

export function CategoryFilterBar({ selected, onChange }: CategoryFilterBarProps) {
  return (
    <div className="filters">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          className={`filter-chip ${selected === c ? "active" : ""}`}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}