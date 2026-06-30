import yfinance as yf
import json

def fetch_candles(ticker, interval, period):
    df = yf.Ticker(ticker).history(interval=interval, period=period)
    df = df.reset_index()
    out = []
    for _, row in df.iterrows():
            out.append({
    "time": int(row.iloc[0].timestamp()),
    "open": round(row["Open"], 2),
    "high": round(row["High"], 2),
    "low": round(row["Low"], 2),
    "close": round(row["Close"], 2),
}),
    return out

candles = fetch_candles("NQ=F", "5m", "5d")

with open("/Users/percedoutprince/Documents/GitHub/finsec-wait/public/demo-data/NQ=F-5m.json", "w") as f:
    json.dump(candles, f)

print(f"wrote {len(candles)} candles")