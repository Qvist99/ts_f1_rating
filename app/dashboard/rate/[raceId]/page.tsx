import { RatingStoreProvider } from "@/components/providers/RatingsProvider"
import Header from "@/components/ui/rate/Header"
import DriverGrid from "@/components/ui/rate/DriverGrid"
import { redirect } from "next/navigation"
import { getRaceWithRatings } from "@/lib/supabase/queries/races"
import { getDriversWithRatingsForRace } from "@/lib/supabase/queries/drivers"
import { getUser } from "@/lib/supabase/queries/auth"

export default async function page({ params }: { params: Promise<{ raceId: string }> }) {
    const { raceId } = await params

    const { data: { user } } = await getUser();

    if (!user) {
        // handle unauthenticated user, maybe redirect to login page or show an error message
        return <div></div>
    }

    const [{ data: raceData, error: raceError }, { data: driversData, error: driversError }] = await Promise.all([
        getRaceWithRatings(raceId, user.id),
        getDriversWithRatingsForRace(raceId, user.id)
    ])

    if (raceError || driversError) {
        console.error("Error fetching data:", raceError || driversError);
        // handle errors, maybe show an error message or redirect
        return <div></div>
    }

    const ratingDeadline = new Date(raceData.date_end)
    ratingDeadline.setDate(ratingDeadline.getDate() + 2)

    // in the future we might show what ratings the user made for that week but for now we just redirect as we dont have UI for that
    const now = new Date()
    if (now > ratingDeadline) {
        console.log("Rating deadline has passed, redirecting to dashboard.")
        redirect("/dashboard")
    }

    const drivers = driversData.map(rd => rd.drivers) ?? []

    return (
        <RatingStoreProvider>
            <Header raceWithRatings={raceData} />
            <DriverGrid drivers={drivers} race={raceData} />

        </RatingStoreProvider>
    )
}
