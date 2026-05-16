interface FilterOption<T extends string> {
    label: string
    value: T
}

interface FilterPillsProps<T extends string> {
    filters: FilterOption<T>[]
    active: T
    onChange: (value: T) => void
}

export default function FilterPills<T extends string>({ filters, active, onChange }: FilterPillsProps<T>) {
    return (
        <div className="p-2 border-b border-border -mx-4 px-4">
            {filters.map(filter => (
                <button
                    key={filter.value}
                    onClick={() => onChange(filter.value)}
                    className={`text-sm px-3 py-1 rounded-full border transition-colors cursor-pointer ${active === filter.value
                            ? "border-[#e10600] bg-[#e10600]/15 text-[#e10600]"
                            : "border-border text-text-muted hover:text-white"
                        }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    )
}
