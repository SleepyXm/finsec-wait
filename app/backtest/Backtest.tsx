import { useEffect, useState } from "react";
import { CandleStickChart } from "~/components/chartrender";
import BacktestControls from "./components/BacktestControls";
import { type BacktestSession, type BacktestCandle } from "~/types/backend";

const DATASET = { file: "/demo-data/spy-5m.json", ticker: "SPY", interval: "5m" };

export default function ReplayDemo() {
  const [candles, setCandles] = useState<BacktestCandle[]>([]);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetch(DATASET.file)
      .then((res) => res.json())
      .then((data: BacktestCandle[]) => setCandles(data));
  }, []);

  const visibleCandles = candles.slice(0, cursor);
  const latest = visibleCandles[visibleCandles.length - 1];

  const session: BacktestSession = {
    session_id: "demo",
    ticker: DATASET.ticker,
    interval: DATASET.interval,
    date_from: "",
    date_to: "",
    starting_balance: 0,
    candle_count: candles.length,
    created_at: new Date().toISOString(),
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold my-4">{DATASET.ticker} — Replay demo</h2>

      {visibleCandles.length > 0 ? (
        <CandleStickChart data={visibleCandles} renderTradeUI={null} trades={[]} />
      ) : (
        <p className="text-zinc-500 text-sm">Loading...</p>
      )}

      <BacktestControls
        session={session}
        cursor={cursor}
        setCursor={setCursor}
        totalCandles={candles.length}
        playing={playing}
        setPlaying={setPlaying}
      />

      {latest && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { label: "Candles seen", value: visibleCandles.length },
            { label: "Current open", value: `$${latest.open.toFixed(2)}` },
            { label: "Current close", value: `$${latest.close.toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-zinc-800 px-3 py-2">
              <p className="text-xs text-zinc-400">{label}</p>
              <p className="text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}