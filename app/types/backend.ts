export interface BarReplayCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface BarReplaySession {
  session_id: string;
  ticker: string;
  interval: string;
  date_from: string;
  date_to: string;
  starting_balance: number;
  candle_count: number;
  created_at: string;
}

export interface BarReplayResponse {
  session_id: string;
  ticker: string;
  interval: string;
  candle_count: number;
  starting_balance: number;
  candles: BarReplayCandle[];
}