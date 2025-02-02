import { useState } from "react";
import { Bell, FileText, Users, Menu, X, LogOut, Map } from "lucide-react";
import ReportPage from "./reports/ReportPage";
import NoticePage from "./notice/NoticePage";
import UsersPage from "./users/UsersPage";
import MapPage from './Maps/MapPage';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("reports");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log("Sesión cerrada");
    window.location.href = "/admin/login";
  };

  const NavButton = ({ icon: Icon, label, tabName, onClick }) => (
    <button
      onClick={onClick || (() => {
        setActiveTab(tabName);
        setIsMobileMenuOpen(false);
      })}
      className={`flex items-center w-full p-4 transition-colors duration-200 ${
        activeTab === tabName
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 md:flex-row">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md md:hidden">
        <h2 className="text-xl font-bold text-gray-800">Panel Admin</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white shadow-lg`}
      >
        <div className="hidden md:block p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Panel Admin</h2>
        </div>

        <nav className="mt-4">
          <NavButton
            icon={FileText}
            label="Reportes Pendientes"
            tabName="reports"
          />
          <NavButton
            icon={Bell}
            label="Crear Avisos"
            tabName="notices"
          />
          <NavButton
            icon={Users}
            label="Gestión Usuarios"
            tabName="users"
          />
          <NavButton
            icon={Map}
            label="Ver Mapa"
            tabName="map"
          />
          <NavButton
            icon={LogOut}
            label="Cerrar Sesión"
            onClick={handleLogout}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-md">
          <div className="px-4 py-4 md:px-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {activeTab === "reports" && "Gestión de Reportes"}
              {activeTab === "notices" && "Crear Nuevo Aviso"}
              {activeTab === "users" && "Gestión de Usuarios"}
              {activeTab === "map" && "Vista de Mapa"}
            </h1>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {activeTab === "reports" && <ReportPage />}
          {activeTab === "notices" && <NoticePage />}
          {activeTab === "users" && <UsersPage />}
          {activeTab === "map" && <MapPage />}
        </main>
      </div>
    </div>
  );
}