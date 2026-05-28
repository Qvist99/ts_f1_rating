"use client"
import { UserProfile } from "@/lib/types"
import { useRef, useState, useTransition } from "react"
import { updateDisplayName } from "@/lib/account/actions"

export default function AccountSettingsSection({ profile }: { profile: UserProfile }) {
    const [value, setValue] = useState(profile.display_name ?? "")
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const formRef = useRef<HTMLFormElement>(null)

    const isDirty = value?.trim() !== profile.display_name?.trim()


    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!isDirty) return

        const fd = new FormData(formRef.current!)

        startTransition(async () => {
            const result = await updateDisplayName(fd)
            if (result?.error) {
                setError(result.error)
            }
        })
    }

    return (
        <div className="mb-8">
            <p className="text-[11px] font-medium text-white/35 tracking-widest uppercase mb-3">Profile</p>
            <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">

                {/* Display name row */}
                <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-card-border">
                        <label htmlFor="displayName" className="text-[13px] text-white/45">
                            Display name
                        </label>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                                <input
                                    id="displayName"
                                    name="displayName"
                                    value={value ?? ""}
                                    onChange={(e) => { setValue(e.target.value); setError(null) }}
                                    onKeyDown={(e) => e.key === "Escape" && (setValue(profile.display_name ?? ""), setError(null))}
                                    maxLength={50}
                                    className="w-40 bg-white/6 border border-white/15 rounded-md text-white text-[13px] px-2.5 py-1.5 outline-none focus:border-white/30 transition-colors"
                                />
                                {isDirty && (
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="text-[12px] px-3 py-1.5 bg-transparent border border-white/20 rounded-md text-white/70 hover:bg-white/8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isPending ? "Saving…" : "Save"}
                                    </button>
                                )}
                            </div>
                            {error && (
                                <span className="text-[11px] text-red-400/90">
                                    {error}
                                </span>
                            )}
                        </div>
                    </div>
                </form>

                {/* Email row — read-only */}
                <div className="flex items-center justify-between px-4 py-3.5">
                    <span className="text-[13px] text-white/45">Email</span>
                    <span className="text-[13px] text-white/85 font-medium">{profile.email}</span>
                </div>

            </div>
        </div>
    )
}