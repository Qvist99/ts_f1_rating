"use client"

import { DriverWithStats } from "@/lib/types"
import FilterBar from "./FilterBar";
import DriverCard from "./DriverCard";
import { useState, useMemo } from "react";
import { UserProfile } from "@/lib/types";

interface DriversListProps {
    drivers: DriverWithStats[];
    user?: UserProfile | null;
}


export default function DriversList({ drivers, user }: DriversListProps) {
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<"avg_rating" | "most_discussed">("avg_rating")
    const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null)

    const filteredDrivers = useMemo(() => {
        return drivers
            .filter(d =>
                `${d.first_name} ${d.last_name}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
            .sort((a, b) => {
                if (sort === "avg_rating") {
                    return (b.driver_stats.avg_rating_season ?? 0) - (a.driver_stats.avg_rating_season ?? 0)
                }
                return (b.driver_stats.total_comments ?? 0) - (a.driver_stats.total_comments ?? 0)
            })
    }, [drivers, search, sort])

    function handleExpand(driverId: string) {
        setExpandedDriverId(prev => prev === driverId ? null : driverId)
    }

    return (
        <div>
            <FilterBar search={search} onSearch={setSearch} sort={sort} onSort={setSort} />
            <div className="overflow-scroll h-screen pb-40 -mx-36 px-36">
                {filteredDrivers.map((driver, index) => (
                    <DriverCard
                        key={driver.id}
                        driver={driver}
                        isExpanded={expandedDriverId === driver.id}
                        onToggle={() => handleExpand(driver.id)}
                        user={user}
                    />
                ))}
            </div>
        </div>
    )
}
