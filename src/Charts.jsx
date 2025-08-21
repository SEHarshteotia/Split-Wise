import React from "react";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const pieData = [
  { name: "Food", value: 400 },
  { name: "Travel", value: 300 },
  { name: "Shopping", value: 300 },
  { name: "Bills", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const lineData = [
  { month: "Jan", expenses: 4000 },
  { month: "Feb", expenses: 3000 },
  { month: "Mar", expenses: 2000 },
  { month: "Apr", expenses: 2780 },
  { month: "May", expenses: 1890 },
  { month: "Jun", expenses: 2390 },
  { month: "Jul", expenses: 3490 },
];

function Charts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      
      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">Expenses by Category</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">Monthly Expense Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="expenses" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;

