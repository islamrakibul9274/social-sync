import { auth } from "@/auth";
import LandingUI from "@/components/LandingUI";

export default async function Page() {
  // Securely check if the user has an active session cookie
  const session = await auth();
  
  // Pass the entire user object down to the client (or null if not logged in)
  return <LandingUI user={session?.user || null} />;
}