import Link from 'next/link'
import { Zap } from "lucide-react"

export default function CallToAction() {
    return (
        <section id="call-to-action" className="py-32 border-t border-card-border text-center relative overflow-hidden -mx-10 px-10">
            <h2 className="relative font-condensed font-black text-[clamp(2.5rem,5vw,5rem)] uppercase tracking-[-0.02em] leading-[0.95] mb-6">
                Your opinion<br /><span className="text-[#e8002d]">matters.</span>
            </h2>
            <p className="relative text-[#888] text-base font-light max-w-100 mx-auto mb-10">
                Join fans worldwide rating every driver, every race, every season.
            </p>
            <Link
                href="/dashboard"
                className="relative inline-flex items-center gap-2 bg-[#e8002d] text-white font-condensed font-bold text-[1.1rem] tracking-[0.08em] uppercase py-4 px-9 rounded-[3px] hover:bg-[#ff1a45] transition-all hover:-translate-y-px"
            >
                <Zap className="w-4 h-4" />
                Open App
            </Link>
        </section>
    )
}