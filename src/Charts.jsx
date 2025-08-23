import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Charts() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const data = [
    { name: "Jan", expenses: 400, income: 240 },
    { name: "Feb", expenses: 300, income: 139 },
    { name: "Mar", expenses: 200, income: 980 },
    { name: "Apr", expenses: 278, income: 390 },
    { name: "May", expenses: 189, income: 480 },
    { name: "Jun", expenses: 239, income: 380 },
  ];

  const pieData = [
    { name: "Food", value: 400 },
    { name: "Travel", value: 300 },
    { name: "Shopping", value: 300 },
    { name: "Bills", value: 200 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Line Chart */}
      <div
        data-aos="fade-up"
        className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition transform hover:scale-[1.02]"
      >
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Expense vs Income Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div
        data-aos="fade-up"
        className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition transform hover:scale-[1.02]"
      >
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Monthly Breakdown
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="expenses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div
        data-aos="fade-up"
        className="bg-white rounded-2xl shadow-xl p-6 col-span-1 lg:col-span-2 hover:shadow-2xl transition transform hover:scale-[1.02]"
      >
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Expense Categories
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;


