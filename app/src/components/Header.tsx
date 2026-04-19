"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function Header({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
      <span className="text-white font-bold tracking-tight">
        CompTIA A+ Studio
      </span>
      <div className="flex items-center gap-4">
        <span className="text-zinc-400 text-sm hidden sm:block">{userEmail}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
