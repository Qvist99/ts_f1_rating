import { Drivers } from "@/lib/types"

interface MarqueeStripProps {
    drivers: Drivers[] | null
}

const backupNames = ["Max Verstappen", "Lewis Hamilton", "Charles Leclerc", "Sergio Perez", "George Russell", "Carlos Sainz", "Lando Norris", "Esteban Ocon", "Fernando Alonso", "Valtteri Bottas"]


export default async function MarqueeStrip({ drivers }: MarqueeStripProps) {
    const names = drivers ? drivers.map(driver => `${driver.first_name} ${driver.last_name}`) : backupNames

    return (
        <div className="border-t border-b border-white/8 py-3.5 overflow-hidden bg-[#111113] -mx-10">
            <div className="flex w-max animate-[marquee_36s_linear_infinite] hover:paused">
                {names.map((name, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2.5 px-7 font-condensed text-[0.78rem] font-semibold tracking-widest uppercase text-[#555] whitespace-nowrap"
                    >
                        <span className="w-1.25 h-1.25 rounded-full bg-[#e8002d] shrink-0" />
                        {name}
                    </div>
                ))}
            </div>
        </div>
    )
}