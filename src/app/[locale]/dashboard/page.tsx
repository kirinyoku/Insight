import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  /*
    The origin query is needed to redirect the user 
    back to this page after authorization.
  */
  if (!user || !user?.id) redirect("/auth-callback?origin=dashboard");

  // get user from DB
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  // if the user doesn't exist in DB, redirect to the AuthCallback page
  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <Dashboard />;
}
