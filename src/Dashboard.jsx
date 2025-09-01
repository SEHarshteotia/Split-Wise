import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { LayoutDashboard, Wallet, Users, Clock, User, LogOut, Menu } from "lucide-react";
import Charts from "./Charts";
import Main1 from "./Main1";

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "Expenses", icon: <Wallet size={20} />, href: "/expenses" },
    { name: "Friends", icon: <Users size={20} />, href: "/friends" },
    { name: "History", icon: <Clock size={20} />, href: "/history" },
    { name: "Profile", icon: <User size={20} />, href: "/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-blue-700 text-white p-6 space-y-8 shadow-lg transition-all duration-300`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center left-0">
          {!collapsed && <h1 className="text-xl font-bold">SplitEasy</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-blue-600"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="space-y-3 font-medium">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 hover:bg-blue-600 px-3 py-2 rounded-md transition"
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </a>
          ))}
          <a
            href="/logout"
            className="flex items-center gap-3 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md transition"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white shadow-md px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-700">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, User</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 space-y-8 bg-gray-100">
          <section data-aos="fade-up" className="bg-white rounded-2xl shadow-md p-6">
            <Main1 />
          </section>

          <section data-aos="fade-up" className="bg-white rounded-2xl shadow-md p-6">
            <Charts />
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

