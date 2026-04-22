"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        style: {
          background: "#0f1117",
          border: "1px solid #1e2433",
          color: "#e2e8f0",
          fontFamily: "var(--font-geist-sans)",
        },
        classNames: {
          error: "!border-red-500/30 !bg-red-950/80",
          success: "!border-emerald-500/30 !bg-emerald-950/80",
          warning: "!border-amber-500/30 !bg-amber-950/80",
          info: "!border-blue-500/30 !bg-blue-950/80",
        },
      }}
    />
  );
}