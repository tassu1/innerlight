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

const MoodChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const token = localStorage.getItem("token"); // Or replace with your actual key
        const response = await axios.get('/api/moods/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Mood API response:", response.data); // 👈 Debug log

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
        <div className="custom-tooltip">
          <p className="label">{data.fullDate ? new Date(data.fullDate).toLocaleDateString() : label}</p>
          <p className="intro">Mood: {data.mood}/5</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      {loading ? (
        <div className="chart-loading">Loading your mood history...</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#555' }}
            />
            <YAxis
              domain={[1, 5]}
              tick={{ fill: '#555' }}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#6a9bf4"
              fill="#6a9bf4"
              fillOpacity={0.1}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#6a9bf4"
              strokeWidth={2}
              dot={{ r: 4, fill: '#6a9bf4' }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      {error && (
        <div className="chart-error">
          Couldn't load recent mood data. Showing placeholder.
        </div>
      )}
    </div>
  );
};

export default MoodChart;
