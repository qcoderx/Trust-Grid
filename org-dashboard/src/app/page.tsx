"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem("org_logged_in");
    if (loggedIn) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trust-accent"></div>
    </div>
  );
}
