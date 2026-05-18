type RatingButtonsProps = {
    value: number | undefined
    onChange: (val: number) => void
    type: 'driver' | 'race'
}

export function RatingButtons({
    value,
    onChange,
    type,
}: RatingButtonsProps) {

    const ratingDisplay = (
        <span
            className={`text-[28px] font-medium leading-none flex-shrink-0 ${value ? 'text-[#e8eaf2]' : 'text-[#3E4248]'
                }`}
        >
            {value ? (
                <>
                    {value}
                    <span className="text-[15px] text-[#3E4248] font-normal">
                        /10
                    </span>
                </>
            ) : (
                '—'
            )}
        </span>
    )

    const buttonGrid = (
        <div className="grid grid-cols-10 gap-1 flex-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <button
                    key={n}
                    onClick={() => onChange(n)}
                    className={`py-2 rounded text-[13px] font-medium transition-colors duration-100 cursor-pointer
                        ${value === n
                            ? 'bg-[#e10600] text-white border border-[#e10600]'
                            : 'bg-[#181c28] border border-[#282D33] text-[#3E4248] hover:text-[#a1a1aa] hover:border-[#3E4248]'
                        }`}
                >
                    {n}
                </button>
            ))}
        </div>
    )

    if (type === 'driver') {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <span className="text-xs text-[#3E4248]">
                        Your rating
                    </span>

                    {ratingDisplay}
                </div>

                {buttonGrid}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4 flex-1">
            {ratingDisplay}
            {buttonGrid}
        </div>
    )
}