import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UserProfile from "@/components/UserProfile";
import { DashboardContent } from "@/components/DashboardContent";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <UserButton />
        </div>
        
        <div className="space-y-6">
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Welcome to your dashboard!</h2>
            <p className="text-gray-600 dark:text-gray-300">
              You are successfully authenticated with Clerk. Here you can manage your account and view your profile information.
            </p>
          </div>
          
          <UserProfile />
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}
