"use client"
import { signOut } from "@/app/auth/actions"

export default function SignOutSection() {
    const redirectTo = "/dashboard"

    return (
        <div className="mb-8">
            <p className="text-[11px] font-medium text-white/35 tracking-widest uppercase mb-3">Session</p>
            <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
                <button
                    onClick={() => signOut(redirectTo)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-[13px] text-white/45 hover:text-white/70 hover:bg-white/2 transition-colors cursor-pointer"
                >
                    Sign out
                    <i className="ti ti-logout text-base" aria-hidden="true" />
                </button>
            </div>
        </div>
    )
}