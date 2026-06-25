import type { Route } from "./+types/home";
import WaitlistPage from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FinSec" },
    { name: "description", content: "Turning discretionary setups into verified bots." },
  ];
}

export default function Home() {
  return <WaitlistPage />;
}
