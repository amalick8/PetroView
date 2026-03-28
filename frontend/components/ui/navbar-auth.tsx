"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Datasets", href: "/datasets" },
  { label: "Reports", href: "/reports/1" },
  { label: "Settings", href: "/settings" }
];

export default function NavbarAuth() {
  return (
    <nav className="flex items-center justify-between rounded-full border border-white/10 bg-panel/70 px-6 py-3 backdrop-blur-xl">
      <Link href="/" className="font-display text-lg text-white">
        PetroView
      </Link>
      <div className="hidden items-center gap-6 text-sm text-mist/70 md:flex">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-white">
            {item.label}
          </Link>
        ))}
      </div>
      <SignedOut>
        <SignInButton>
          <Button variant="outline" size="sm">
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton appearance={{ elements: { userButtonAvatarBox: "ring-2 ring-gold/40" } }} />
      </SignedIn>
    </nav>
  );
}
