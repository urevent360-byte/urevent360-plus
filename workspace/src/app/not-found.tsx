
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <Frown className="w-24 h-24 text-primary mb-4" />
      <h1 className="text-6xl font-extrabold text-primary tracking-tighter">404</h1>
      <h2 className="text-3xl font-semibold text-foreground mt-2 mb-4">Page Not Found</h2>
      <p className="max-w-md text-muted-foreground mb-8">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild>
        <Link href="/">Go back to Homepage</Link>
      </Button>
    </div>
  );
}
