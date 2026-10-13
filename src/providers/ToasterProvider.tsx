"use client";
import { Toaster } from "react-hot-toast";
export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3200,
        style: { fontFamily: "var(--font-bengali)" },
      }}
    />
  );
}
