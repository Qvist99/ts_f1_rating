import Link from 'next/link'


export default function Navbar() {
    const sections = [
        { name: 'Features', href: '#how-it-works' },
        { name: 'Rate Drivers', href: '#fan-opinion' },
        { name: 'Schedule', href: '#schedule' },
    ]

    return (
        <nav className="flex items-center justify-between h-15 border-b border-card-border  px-10 fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/88 backdrop-blur-xl ">
            <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-[#e8002d] rounded-full animate-pulse shrink-0" />
                <Link href="#hero" className="font-condensed font-extrabold text-[1.2rem] tracking-[0.04em] uppercase text-[#f0f0f0]">
                    F1 Ratings
                </Link>
            </div>

            <div className="flex items-center gap-8">
                {sections.map((section) => (
                    <Link
                        key={section.name}
                        href={section.href}
                        className="text-[#888] text-sm font-medium tracking-[0.03em] transition-colors hover:text-[#f0f0f0]"
                    >
                        {section.name}
                    </Link>
                ))}
                <Link
                    href="/dashboard"
                    className="font-condensed text-[0.78rem] font-semibold tracking-wider uppercase text-white bg-[#e8002d] py-1.75 px-4.5 rounded-[3px] hover:bg-[#ff1a45] transition-colors"
                >
                    Open App
                </Link>
            </div>
        </nav>
    )
}