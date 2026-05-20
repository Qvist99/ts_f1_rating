

export interface StandingsListItem {
    value: number;
    mainLabel: string;
    hexColor: string;
    position: number;
    previous_position: number;
    subLabel?: string;
}


export interface StandingsListProps {
    items: StandingsListItem[];
    valueSuffix: string;
    showRatingBar: boolean;
    showDelta: boolean;
    alwaysShowDecimal?: boolean;
}



export default function StandingsList({ items, valueSuffix, showRatingBar, showDelta, alwaysShowDecimal = false }: StandingsListProps) {
    // ▲  ▼ — 

    return (
        <div>
            {items.map((item, index) => {
                const positionChange = item.position - item.previous_position
                const positionChangeSymbol = positionChange > 0 ? "▲" : positionChange < 0 ? "▼" : "—"
                const positionChangeColor = positionChange > 0 ? "text-[#22C55E]" : positionChange < 0 ? "text-[#E10600]" : "text-text-muted"

                const positionChangeAsLabel = positionChange > 0 ? positionChange : positionChange < 0 ? Math.abs(positionChange) : ""

                const percentage = (item.value / 10) * 100;


                return (
                    <div key={index} className="flex items-center justify-between py-2 hover:bg-border -mx-4 px-4 border-b border-border last:border-b-0">
                        <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
                            <div className="flex items-center justify-center w-[25px]">
                                <span className="text-text-muted">{item.position}</span>
                            </div>
                            <div className="flex gap-3 items-stretch flex-1 min-w-0">
                                <div className="w-1 rounded self-stretch" style={{ backgroundColor: item.hexColor }} />

                                <div className="flex flex-col justify-center min-h-[36px] flex-1 min-w-0">
                                    <span className="font-condensed font-bold leading-none">{item.mainLabel}</span>
                                    {item.subLabel && (
                                        <span className="text-text-muted text-sm mt-0.5 leading-none">{item.subLabel}</span>
                                    )}
                                    {showRatingBar && (
                                        <div className="w-full h-1 bg-[#3E4248] rounded mt-2">
                                            <div className="h-full rounded bg-[#e10600]" style={{ width: `${percentage}%` }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between w-24 shrink-0">
                            <div className="flex items-center justify-center w-[30px]">
                                {showDelta && (
                                    <span className={`font-bold ${positionChangeColor}`}>
                                        {positionChangeSymbol} {positionChangeAsLabel}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <span className="font-bold">
                                    {alwaysShowDecimal ? item.value.toFixed(1) : Number.isInteger(item.value) ? item.value : item.value.toFixed(1)}
                                </span>
                                <span className="text-text-muted">{valueSuffix}</span>
                            </div>
                        </div>
                    </div>

                )
            })}
            {items.length === 0 && (
                <div className="py-4 text-center text-text-muted">
                    No ratings yet
                </div>
            )}
        </div>
    )
}
