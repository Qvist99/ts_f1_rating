import AccountNavbar from "@/components/ui/account/AccountNavbar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProfileInformationSection from "@/components/ui/account/ProfileInformationSection"
import AccountSettingsSection from "@/components/ui/account/AccountSettingsSection"
import SignOutSection from "@/components/ui/account/SingOutSection"
import DangerZoneSection from "@/components/ui/account/DangerZoneSection"

export default async function Page() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser()

    //This should never happend as the route is protected by auth middleware
    if (!user) {
        console.error("User not authenticated");
        redirect("/dashboard");
    }

    const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

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