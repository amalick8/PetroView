"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <SignUp appearance={{ elements: { card: "bg-panel/90 border border-white/10 shadow-glass" } }} />
    </div>
  );
}
