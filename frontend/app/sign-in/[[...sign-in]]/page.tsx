"use client";

import dynamic from "next/dynamic";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
const SignIn = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignIn), { ssr: false });

export default function SignInPage() {
  if (DEMO_MODE) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-white/10 bg-panel/80 p-8 text-center">
          <h1 className="font-display text-2xl text-white">Demo mode active</h1>
          <p className="mt-3 text-sm text-mist/70">
            Sign-in is disabled locally. Use the navigation to explore the demo dashboard and reports.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <SignIn appearance={{ elements: { card: "bg-panel/90 border border-white/10 shadow-glass" } }} />
    </div>
  );
}
