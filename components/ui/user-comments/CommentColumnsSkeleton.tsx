import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown } from "lucide-react"
const COMMENT_ROW_COUNT = 3

export default function CommentColumnsSkeleton() {
    return (
        <div className="grid grid-cols-2" style={{ minHeight: 260 }}>
            <CommentColumnSkeleton type="positive" />
            <CommentColumnSkeleton type="negative" />
        </div>
    )
}

function CommentColumnSkeleton({ type }: { type: "positive" | "negative" }) {
    const isPos = type === "positive"
    return (
        <div className={`flex flex-col ${isPos ? "border-r border-white/6" : ""}`}>
            {/* Header - real text/icon/count kept static, not skeletonized, since it's known instantly */}
            <div className={`flex items-center gap-2 px-4 py-2.75 border-b border-white/6 text-[11px] font-semibold tracking-widest uppercase bg-[#111115] ${isPos ? "text-[#22c069]" : "text-[#e84040]"}`}>
                <div className="flex items-center gap-2">
                    {isPos ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {isPos ? "Positive" : "Negative"}
                </div>
                <Skeleton className="ml-auto h-3.5 w-4" />
            </div>

            {/* Comment rows */}
            <div className="flex-1 max-h-80">
                {Array.from({ length: COMMENT_ROW_COUNT }).map((_, i) => (
                    <div key={i} className="relative px-4 py-2.5 border-b border-white/6 last:border-0">
                        <div className="mb-1.5 flex flex-col gap-1.5">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/5" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="h-2.5 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}