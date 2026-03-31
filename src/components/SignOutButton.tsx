import { signOut } from "@/auth";

export default function SignOutButton() {
  return (
    // We use a standard HTML form connected to a Server Action
    <form
      action={async () => {
        "use server";
        // This securely destroys the session cookie and redirects the user
        await signOut({ redirectTo: "/auth/signin" });
      }}
    >
      <button 
        type="submit" 
        className="px-4 py-2 text-sm font-medium text-white bg-red-600/80 hover:bg-red-600 rounded-lg border border-red-500/30 transition-all backdrop-blur-md"
      >
        Sign Out
      </button>
    </form>
  );
}