import { Dashboard } from "@/components/dashboard";
import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Dashboard />
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-amber-100/40 sm:px-6">
        Cookie Pulse is open source. It talks only to the public Cookie Chain RPC and Cookiescan
        explorer. No private keys are stored in this repo.
      </footer>
    </div>
  );
}
