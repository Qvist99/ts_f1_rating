import AccountNavbar from "@/components/ui/account/AccountNavbar"
import { redirect } from "next/navigation"
import ProfileInformationSection from "@/components/ui/account/ProfileInformationSection"
import AccountSettingsSection from "@/components/ui/account/AccountSettingsSection"
import SignOutSection from "@/components/ui/account/SingOutSection"
import DangerZoneSection from "@/components/ui/account/DangerZoneSection"
import { getUser } from "@/lib/supabase/queries/auth"
import { getProfileByUserId } from "@/lib/supabase/queries/profiles"

export default async function Page() {
    const { data: { user } } = await getUser();

    //This should never happend as the route is protected by auth middleware
    if (!user) {
        console.error("User not authenticated");
        redirect("/dashboard");
    }

    const { data: profileData, error } = await getProfileByUserId(user.id);

    if (error) {
        console.error("Failed to fetch user profile:", error);
        redirect("/dashboard");
    }

    return (
        <div className="flex flex-col gap-12">
            <AccountNavbar />
            <div className="w-full flex justify-center">
                <div className="flex flex-col w-3xl">
                    <ProfileInformationSection profile={profileData} />
                    <Separator />
                    <AccountSettingsSection profile={profileData} />
                    <SignOutSection />
                    <DangerZoneSection profile={profileData} />
                </div>
            </div>
        </div>
    )
}



function Separator() {
    return <div className="w-full h-px bg-card-border my-6" />
}