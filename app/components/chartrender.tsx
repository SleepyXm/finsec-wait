import { useEffect, useRef, useCallback } from 'react';
import { CandlestickSeries, ColorType } from 'lightweight-charts';
import { useChart } from '../components/charts/hooks/useChart';
import { type ChartTheme, defaultChartTheme } from '../components/charts/themes/themes';

export const CandleStickChart: React.FC<{
  data: any[];
  colors?: any;
  renderTradeUI?: React.ReactNode;
  trades?: any[];
  positions?: any[];
  livePnLMap?: Record<string, number>;
  isCreatingStrategy?: boolean;
  onClosePosition?: (id: string) => void;
  onAnnotation?: (annotation: any) => void;
  theme?: ChartTheme; 
}> = ({ data, colors = {}, renderTradeUI, trades = [], positions = [], livePnLMap = {}, isCreatingStrategy = false, onClosePosition, onAnnotation, theme = defaultChartTheme }) => {
  const priceLinesRef = useRef<any[]>([]);

  const getPositionLabel = useCallback((position: any) => {
    const id = position.position_id ?? position.id;
    const pnl = livePnLMap[id] ?? 0;

    return (
      `${position.side.toUpperCase()} ` +
      `${position.symbol} ` +
      `${pnl >= 0 ? '+' : ''}` +
      `$${pnl.toFixed(2)}`
    );
  }, [livePnLMap]);

  const { containerRef, chartRef, seriesRef } = useChart(
    CandlestickSeries,
    {
      upColor: theme.bullCandle,
      downColor: theme.bearCandle,
      borderUpColor: theme.bullCandle,
      borderDownColor: theme.bearCandle,
      wickUpColor: theme.wickUpColor,
      wickDownColor: theme.wickDownColor,
    },
  
    {
      layout: {
        background: theme.background.type === 'solid'
          ? { type: ColorType.Solid, color: theme.background.color }
          : { type: ColorType.Solid, color: 'transparent' },
        textColor: theme.text,
      },
      grid: {
        vertLines: { color: theme.grid },
        horzLines: { color: theme.grid },
      },
      crosshair: {
        vertLine: { color: theme.crosshair },
        horzLine: { color: theme.crosshair },
      },
    },
    {
      positions,

      getPositionLabel: (position) => {
        const id =
          position.position_id ?? position.id;

        const pnl = livePnLMap[id] ?? 0;

        return (
          `${position.side.toUpperCase()} ` +
          `${position.symbol} ` +
          `${pnl >= 0 ? '+' : ''}` +
          `$${pnl.toFixed(2)}`
        );
      },
    },
    theme
  );

  const hasSetInitialRange = useRef(false);
const initialVisibleBarsRef = useRef<number | null>(null);

useEffect(() => {
  const chart = chartRef.current;
  const series = seriesRef.current;
  const container = containerRef.current;

  if (!series || !chart || !container || data.length < 2) return;

  const timeScale = chart.timeScale();

  const interval = Number(data[1].time) - Number(data[0].time);
  const lastCandle = data[data.length - 1];

  if (!hasSetInitialRange.current) {
    const barSpacing = timeScale.options().barSpacing;
    const containerWidth = container.clientWidth;

    initialVisibleBarsRef.current = Math.ceil(containerWidth / barSpacing);
    hasSetInitialRange.current = true;
  }

  const visibleBars = initialVisibleBarsRef.current!;

  const rightOffsetBars = Math.floor(visibleBars * 0.15);

  const whitespace = Array.from({ length: rightOffsetBars }, (_, i) => ({
    time: Number(lastCandle.time) + interval * (i + 1),
  }));

  series.setData([...data, ...whitespace]);

  let from: number;
  let to: number;

  // Keep first candle pinned to the far left until the visible window is full
  if (data.length <= visibleBars) {
    from = -0.5;
    to = visibleBars - 0.5;
  } else {
    // After the chart fills, follow the latest candle
    const latestCandleIndex = data.length - 1;

    to = latestCandleIndex + rightOffsetBars + 0.5;
    from = to - visibleBars;
  }

  timeScale.setVisibleLogicalRange({ from, to });
}, [data]);


  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};