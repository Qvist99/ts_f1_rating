

type SortOption = "avg_rating" | "most_discussed";

interface FilterBarProps {
    search: string;
    onSearch: (value: string) => void;
    sort: SortOption;
    onSort: (value: SortOption) => void;

}

export default function FilterBar({ search, onSearch, sort, onSort }: FilterBarProps) {
    return (
        <div className="flex items-center gap-12 mb-4 bg-card-bg -mx-36 px-36 h-14">
            <div>
                <input
                    type="text"
                    placeholder="Search drivers..."
                    value={search}
                    onChange={e => onSearch(e.target.value)}
                    className="bg-card-bg border-2 border-card-border rounded px-3 py-1.5 text-sm flex-1 outline-none"
                />
            </div>
            <div className="flex items-center gap-4 h-full">

                <Seperator />
                <p className="text-text-muted font-condensed font-bold">Sort:</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => onSort("avg_rating")}
                        className={`py-1 px-3 text-sm border-2 border-card-border rounded cursor-pointer  ${sort === "avg_rating" ? " text-text-primary bg-[#202028]" : "text-text-muted hover:text-text-primary"}`}
                    >
                        Avg Rating
                    </button>
                    <button
                        onClick={() => onSort("most_discussed")}
                        className={`py-1 px-3 text-sm border-2 border-card-border rounded cursor-pointer  ${sort === "most_discussed" ? " text-text-primary bg-[#202028]" : "text-text-muted hover:text-text-primary"}`}
                    >
                        Most Discussed
                    </button>
                </div>
            </div>
        </div>
    )
}



function Seperator() {
    return (
        <div className="h-[50%] w-[2px] bg-card-border" />
    )
}