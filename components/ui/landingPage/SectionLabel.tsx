export default function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="inline-flex items-center gap-2.5 font-condensed text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-[#e8002d] mb-5">
            <span className="block w-5 h-0.5 bg-[#e8002d]" />
            {children}
        </div>
    )
}