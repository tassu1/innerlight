import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceLine
} from 'recharts';

const MoodChart = ({ theme, data }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced theme with gradients
  const defaultTheme = {
    primary: "#7C3AED",
    secondary: "#1E1B4B",
    dark: "#0F172A",
    light: "#E2E8F0",
    accent: "#10B981",
    gradientStart: "#8B5CF6",
    gradientEnd: "#EC4899",
    gridColor: "rgba(148, 163, 184, 0.2)",
    tooltipBg: "rgba(30, 27, 75, 0.95)"
  };
  
  const currentTheme = theme || defaultTheme;

  const generateDefaultData = () => {
    const defaultData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      defaultData.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        dateStr: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        mood: null,
        fullDate: date.toISOString(),
        hasData: false,
        date: date
      });
    }

    return defaultData;
  };

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('/api/moods/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('API returned invalid data format');
        }

        const processedData = response.data.map(item => ({
          day: item.fullDate
            ? new Date(item.fullDate).toLocaleDateString('en', { weekday: 'short' })
            : 'N/A',
          dateStr: item.fullDate
            ? new Date(item.fullDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })
            : 'N/A',
          mood: item.mood !== null && item.mood !== undefined ? item.mood : null,
          fullDate: item.fullDate || new Date().toISOString(),
          hasData: item.mood !== null && item.mood !== undefined,
          date: new Date(item.fullDate || new Date()),
          note: item.note || null
        }));

        // Sort data by date in ascending order
        processedData.sort((a, b) => a.date - b.date);

        const defaultData = generateDefaultData();
        const mergedData = defaultData.map(defaultDay => {
          const foundDay = processedData.find(d =>
            new Date(d.fullDate).toDateString() === defaultDay.date.toDateString()
          );
          return foundDay || defaultDay;
        });

        // Sort merged data by date
        mergedData.sort((a, b) => a.date - b.date);

        setChartData(mergedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch mood data:', err);
        setError(err.message);
        const defaultData = generateDefaultData();
        defaultData.sort((a, b) => a.date - b.date);
        setChartData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  // Update chart data when props.data changes
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const enhancedData = data.map(item => ({
        ...item,
        date: new Date(item.fullDate),
        dateStr: item.fullDate
          ? new Date(item.fullDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })
          : 'N/A'
      }));
      
      // Sort data by date in ascending order
      enhancedData.sort((a, b) => a.date - b.date);
      setChartData(enhancedData);
    }
  }, [data]);

  // Calculate average mood for reference line
  const averageMood = useMemo(() => {
    const validData = chartData.filter(d => d.mood !== null);
    if (validData.length === 0) return null;
    return validData.reduce((acc, val) => acc + val.mood, 0) / validData.length;
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const moodValue = data.mood;
      
      return (
        <div 
          className="p-4 rounded-lg shadow-xl border backdrop-blur-sm"
          style={{
            backgroundColor: currentTheme.tooltipBg,
            borderColor: currentTheme.primary,
            color: currentTheme.light
          }}
        >
          <p className="font-semibold text-sm mb-1">
            {data.fullDate ? new Date(data.fullDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            }) : label}
          </p>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getMoodColor(moodValue) }}
            />
            <p className="font-bold" style={{ color: getMoodColor(moodValue) }}>
              {moodValue !== null ? `Mood: ${moodValue}/5` : 'No data recorded'}
            </p>
          </div>
          {data.note && (
            <p className="text-xs mt-2 italic" style={{ color: currentTheme.light }}>
              "{data.note}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getMoodColor = (value) => {
    if (value === null || value === undefined) return currentTheme.secondary;
    if (value <= 1) return '#EF4444'; // Red for very low
    if (value <= 2) return '#F59E0B'; // Orange for low
    if (value <= 3) return '#10B981'; // Green for neutral
    if (value <= 4) return '#3B82F6'; // Blue for good
    return '#8B5CF6'; // Purple for great
  };

  const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;
    
    if (payload.mood === null) return null;
    
    return (
      <>
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill={getMoodColor(payload.mood)}
          stroke={currentTheme.light}
          strokeWidth={2}
          className="shadow-lg"
        />
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={currentTheme.light}
          className="opacity-80"
        />
      </>
    );
  };

  const CustomizedActiveDot = (props) => {
    const { cx, cy } = props;
    
    return (
      <>
        <circle
          cx={cx}
          cy={cy}
          r={12}
          fill={currentTheme.primary}
          stroke={currentTheme.light}
          strokeWidth={3}
          className="animate-pulse"
        />
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill={currentTheme.light}
        />
      </>
    );
  };

  const CustomYAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <circle
          cx={-10}
          cy={0}
          r={6}
          fill={getMoodColor(payload.value)}
          stroke={currentTheme.light}
          strokeWidth={1}
        />
        <text
          x={-20}
          y={4}
          textAnchor="end"
          fontSize={12}
          fill={currentTheme.light}
          opacity={0.8}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const CustomXAxisTick = ({ x, y, payload }) => {
    const dataPoint = chartData.find(d => d.day === payload.value);
    const isToday = dataPoint && dataPoint.date.toDateString() === new Date().toDateString();
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fontSize={12}
          fontWeight={isToday ? 'bold' : 'normal'}
          fill={isToday ? currentTheme.primary : currentTheme.light}
          opacity={isToday ? 1 : 0.8}
        >
          {dataPoint ? dataPoint.dateStr : payload.value}
        </text>
        <text
          x={0}
          y={0}
          dy={32}
          textAnchor="middle"
          fontSize={10}
          fill={currentTheme.light}
          opacity={0.6}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="chart-container h-full w-full relative p-2">
      {loading ? (
        <div 
          className="flex items-center justify-center h-full"
          style={{ color: currentTheme.light }}
        >
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full animate-spin border-2 border-t-transparent" 
                 style={{ borderColor: currentTheme.primary }} />
            <span>Loading your mood history...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-semibold" style={{ color: currentTheme.light }}>
              Mood History
            </h3>
            {!isNaN(averageMood) && (
              <div className="flex items-center gap-2 text-sm" style={{ color: currentTheme.light }}>
                <span>Average:</span>
                <span className="font-bold" style={{ color: getMoodColor(averageMood) }}>
                  {averageMood.toFixed(1)}/5
                </span>
              </div>
            )}
          </div>
          
          <ResponsiveContainer width="100%" height="80%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentTheme.gradientStart} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={currentTheme.gradientEnd} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={currentTheme.gridColor}
                vertical={false}
              />
              
              <XAxis
                dataKey="day"
                tick={<CustomXAxisTick />}
                axisLine={false}
                tickLine={false}
              />
              
              <YAxis
                domain={[1, 5]}
                tick={<CustomYAxisTick />}
                axisLine={false}
                tickLine={false}
                tickCount={5}
              />
              
              <Tooltip 
                content={<CustomTooltip />}
                wrapperStyle={{ zIndex: 100 }}
                cursor={{ 
                  stroke: currentTheme.primary, 
                  strokeWidth: 1, 
                  strokeDasharray: "5 5" 
                }}
              />
              
              {/* Average mood reference line */}
              {!isNaN(averageMood) && (
                <ReferenceLine 
                  y={averageMood} 
                  stroke={currentTheme.light}
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                  label={{
                    value: 'Avg', 
                    position: 'right',
                    fill: currentTheme.light,
                    fontSize: 10,
                    opacity: 0.7
                  }} 
                />
              )}
              
              <Area
                type="monotone"
                dataKey="mood"
                stroke="url(#moodGradient)"
                fill="url(#moodGradient)"
                fillOpacity={0.3}
                connectNulls
                activeDot={false}
              />
              
              <Line
                type="monotone"
                dataKey="mood"
                stroke={currentTheme.primary}
                strokeWidth={3}
                dot={<CustomizedDot />}
                activeDot={<CustomizedActiveDot />}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Mood level legend */}
         
        </>
      )}
      
      {error && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg"
          style={{ color: currentTheme.light }}
        >
          <div className="text-center p-4">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: '#EF4444', color: 'white' }}>
              !
            </div>
            <p className="text-sm">Couldn't load mood data</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs mt-2 px-3 py-1 rounded-md"
              style={{ backgroundColor: currentTheme.primary, color: currentTheme.light }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodChart;