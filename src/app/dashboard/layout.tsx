"use client";

import { Layout } from "@/components/dashboard/Layout/DashboardLayout";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
