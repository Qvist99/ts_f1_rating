"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function signInWithGoogle(next: string = "/dashboard") {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${next}`,
    },
  });

  if (error) {
    console.error(error);
    redirect("/error");
  }

  // data.url is the Google consent screen URL
  redirect(data.url);
}

export async function signOut(redirectTo: string = "/dashboard") {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(redirectTo);
}
