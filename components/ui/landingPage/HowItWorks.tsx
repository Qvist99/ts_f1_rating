import { Star, MessageSquare, Grid3x3, Clock, Users, } from "lucide-react"
import SectionLabel from "./SectionLabel"
const FEATURES = [
    {
        icon: <Star className="w-5 h-5 stroke-[#e8002d] fill-none stroke-[1.5]" />,
        title: 'Rate Every Driver',
        desc: 'Score all 22 drivers on a 1–10 scale after each race. Your ratings feed directly into the global fan standings in real time.',
    },
    {
        icon: <MessageSquare className="w-5 h-5 stroke-[#e8002d] fill-none stroke-[1.5]" />,
        title: 'Fan Comments',
        desc: 'Drop a quick-fire take — positive or critical. See what the global fanbase really thinks, sorted by most discussed driver.',
    },
    {
        icon: <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[#e8002d] fill-none stroke-[1.5]"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
        title: 'Live Standings',
        desc: 'Championship points updated in real time alongside fan opinion ratings. See who the crowd favours versus who leads on track.',
    },
    {
        icon: <Grid3x3 className="w-5 h-5 stroke-[#e8002d] fill-none stroke-[1.5]" />,
        title: 'Race by Race',
        desc: 'Every round gets its own rating window — covering Practice, Sprint, Qualifying and Race. Review the full arc of any driver\'s season.',
    },
    {
        icon: <Clock className="w-5 h-5 stroke-[#e8002d] fill-none stroke-[1.5]" />,
        title: 'Rating Windows',
        desc: 'Windows open at race start and close 48 hours post-race. Rate while the performance is still fresh in your mind.',
    },
    {
        icon: <Users className="w-5 h-5 stroke-[#e8002d] fill-none stroke-[1.5]" />,
        title: 'Global Fanbase',
        desc: 'Aggregated ratings from fans worldwide — no press votes, no algorithmic bias. Pure, unfiltered fan opinion from every corner of the grid.',
    },
]



export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 border-card-border">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="font-condensed font-extrabold text-[clamp(2rem,3.5vw,3.2rem)] uppercase tracking-[-0.01em] leading-none mb-14 max-w-120">
                Everything you need to judge the grid
            </h2>

            <div className="grid grid-cols-3 gap-px bg-white/8 border border-card-border rounded-[6px] overflow-hidden">
                {FEATURES.map((f) => (
                    <div key={f.title} className="bg-[#111113] p-10 hover:bg-[#17171a] transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-[#e8002d]/10 flex items-center justify-center mb-5">
                            {f.icon}
                        </div>
                        <div className="font-condensed text-[1.1rem] font-bold uppercase tracking-[0.04em] mb-2.5">{f.title}</div>
                        <div className="text-[0.875rem] text-[#888] leading-[1.65] font-light">{f.desc}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}