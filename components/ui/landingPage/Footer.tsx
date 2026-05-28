import Link from 'next/link'
import { Link as LinkIcon } from 'lucide-react'
export default function Footer({ currYear }: { currYear: number }) {



    return (
        <footer className="border-t border-card-border py-7 flex items-center justify-between flex-wrap gap-4 -mx-10 px-10">
            <div className="flex flex-col gap-1.5">
                <div className="text-[0.78rem] text-[#555]">© {currYear} F1 Ratings. Not affiliated with Formula 1 or FOM.</div>
                <div className="flex items-center gap-1.5 text-[0.75rem] text-[#555]">
                    <LinkIcon className="w-3 h-3 opacity-50" />
                    Race data powered by{' '}
                    <Link
                        href="https://openf1.org"
                        target="_blank"
                        rel="noopener"
                        className="text-[#888] border-b border-[#555] hover:text-[#f0f0f0] hover:border-[#888] transition-colors"
                    >
                        OpenF1
                    </Link>
                    {' '}— open-source F1 data for everyone.
                </div>
            </div>
            <div className="flex gap-6">
                <Link href="/policy" className="text-[0.78rem] text-[#555] hover:text-[#888] transition-colors">Privacy</Link>
                {['Terms', 'Contact'].map((l) => (
                    <Link key={l} href="#" className="text-[0.78rem] text-[#555] hover:text-[#888] transition-colors">{l}</Link>
                ))}
            </div>
        </footer>
    )
}