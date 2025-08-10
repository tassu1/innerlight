import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts';

const MoodChart = ({ theme }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default theme if not provided
  const defaultTheme = {
    primary: "#FF7E6B",
    secondary: "#2F4858",
    dark: "#2A2D34",
    light: "#F7F4EA",
    accent: "#FF9E90"
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
        mood: 3,
        fullDate: date.toISOString()
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
          day: item.date
            ? new Date(item.date).toLocaleDateString('en', { weekday: 'short' })
            : 'N/A',
          mood: typeof item.moodLevel === 'number' ? item.moodLevel : 3,
          fullDate: item.date || new Date().toISOString()
        }));

        const defaultData = generateDefaultData();
        const mergedData = defaultData.map(defaultDay => {
          const foundDay = processedData.find(d =>
            new Date(d.fullDate).toDateString() === new Date(defaultDay.fullDate).toDateString()
          );
          return foundDay || defaultDay;
        });

        setChartData(mergedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch mood data:', err);
        setError(err.message);
        setChartData(generateDefaultData());
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="p-3 rounded-lg shadow-md"
          style={{
            backgroundColor: currentTheme.light,
            border: `1px solid ${currentTheme.primary}`
          }}
        >
          <p className="font-medium" style={{ color: currentTheme.dark }}>
            {data.fullDate ? new Date(data.fullDate).toLocaleDateString() : label}
          </p>
          <p style={{ color: currentTheme.primary }}>
            Mood: {data.mood}/5
          </p>
        </div>
      );
    }
    return null;
  };

  const getMoodColor = (value) => {
    if (value <= 1) return '#EF4444'; // Red for very low
    if (value <= 2) return '#F59E0B'; // Orange for low
    if (value <= 3) return '#10B981'; // Green for neutral
    if (value <= 4) return '#3B82F6'; // Blue for good
    return '#8B5CF6'; // Purple for great
  };

  const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={getMoodColor(payload.mood)}
        stroke={currentTheme.light}
        strokeWidth={2}
      />
    );
  };

  const CustomizedActiveDot = (props) => {
    const { cx, cy } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill={currentTheme.primary}
        stroke={currentTheme.light}
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="chart-container h-full w-full">
      {loading ? (
        <div 
          className="flex items-center justify-center h-full"
          style={{ color: currentTheme.secondary }}
        >
          Loading your mood history...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={currentTheme.secondary}
              opacity={0.2}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: currentTheme.secondary }}
              tickLine={{ stroke: currentTheme.secondary }}
            />
            <YAxis
              domain={[1, 5]}
              tick={{ fill: currentTheme.secondary }}
              tickLine={{ stroke: currentTheme.secondary }}
              tickCount={5}
            />
            <Tooltip 
              content={<CustomTooltip />}
              wrapperStyle={{ zIndex: 100 }}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke={currentTheme.primary}
              fill={currentTheme.primary}
              fillOpacity={0.1}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke={currentTheme.primary}
              strokeWidth={3}
              dot={<CustomizedDot />}
              activeDot={<CustomizedActiveDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      {error && (
        <div 
          className="text-center text-sm p-2"
          style={{ color: currentTheme.accent }}
        >
          Couldn't load recent mood data. Showing placeholder.
        </div>
      )}
    </div>
  );
};

export default MoodChart;