import { Timer } from "@/components/Timer";
import { TodayLog } from "@/components/TodayLog";

export default function Home() {
  return (
    <main className="container">
      <Timer />
      <TodayLog />
    </main>
  );
}
