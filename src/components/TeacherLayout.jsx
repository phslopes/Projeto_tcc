import React from "react";
import { Outlet } from "react-router-dom";
import Teachersidebar from "./sidebar/Teachersidebar";  

export default function TeacherLayout({ userRole = "professor" }) {
  return (
    <div className="flex h-screen">
      <Teachersidebar userRole={userRole} />

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
