import { RatingStoreProvider } from "@/components/providers/RatingsProvider"
import Header from "@/components/ui/rate/Header"
import DriverGrid from "@/components/ui/rate/DriverGrid"
import { createClient } from "@/lib/supabase/server"


export default async function page({ params }: { params: Promise<{ raceId: string }> }) {
    const supabase = await createClient()
    const { raceId } = await params

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // handle unauthenticated user, maybe redirect to login page or show an error message
        return <div></div>
    }

    const [{ data: raceData, error: raceError }, { data: driversData, error: driversError }] = await Promise.all([
        supabase
            .from("races")
            .select(`*, race_ratings!left(*)`)
            .eq("id", raceId)
            .eq("race_ratings.user_id", user.id)
            .single(),
        supabase
            .from("race_drivers")
            .select(`drivers(*, driver_ratings!left(*))`)
            .eq("race_id", raceId)
            .eq("drivers.driver_ratings.race_id", raceId)
            .eq("drivers.driver_ratings.user_id", user.id)
    ])

    if (raceError || driversError) {
        console.error("Error fetching data:", raceError || driversError);
        // handle errors, maybe show an error message or redirect
        return <div></div>
    }

    const drivers = driversData.map(rd => rd.drivers) ?? []

    return (
        <RatingStoreProvider>
            <Header raceWithRatings={raceData} />
            <DriverGrid drivers={drivers} race={raceData} />

        </RatingStoreProvider>
    )
}
