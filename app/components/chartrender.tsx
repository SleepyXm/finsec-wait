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

useEffect(() => {
  if (!seriesRef.current || !chartRef.current || data.length < 2) return;

  const interval = data[1].time - data[0].time;
  const barSpacing = chartRef.current.timeScale().options().barSpacing;
  const containerWidth = containerRef.current?.clientWidth ?? 0;
  const lastCandle = data[data.length - 1];

  const visibleBars = Math.ceil(containerWidth / barSpacing);

  const whitespace = [];
  for (let i = 1; i <= visibleBars; i++) {
    whitespace.push({ time: lastCandle.time + interval * i });
  }

  seriesRef.current.setData([...data, ...whitespace]);

  // Pin the view so the first candle sits at the left edge
  chartRef.current.timeScale().setVisibleLogicalRange({
    from: -0.5,
    to: visibleBars - 0.5,
  });
}, [data]);


  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};