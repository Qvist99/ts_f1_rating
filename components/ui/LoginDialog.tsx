"use client"
import { useLoginModal } from "@/lib/stores/useLoginModal";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { signInWithGoogle } from "@/app/auth/actions"

export default function LoginDialog() {
    const { isOpen, close, redirectPath } = useLoginModal()

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Sign in to continue</DialogTitle>
                    <DialogDescription>
                        You need to sign in to access functions like rating drivers/races and leaving comments on drivers.
                    </DialogDescription>
                </DialogHeader>
                <form action={() => signInWithGoogle(redirectPath)}>
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-3 w-full px-4 py-2.5 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors rounded-md text-sm font-medium cursor-pointer"
                    >
                        {/* Google SVG logo — official colors, no external dependency */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.46 3.1 29.5 1 24 1 14.82 1 7.07 6.48 3.64 14.24l7.08 5.5C12.4 13.72 17.73 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.96-2.2 5.47-4.68 7.15l7.18 5.57C43.27 37.7 46.5 31.5 46.5 24.5z" />
                            <path fill="#FBBC05" d="M10.72 28.26A14.7 14.7 0 0 1 9.5 24c0-1.48.26-2.91.72-4.26l-7.08-5.5A23.94 23.94 0 0 0 .5 24c0 3.87.93 7.53 2.58 10.76l7.64-6.5z" />
                            <path fill="#34A853" d="M24 46.5c5.5 0 10.12-1.82 13.5-4.95l-7.18-5.57C28.6 37.5 26.4 38.5 24 38.5c-6.27 0-11.6-4.22-13.28-9.74l-7.64 6.5C6.5 43.16 14.6 46.5 24 46.5z" />
                        </svg>
                        Sign in with Google
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}