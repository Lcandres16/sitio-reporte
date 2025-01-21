import { useState } from "react";
import { Bell, FileText, Users } from "lucide-react";
import ReportPage from "./reports/ReportPage";
import NoticePage from "./notice/NoticePage";
import UsersPage from "./users/UsersPage";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("reports");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Panel Admin</h2>
        </div>

        <nav className="mt-4">
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center w-full p-4 ${
              activeTab === "reports"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600"
            }`}
          >
            <FileText className="w-5 h-5 mr-3" />
            Reportes Pendientes
          </button>

          <button
            onClick={() => setActiveTab("notices")}
            className={`flex items-center w-full p-4 ${
              activeTab === "notices"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600"
            }`}
          >
            <Bell className="w-5 h-5 mr-3" />
            Crear Avisos
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center w-full p-4 ${
              activeTab === "users"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600"
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Gestión Usuarios
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === "reports" && "Gestión de Reportes"}
              {activeTab === "notices" && "Crear Nuevo Aviso"}
              {activeTab === "users" && "Gestión de Usuarios"}
            </h1>
          </div>
        </header>

        <main className="p-6">
          {activeTab === "reports" && <ReportPage />}

          {activeTab === "notices" && <NoticePage />}

          {activeTab === "users" && <UsersPage />}
        </main>
      </div>
    </div>
  );
}
