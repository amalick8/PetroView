"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <SignIn appearance={{ elements: { card: "bg-panel/90 border border-white/10 shadow-glass" } }} />
    </div>
  );
}
