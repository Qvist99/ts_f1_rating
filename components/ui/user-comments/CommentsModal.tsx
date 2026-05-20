"use client"
// If we end up having modal in multiple places we will change this to some sort of modal content component using the global modal at that point
import { useState } from "react";
import { Comment, DriverWithStats } from "@/lib/types"
import { createClient } from "@/lib/supabase/client";
import { X, ArrowUp, ArrowDown, Pencil } from "lucide-react";

interface CommentsModalProps {
    driver: DriverWithStats;
    myPositive: Comment[];
    myNegative: Comment[];
    onClose: () => void;
    onSave: (updated: Comment[]) => void;
}

const MAX_SLOTS = 3;
const MAX_CHARS = 110;


export default function CommentsModal({ driver, myPositive, myNegative, onClose, onSave }: CommentsModalProps) {
    const [positive, setPositive] = useState<Comment[]>(myPositive);
    const [negative, setNegative] = useState<Comment[]>(myNegative);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [newPos, setNewPos] = useState("");
    const [newNeg, setNewNeg] = useState("");
    const [toast, setToast] = useState<{ msg: string; type: "pos" | "neg" | "info" } | null>(null)

    const supabase = createClient();

    // Same as with the modal the toast might be moved to some sor of global component
    function showToast(msg: string, type: "pos" | "neg" | "info") {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 2800)
    }



    async function handlePost(type: "positive" | "negative") {
        const text = type === "positive" ? newPos.trim() : newNeg.trim()

        if (!text) return

        const { data, error } = await supabase.from("driver_comments").insert({
            driver_id: driver.id,
            type,
            text
        })
            .select()
            .single()

        if (error || !data) {
            console.error("Error posting comment:", error);
            showToast("Failt to post comment.", "neg");
            return
        }

        if (type === "positive") {
            setPositive(p => [...p, data]); setNewPos("")
        } else {
            setNegative(p => [...p, data]); setNewNeg("")
        }

        showToast(`${type === "positive" ? "Positive" : "Negative"} comment posted!`, type === "positive" ? "pos" : "neg")
    }

    async function handleSave(comment: Comment) {
        if (!editText.trim()) { showToast("Comment cannot be empty.", "neg"); return }
        const { error } = await supabase.from("driver_comments").update({ text: editText.trim(), updated_at: new Date().toISOString() }).eq("id", comment.id)
        if (error) {
            console.error("Error updating comment:", error);
            showToast("Failed to update comment.", "neg");
            return
        }

        const updated = { ...comment, text: editText.trim() }

        if (comment.type === "positive") {
            setPositive(p => p.map(c => c.id === comment.id ? updated : c))
        } else {
            setNegative(p => p.map(c => c.id === comment.id ? updated : c))
        }
        setEditingId(null)
        showToast("Comment updated.", "pos")
    }



    async function handleDelete(comment: Comment) {
        const { error } = await supabase.from("driver_comments").delete().eq("id", comment.id)
        if (error) {
            console.error("Error deleting comment:", error);
            showToast("Failed to delete comment.", "neg");
            return
        }

        if (comment.type === "positive") {
            setPositive(p => p.filter(c => c.id !== comment.id))
        } else {
            setNegative(p => p.filter(c => c.id !== comment.id))
        }
        showToast("Comment deleted.", "info")
    }

    function handleClose() {
        onSave([...positive, ...negative])
        onClose()
    }



    return (
        <div
            className="fixed inset-0 z-[500] flex items-center justify-center  backdrop-blur-[8px]"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
            <div className="bg-card-bg border border-card-border rounded-xl w-[600px] overflow-hidden" style={{ transform: "translateY(0) scale(1)" }}>


                <div className="flex items-center justify-between px-6 py-[18px] border-b border-card-border sticky top-0 bg-[#111115] z-10">
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="font-condensed text-xl font-extrabold uppercase leading-none">{driver.first_name} {driver.last_name}</div>
                            <div className="text-xs" style={{ color: `#${driver.team_color}` }}>{driver.team_name} · #{driver.driver_number}</div>
                        </div>
                        <span className="font-condensed text-xs tracking-widest uppercase text-[#e8410a] bg-[#271613] border border-[#572011] px-2 py-[3px] rounded-[3px] ml-1">
                            Your Comments
                        </span>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-[6px] bg-[#18181e] border border-white/[0.11] text-[#7a7870] flex items-center justify-center hover:bg-[#202028] hover:text-[#eeeae2] transition-all flex-shrink-0 cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>


                <div className="p-6 flex flex-col gap-6">
                    <ModalSection
                        type="positive"
                        comments={positive}
                        editingId={editingId}
                        editText={editText}
                        newText={newPos}
                        driverFirstName={driver.first_name}
                        onEdit={(c) => { setEditingId(c.id); setEditText(c.text) }}
                        onEditTextChange={setEditText}
                        onSave={handleSave}
                        onCancelEdit={() => setEditingId(null)}
                        onDelete={handleDelete}
                        onNewTextChange={setNewPos}
                        onPost={() => handlePost("positive")}
                    />
                    <div className="h-px bg-white/[0.06]" />
                    <ModalSection
                        type="negative"
                        comments={negative}
                        editingId={editingId}
                        editText={editText}
                        newText={newNeg}
                        driverFirstName={driver.first_name}
                        onEdit={(c) => { setEditingId(c.id); setEditText(c.text) }}
                        onEditTextChange={setEditText}
                        onSave={handleSave}
                        onCancelEdit={() => setEditingId(null)}
                        onDelete={handleDelete}
                        onNewTextChange={setNewNeg}
                        onPost={() => handlePost("negative")}
                    />
                </div>


                <div className="flex justify-end px-6 py-4 border-t border-white/[0.06] bg-[#18181e] rounded-b-[12px]">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2 rounded-[6px] bg-[#202028] border border-white/[0.18] text-[13px] font-semibold text-[#eeeae2] hover:bg-[#26262f] transition-all cursor-pointer"
                    >
                        Done
                    </button>
                </div>

            </div>


            {toast && (
                <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-2 px-[18px] py-[11px] rounded-[8px] bg-[#18181e] border text-[13px] font-medium max-w-[300px] pointer-events-none shadow-lg
                    ${toast.type === "pos" ? "border-l-[3px] border-l-[#22c069] border-white/[0.18] text-[#eeeae2]" : ""}
                    ${toast.type === "neg" ? "border-l-[3px] border-l-[#e84040] border-white/[0.18] text-[#eeeae2]" : ""}
                    ${toast.type === "info" ? "border-l-[3px] border-l-[#e8410a] border-white/[0.18] text-[#eeeae2]" : ""}
                `}>
                    {toast.type === "pos" && <svg className="w-3.5 h-3.5 text-[#22c069] flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 8l4 4 6-7" /></svg>}
                    {toast.type === "neg" && <svg className="w-3.5 h-3.5 text-[#e84040] flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6" /><path d="M8 5v3.5" /><circle cx="8" cy="11.5" r=".5" fill="currentColor" /></svg>}
                    {toast.type === "info" && <svg className="w-3.5 h-3.5 text-[#e8410a] flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6" /><path d="M8 7v4" /><circle cx="8" cy="5" r=".5" fill="currentColor" /></svg>}
                    {toast.msg}
                </div>
            )}
        </div>
    )
}








function ModalSection({ type, comments, editingId, editText, newText, driverFirstName, onEdit, onEditTextChange, onSave, onCancelEdit, onDelete, onNewTextChange, onPost }: {
    type: "positive" | "negative"
    comments: Comment[]
    editingId: string | null
    editText: string
    newText: string
    driverFirstName: string
    onEdit: (c: Comment) => void
    onEditTextChange: (v: string) => void
    onSave: (c: Comment) => void
    onCancelEdit: () => void
    onDelete: (c: Comment) => void
    onNewTextChange: (v: string) => void
    onPost: () => void
}) {
    const isPos = type === "positive"
    const color = isPos ? "text-[#22c069]" : "text-[#e84040]"
    const placeholder = "Share your thoughts..."
    const canAdd = comments.length < MAX_SLOTS

    return (
        <div className="flex flex-col gap-2.5">
            {/* Section label */}
            <div className={`flex items-center gap-2 text-xs font-bold tracking-[0.12em] uppercase ${color}`}>
                <div className="flex items-center gap-2">
                    {isPos ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {isPos ? "Positive comments" : "Negative comments"}
                </div>
                <span className="ml-auto text-xs tracking-normal font-normal text-text-muted normal-case">
                    {comments.length}/{MAX_SLOTS}
                </span>
            </div>

            {/* Existing slots */}
            {comments.map((c, i) => (
                <div
                    key={c.id}
                    className={`flex gap-2.5 items-start bg-[#18181e] border rounded-[7px] px-3 py-2.5 transition-colors ${editingId === c.id ? "border-[#e8410a]" : "border-white/[0.11]"}`}
                >
                    <span className="text-xs text-text-muted flex-shrink-0 pt-px w-4 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                        {editingId === c.id ? (
                            <>
                                <textarea
                                    value={editText}
                                    onChange={e => onEditTextChange(e.target.value.slice(0, MAX_CHARS))}
                                    className="w-full bg-transparent border-none outline-none text-[13px] leading-relaxed text-[#eeeae2] resize-none font-['DM_Sans'] p-0"
                                    rows={2}
                                    autoFocus
                                />
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className="text-[10px] text-text-muted">{editText.length}/{MAX_CHARS}</span>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => onSave(c)} className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[#e8410a] text-white text-[11px] font-medium border border-[#e8410a] hover:bg-[#c93508] transition-colors cursor-pointer">Save</button>
                                        <button onClick={onCancelEdit} className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] border border-white/[0.11] text-[#7a7870] text-[11px] font-medium hover:text-[#eeeae2] hover:border-white/[0.18] transition-colors cursor-pointer">Cancel</button>
                                        <button onClick={() => onDelete(c)} className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] border border-[rgba(232,64,64,0.22)] text-[#e84040] text-[11px] font-medium hover:border-[#e84040] transition-colors cursor-pointer">
                                            <X className="w-[11px] h-[11px]" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-[13px] leading-relaxed text-[#eeeae2]">{c.text}</div>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <button onClick={() => onEdit(c)} className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] border border-white/[0.11] text-[#7a7870] text-[11px] font-medium hover:text-[#eeeae2] hover:border-white/[0.18] transition-colors cursor-pointer">
                                        <Pencil className="w-[11px] h-[11px]" />
                                        Edit
                                    </button>
                                    <button onClick={() => onDelete(c)} className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] border border-[rgba(232,64,64,0.22)] text-[#e84040] text-[11px] font-medium hover:border-[#e84040] transition-colors cursor-pointer">
                                        <X className="w-[11px] h-[11px]" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ))}

            {/* Empty/new slot */}
            {canAdd && (
                <div className="flex gap-2.5 items-center bg-[#18181e] border border-dashed border-white/[0.11] rounded-[7px] px-3 py-2.5">
                    <span className="text-xs text-text-muted flex-shrink-0 w-4 text-right">{comments.length + 1}</span>
                    <div className="flex-1 flex flex-col gap-1.5">
                        <textarea
                            value={newText}
                            onChange={e => onNewTextChange(e.target.value.slice(0, MAX_CHARS))}
                            placeholder={placeholder}
                            className="w-full bg-transparent border-none outline-none text-xs leading-relaxed text-[#eeeae2] placeholder:text-text-muted resize-none p-0"
                            rows={2}
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted">{newText.length}/{MAX_CHARS}</span>
                            <button
                                onClick={onPost}
                                disabled={!newText.trim()}
                                className={`flex items-center gap-1.5 px-3 py-[5px] rounded-[4px] text-[11px] font-semibold border transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed
                                    ${isPos
                                        ? "bg-[rgba(34,192,105,0.08)] text-[#22c069] border-[rgba(34,192,105,0.22)] hover:bg-[rgba(34,192,105,0.16)]"
                                        : "bg-[rgba(232,64,64,0.08)] text-[#e84040] border-[rgba(232,64,64,0.22)] hover:bg-[rgba(232,64,64,0.16)]"
                                    }`}
                            >
                                <svg className="w-[11px] h-[11px]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                                    {isPos ? <><path d="M6 2v8M2 6l4-4 4 4" /></> : <><path d="M6 10V2M2 6l4 4 4-4" /></>}
                                </svg>
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
