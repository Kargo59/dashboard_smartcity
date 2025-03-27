import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Weight } from "lucide-react";
import { format } from "date-fns";
import { bounds } from "leaflet";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MultiLineChart = ({ waterLevelRutsweiler, waterLevelKreimbach, waterLevelWolfstein, currentPeriod }) => {
  const calculateTimePeriodBoundary = (period) => {
    const now = Date.now();
    switch (period) {
      case "24h":
        return now - 24 * 60 * 60 * 1000;
      case "7d":
        return now - 7 * 24 * 60 * 60 * 1000;
      case "30d":
        return now - 30 * 24 * 60 * 60 * 1000;
      case "365d":
        return now - 365 * 24 * 60 * 60 * 1000;
      default:
        return now - 24 * 60 * 60 * 1000;
    }
  };

  console.log(waterLevelRutsweiler)

  const periodBoundary = calculateTimePeriodBoundary(currentPeriod);

  // Create datasets with actual timestamps
  const createDataset = (data) => {
    return data.map(item => ({
      x: new Date(item.time).getTime(),
      y: item.value
    }));
  };

const chartData = {
    datasets: [
      {
        label: "Baum 1",
        data: createDataset(waterLevelRutsweiler),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.2, // Adjust this value for more or less smoothing

      },
      {
        label: "Baum 2",
        data: createDataset(waterLevelWolfstein),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.2, // Adjust this value for more or less smoothing

      },
      {
        label: "Baum 3",
        data: createDataset(waterLevelKreimbach),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.2, // Adjust this value for more or less smoothing

      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Bodenfeuchte - zeitlicher Verlauf",
        color: "lightgrey",
        font: {
          size: "18rem",
          weight: "bolder",
        },
      },
      legend: {
        display: true,
        labels: {
          color: "lightgrey",
          padding: 20,
          font: {
            size: "18rem",
          },
        },
        position: "bottom",
        align: "start",
      },
    },
    scales: {
      x: {
        type: 'timeseries',
        time: {
          unit: currentPeriod === "24h" ? 'hour' : 'day',
          displayFormats: {
            hour: 'MMM d, HH:00',
            day: 'MMM d'
          },
          //round: 'hour', // Round time intervals

        },
        min: periodBoundary,
        max: Date.now(),
        grid: {
          color: "lightgrey",
          
        },
        ticks: {
          color: "lightgrey",
          maxTicksLimit: 4,
          font: {
            size: 14,
          },
          callback: function (label, index, labels) {
            const parsedDate = new Date(label);
            const formattedDate = format(parsedDate, "MMM d");
            const secondLine =
              currentPeriod === "24h" ? format(parsedDate, "HH:00") : format(parsedDate, "yyyy");
            return [formattedDate, secondLine];
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Bodenfeuchte (%)",
          color: "lightgrey",
          font: {
            size: 16,
          },
          padding: {
            top: 10,
          },
        },
        min: 0,
        // max: 200,
        grid: {
          color: "lightgrey",

        },
        ticks: {
          maxTicksLimit: 4,
          color: "lightgrey",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="w-100 h-100">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MultiLineChart;