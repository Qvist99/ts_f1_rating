"use client"

import { useState, useTransition } from "react"
import { UserProfile } from "@/lib/types"
import { scheduleAccountDeletion, cancelAccountDeletion } from "@/lib/account/actions"
import { Trash2, Undo } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function DangerZoneSection({ profile }: { profile: UserProfile }) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const isScheduledForDeletion = !!profile.deletion_requested_at

    function handleDelete() {
        setError(null)
        startTransition(async () => {
            const result = await scheduleAccountDeletion()
            if (result?.error) setError(result.error)
            // signOut inside the action handles the redirect
        })
    }

    function handleUndo() {
        setError(null)
        startTransition(async () => {
            const result = await cancelAccountDeletion()
            if (result?.error) setError(result.error)
        })
    }

    return (
        <div className="mb-8">
            <p className="text-[11px] font-medium text-white/35 tracking-widest uppercase mb-3">Danger zone</p>
            <div className="bg-card-bg border border-[#86292b] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5">
                    <div>
                        <p className="text-[13px] text-white/80 mb-0.5">Delete account</p>
                        <p className="text-[12px] text-white/35">
                            {isScheduledForDeletion
                                ? "Your account is scheduled for deletion in 30 days."
                                : "Permanently removes your account, ratings and comments"}
                        </p>
                    </div>
                    {isScheduledForDeletion ? (
                        <button
                            onClick={handleUndo}
                            disabled={isPending}
                            className="flex items-center gap-2 text-[13px] text-white/60 border border-white/15 px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <Undo className="w-4 h-4" />
                            {isPending ? "Cancelling…" : "Cancel deletion"}
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="flex items-center gap-2 text-[13px] text-red-400 border border-red-500/35 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-[12px] text-red-400/90 px-4 pb-3">{error}</p>
                )}
            </div>

            {/* Confirmation modal */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-[15px] font-medium text-white/90">
                            Delete your account?
                        </DialogTitle>
                        <DialogDescription className="text-[13px] text-white/45 leading-relaxed">
                            Your account will be scheduled for deletion in 30 days. All your ratings and comments will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <p className="text-[12px] text-red-400/90">{error}</p>
                    )}

                    <DialogFooter className="flex gap-2.5 sm:gap-2.5 bg-card-bg">
                        <button
                            onClick={() => setShowConfirm(false)}
                            disabled={isPending}
                            className="flex-1 py-2.5 text-[13px] font-medium text-white/60 border border-white/12 rounded-lg hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Keep account
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isPending}
                            className="flex-1 py-2.5 text-[13px] font-medium text-red-400 bg-red-500/10 border border-red-500/35 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Scheduling…" : "Yes, delete my account"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

