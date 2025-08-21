
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Charts from "./charts";
import Main1 from "./Main1";

function Dashboard() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Spliteasy</h1>
        <nav className="space-y-4">
          <a href="/dashboard" className="block hover:text-green-300">Dashboard</a>
          <a href="/expenses" className="block hover:text-green-300">Expenses</a>
          <a href="/friends" className="block hover:text-green-300">Friends</a>
          <a href="/history" className="block hover:text-green-300">History</a>
          <a href="/profile" className="block hover:text-green-300">Profile</a>
          <a href="/logout" className="block hover:text-green-300">Logout</a>
        </nav>
      </aside>

   
        <main className="flex-1 p-8 space-y-8">
           <Main1 />
        <Charts />
     
      </main>
       

     
     
    </div>
  );
}

export default Dashboard;