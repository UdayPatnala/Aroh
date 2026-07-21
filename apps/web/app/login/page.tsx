"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import ArohLogo from "../components/aroh-logo";

export default function LoginPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 flex justify-center items-center font-sans bg-mesh-light">
      <div className="flex flex-col items-center gap-3">
        <ArohLogo size={52} />
        <span className="text-xs font-bold text-slate-600">Redirecting to Ecosystem Workspace...</span>
      </div>
    </div>
  );
}
