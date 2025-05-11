import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";  

export default function AdminLayout({ userRole = "admin" }) {
  return (
    <div className="flex h-screen">
      <Sidebar userRole={userRole} />

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
