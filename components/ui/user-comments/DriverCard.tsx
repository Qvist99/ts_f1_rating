"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client";
import CommentsModal from "./CommentsModal"
import Image from "next/image";
import { ArrowUp, ArrowDown, Star, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Comment, DriverWithStats } from "@/lib/types";

interface DriverCardProps {
    driver: DriverWithStats;
    isExpanded: boolean;
    onToggle: () => void;
}

const ratingColor = (r: number | null) => {
    if (!r) return "text-[#3a3835]"
    if (r >= 7.5) return "text-[#22c069]"
    if (r >= 6) return "text-[#f5a130]"
    return "text-[#e84040]"
}

const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (m < 60) return `${m}m ago`
    if (h < 24) return `${h}h ago`
    return `${d}d ago`
}


export default function DriverCard({ driver, isExpanded, onToggle }: DriverCardProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [myComments, setMyComments] = useState<Comment[]>([]);
    const [fetched, setFetched] = useState(false);

    const supabase = createClient();

    const stats = driver.driver_stats[0] || []
    const posComments = comments.filter(c => c.type === "positive");
    const negComments = comments.filter(c => c.type === "negative");
    const myPosComments = myComments.filter(c => c.type === "positive");
    const myNegComments = myComments.filter(c => c.type === "negative");


    const posCount = fetched
        ? comments.filter(c => c.type === "positive").length + myPosComments.length
        : stats.positive_comments ?? 0

    const negCount = fetched
        ? comments.filter(c => c.type === "negative").length + myNegComments.length
        : stats.negative_comments ?? 0

    const totalCount = fetched
        ? comments.length + myComments.length
        : stats.total_comments ?? 0

    const myCommentsCount = fetched ? myComments.length
        : stats.my_comments ?? 0



    useEffect(() => {
        if (!isExpanded || fetched) return;

        async function fetchComments() {
            setLoading(true);

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                //Should probably redirect in future but we have bigger problems if user reached this far without being authenticated so just return for now
                console.error("User not authenticated");
                setLoading(false);
                return;
            }

            // In this first version fetching all comments should be no issue. Something we have to overlook in the future and add some sort of pagination or lazy loading to the comments. 
            const [{ data: commentsData, error: commentsError }, { data: myCommentsData, error: myCommentsError }] = await Promise.all([
                supabase.from("driver_comments").select("*").eq("driver_id", driver.id).neq("user_id", user.id),
                supabase.from("driver_comments").select("*").eq("driver_id", driver.id).eq("user_id", user.id)
            ]);

            if (commentsError || myCommentsError) {
                console.error("Error fetching comments:", commentsError || myCommentsError);
                setLoading(false);
                return;
            }

            setComments(commentsData)
            setMyComments(myCommentsData)
            setLoading(false);
            setFetched(true);
        }
        fetchComments();

    }, [isExpanded])




    return (
        <div className="flex flex-col border-b border-border ">
            <div className="flex py-2.5 justify-between w-full items-center cursor-pointer h-[85px]" onClick={onToggle}>
                <div className="flex items-center gap-4">
                    <Image src={driver.headshot_url} alt={`${driver.first_name} ${driver.last_name}`} width={50} height={50} className="rounded-full border-2 border-card-border" />

                    <div className="flex flex-col">
                        <p className="font-condensed text-xl mt-1">{driver.first_name} {driver.last_name}</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full mt-0.5" style={{ backgroundColor: `#${driver.team_color}` }}></div>
                            <p className="text-sm text-text-muted">{driver.team_name} · #{driver.driver_number}</p>
                        </div>
                    </div>
                </div>


                <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                        <CommentTag type="positive" ammount={posCount} />
                        <CommentTag type="negative" ammount={negCount} />
                        {/* Slight bug noted if no driver_ratings are available this wont show correct count until user has fetched comments. Has something to do with how we join data into the views table I think */}
                        <CommentTag type="myComments" ammount={myCommentsCount} />

                    </div>

                    <div className="flex gap-2 items-center">
                        <AverageRating rating={stats.avg_rating_season} />

                        <span>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
                        </span>
                    </div>

                </div>
            </div>

            {isExpanded && (
                <div className="border border-card-border rounded my-3">
                    <div className="topbar bg-card-bg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Image src={driver.headshot_url} alt={`${driver.first_name} ${driver.last_name}`} width={50} height={50} className="rounded-full border-2 border-card-border" />

                            <div>
                                <p className="font-condensed text-lg">{driver.first_name} {driver.last_name}</p>
                                <p className="text-xs" style={{ color: `#${driver.team_color}` }}>{driver.team_name}</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className={ratingColor(stats.avg_rating_season)}>{stats.avg_rating_season ? stats.avg_rating_season.toFixed(1) : "N/A"}</p>
                                <p className="text-text-muted text-xs">AVG RATING</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="">
                                    {totalCount}
                                </p>
                                <p className="text-text-muted text-xs">COMMENTS</p>
                            </div>
                        </div>
                        {/* Current solution during loading, remove when replaced with proper loading state */}
                        <button className="flex gap-1 items-center border border-[#4e4c4c] rounded py-1.5 px-3 cursor-pointer hover:text-[#e8410a] hover:border-[#e8410a] transition-colors loading:cursor-not-allowed loading:text-[#7a7870] loading:border-[#7a7870] disabled:cursor-not-allowed disabled:text-[#7a7870] disabled:border-[#7a7870]"
                            onClick={() => setModalOpen(true)}
                            disabled={loading}
                        >
                            <Plus className="w-4 h-4 mt-0.5" />
                            <span className="text-sm font-condensed">
                                Add your comments
                            </span>
                        </button>
                    </div>


                    {loading ? (
                        <div className="p-6 text-sm text-[#3a3835] italic">Loading comments...</div>
                    ) : (
                        <div className="grid grid-cols-2" style={{ minHeight: 260 }}>
                            <CommentColumn
                                type="positive"
                                comments={[...myPosComments.map(c => ({ ...c, isYou: true })), ...posComments.map(c => ({ ...c, isYou: false }))]}
                                count={posCount}
                                onAddClick={() => setModalOpen(true)}
                            />
                            <CommentColumn
                                type="negative"
                                comments={[...myNegComments.map(c => ({ ...c, isYou: true })), ...negComments.map(c => ({ ...c, isYou: false }))]}
                                count={negCount}
                                onAddClick={() => setModalOpen(true)}
                            />
                        </div>
                    )}

                </div>
            )}

            {modalOpen && <CommentsModal driver={driver} onClose={() => setModalOpen(false)} myPositive={myPosComments} myNegative={myNegComments} onSave={(updated) => {
                setMyComments(updated)
                setModalOpen(false)
            }}

            />}



        </div>
    )
}

function CommentColumn({ type, comments, count, onAddClick }: {
    type: "positive" | "negative"
    comments: (Comment & { isYou: boolean })[]
    count: number
    onAddClick: () => void
}) {
    const isPos = type === "positive"
    return (
        <div className={`flex flex-col ${isPos ? "border-r border-white/[0.06]" : ""}`}>
            <div className={`flex items-center gap-2 px-4 py-[11px] border-b border-white/[0.06] text-[11px] font-semibold tracking-widest uppercase bg-[#111115] ${isPos ? "text-[#22c069]" : "text-[#e84040]"}`}>
                <div className="flex items-center gap-2">
                    {isPos ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {isPos ? "Positive" : "Negative"}
                </div>
                <span className="ml-auto text-sm opacity-70">{count}</span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[320px] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#3a3835] [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-transparent">
                {comments.length === 0 ? (
                    <div className="p-8 text-xs text-[#3a3835] italic text-center">
                        No {isPos ? "positive" : "negative"} comments yet.<br />Be the first!
                    </div>
                ) : (
                    comments.map(c => (
                        <div key={c.id} className={`relative px-4 py-2.5 border-b border-white/[0.06] last:border-0 text-[13px] leading-relaxed ${c.isYou ? "bg-[#191314]" : ""}`}>
                            <div
                                className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-sm"
                                style={{ background: isPos ? "#22c069" : "#e84040", opacity: c.isYou ? 1 : 0.5 }}
                            />
                            <div className="mb-1.5">{c.text}</div>
                            <div className="flex items-center gap-1.5 text-[11px] text-[#3a3835]">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border ${c.isYou ? "bg-[#421c12] text-[#e8410a] border-[#6f260e]" : "bg-[#202028] text-[#7a7870] border-white/10"}`}>
                                    {c.isYou ? "ME" : `${c.user_id.slice(0, 2).toUpperCase()}`}
                                </span>
                                {c.isYou ? <span className="text-[#e8410a] font-semibold text-[11px]">You</span> : "Fan"}
                                · {formatTime(c.updated_at)}
                            </div>
                        </div>
                    ))
                )}
                {comments.length === 0 && (
                    <div className="px-4 py-5 text-xs text-[#3a3835] text-center border-t border-dashed border-white/[0.06]">
                        <button onClick={onAddClick} className="bg-none border-none cursor-pointer text-[#e8410a] text-xs underline underline-offset-2 hover:text-[#ff6030] transition-colors">
                            Add your take
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}





function CommentTag({ type, ammount }: { type: "positive" | "negative" | "myComments", ammount: number | null }) {

    const color = type === "positive" ? "bg-[#22c069]/20 text-[#22c069] border border-[#22c069]" : type === "negative" ? "bg-[#e84040]/20 text-[#e84040] border border-[#e84040] " : "bg-[#21100c] text-[#e84040] border border-[#e84040]"


    return (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${color} h-6 min-w-10`}>
            {type === "positive" ? <ArrowUp className="w-3 h-3" /> : type === "negative" ? <ArrowDown className="w-3 h-3" /> : <Star className="w-3 h-3 " />}
            <p className="text-xs">{ammount ?? 0}</p>
            {type === "myComments" && <span className="text-sm">by you</span>}
        </div>
    )
}


function AverageRating({ rating }: { rating: number | null }) {
    return (
        <div className={`flex flex-col justify-center items-end gap-1 px-2 py-0.5 rounded font-condensed`}>
            <p className={` text-2xl leading-none ${ratingColor(rating)}`}>{rating ? rating.toFixed(1) : "N/A"}</p>
            <p className="text-text-muted leading-none">AVG RATING</p>
        </div>
    )
}