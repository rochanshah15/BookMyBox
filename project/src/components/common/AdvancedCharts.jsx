import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Doughnut, Line, PolarArea, Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  RadialLinearScale
);

// Enhanced Revenue Trend Chart
export const EnhancedRevenueTrend = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data?.values || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => `${context[0].label}`,
          label: (context) => `Revenue: ₹${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: (value) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-64"
    >
      <Line data={chartData} options={options} />
    </motion.div>
  );
};

// Enhanced Sport Distribution Chart
export const EnhancedSportDistribution = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const sportColors = {
    'Cricket': '#10B981',
    'Football': '#3B82F6',
    'Tennis': '#F59E0B',
    'Badminton': '#EF4444',
    'Basketball': '#F97316',
    'Pickleball': '#8B5CF6',
    'Volleyball': '#06B6D4',
    'Squash': '#84CC16',
  };

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        data: data?.values || [],
        backgroundColor: data?.labels?.map(label => sportColors[label] || '#6B7280') || [],
        borderColor: '#fff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
          color: '#374151',
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].backgroundColor[i],
                  lineWidth: 0,
                  pointStyle: 'circle',
                  index: i
                };
              });
            }
            return [];
          }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-64"
    >
      <Doughnut data={chartData} options={options} />
    </motion.div>
  );
};

// Booking Activity Heatmap (Bar Chart)
export const BookingActivityChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse space-y-2 w-full">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Hours Played',
        data: data?.values || [],
        backgroundColor: (ctx) => {
          const value = ctx.parsed?.y || 0;
          const max = Math.max(...(data?.values || [1]));
          const opacity = Math.max(0.3, value / max);
          return `rgba(16, 185, 129, ${opacity})`;
        },
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.parsed.y} hours played`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: (value) => `${value}h`,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-64"
    >
      <Bar data={chartData} options={options} />
    </motion.div>
  );
};

// Peak Hours Polar Chart
export const PeakHoursChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Booking Percentage',
        data: data?.values || [],
        backgroundColor: [
          'rgba(139, 92, 246, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgb(139, 92, 246)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 11,
          },
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed.toFixed(1)}%`,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-64"
    >
      <PolarArea data={chartData} options={options} />
    </motion.div>
  );
};

// Monthly Spending Trend with Gradient
export const MonthlySpendingChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse space-y-1 w-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-8 bg-gray-300 dark:bg-gray-600 rounded"
              style={{ width: `${Math.random() * 60 + 40}%` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Monthly Spending',
        data: data?.values || [],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)');
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `Spent: ₹${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: (value) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-64"
    >
      <Line data={chartData} options={options} />
    </motion.div>
  );
};
