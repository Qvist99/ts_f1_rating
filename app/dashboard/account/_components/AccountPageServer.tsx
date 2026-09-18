import ProfileInformationSection from "@/components/ui/account/ProfileInformationSection"
import AccountSettingsSection from "@/components/ui/account/AccountSettingsSection"
import SignOutSection from "@/components/ui/account/SingOutSection"
import DangerZoneSection from "@/components/ui/account/DangerZoneSection"
import { getUser } from "@/lib/supabase/queries/auth"
import { getProfileByUserId } from "@/lib/supabase/queries/profiles"
import { redirect } from "next/navigation"

export default async function AccountPageServer() {
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
        <>
            <ProfileInformationSection profile={profileData} />
            <Separator />
            <AccountSettingsSection profile={profileData} />
            <SignOutSection />
            <DangerZoneSection profile={profileData} />
        </>
    )
}


function Separator() {
    return <div className="w-full h-px bg-card-border my-6" />
}