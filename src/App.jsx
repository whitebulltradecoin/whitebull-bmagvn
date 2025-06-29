import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

const TIMEFRAMES = [
  { label: "Năm", days: 365 },
  { label: "6 tháng", days: 182 },
  { label: "Quý", days: 91 },
  { label: "45 ngày", days: 45 },
  { label: "15 ngày", days: 15 },
  { label: "Tuần", days: 7 },
  { label: "5 ngày", days: 5 },
  { label: "3 ngày", days: 3 },
  { label: "2 ngày", days: 2 },
  { label: "1 ngày", days: 1 },
  { label: "12 giờ", days: 0.5 },
  { label: "6 giờ", days: 0.25 },
  { label: "4 giờ", days: 0.1667 },
  { label: "1 giờ", days: 0.0417 },
];

export default function BMagTradeApp() {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[2]); // Default: Quý
  const [data, setData] = useState(generateMockData(timeframe.days));

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Giá đóng cửa",
        data: data.map((d) => d.close),
        borderColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvas } = chart;
          const gradient = canvas.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "#16a34a");
          gradient.addColorStop(1, "#dc2626");
          return gradient;
        },
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
        },
      },
    },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <img src="/channels4_profile.jpg" alt="WhiteBull Logo" className="mx-auto mb-4 w-32 h-32 object-contain" />
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">WhiteBull BMAGVN</h1>
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-600">Biểu đồ chia pha BTC theo phương pháp BMag</h2>

      <select
        className="mb-4 p-2 border rounded"
        value={timeframe.label}
        onChange={(e) => {
          const tf = TIMEFRAMES.find((t) => t.label === e.target.value);
          setTimeframe(tf);
          setData(generateMockData(tf.days));
        }}
      >
        {TIMEFRAMES.map((tf) => (
          <option key={tf.label} value={tf.label}>{tf.label}</option>
        ))}
      </select>

      <Line data={chartData} options={options} />

      <div className="mt-4">
        <p><strong>Cực tiểu:</strong> {findMin(data).price} tại {findMin(data).date}</p>
        <p><strong>Cực đại:</strong> {findMax(data).price} tại {findMax(data).date}</p>
      </div>
    </div>
  );
}

function generateMockData(numDays) {
  const result = [];
  const start = new Date("2025-04-01");
  for (let i = 0; i < numDays; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    let base = 74500;
    if (i < numDays * 0.25) base += i * 500;
    else if (i < numDays * 0.5) base = base + (numDays * 0.25 * 500) - (i - numDays * 0.25) * 300;
    else if (i < numDays * 0.75) base = 79000 + ((-1) ** i) * 300;
    else base = 79000 + (i - numDays * 0.75) * 400;
    result.push({ date: date.toISOString().slice(0, 10), close: base });
  }
  return result;
}

function findMin(data) {
  const min = Math.min(...data.map((d) => d.close));
  const item = data.find((d) => d.close === min);
  return { price: item.close, date: item.date };
}

function findMax(data) {
  const max = Math.max(...data.map((d) => d.close));
  const item = data.find((d) => d.close === max);
  return { price: item.close, date: item.date };
}
