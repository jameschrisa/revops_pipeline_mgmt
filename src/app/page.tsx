import { redirect } from "next/navigation";

// No marketing page — the product opens directly on the dashboard.
export default function Home() {
  redirect("/dashboard");
}
