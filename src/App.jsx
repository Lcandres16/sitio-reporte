import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  Search,
  MapPin,
  FileText,
  Image,
  MessageCircle,
  Grid3X3,
  Menu,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuth, AuthProvider } from "./Context/AuthContext";
import MainDashboard from "./components/MainDashboard";
import IncidentReport from "./components/IncidentReport";
import Incidentmaps from "./components/Incidentmaps";
import IncidentList from "./components/IncidentList";
import LoginPage from "./components/LoginPage";
import NeighborhoodChat from "./components/NeighborhoodChat";
import CommunicationMedia from "./components/CommunicationMedia";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import ReportDetailPage from "./components/admin/reports/ReportDetailPage";
import NotificationPage from "./components/notifications/NotificationPage";
import NotificationButton from "./components/notifications/components/NotificationButton";
import ENV from "./environment/env";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigation = (path, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated()) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <button
          onClick={() => handleNavigation('/incidentmaps')}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
        >
          <MapPin className="w-6 h-6" />
          <span className="text-sm font-medium">Ubicación</span>
        </button>

        <button
          onClick={() => handleNavigation('/incidentlist')}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
        >
          <FileText className="w-6 h-6" />
          <span className="text-sm font-medium">Incidentes</span>
        </button>

        <button
          onClick={() => handleNavigation('/media')}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
        >
          <Image className="w-6 h-6" />
          <span className="text-sm font-medium">Medios de Comunicación</span>
        </button>

        <button
          onClick={() => handleNavigation('/community-chat', true)}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-sm font-medium">Avisos </span>
        </button>

        <button
          onClick={() => handleNavigation('/dashboard')}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
        >
          <Grid3X3 className="w-6 h-6" />
          <span className="text-sm font-medium">Categorias</span>
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated() || !user?.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const CitizenReporter = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${ENV.API_URL}/reportes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar los reportes");
        }

        const data = await response.json();
        setReports(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("No se pudieron cargar los reportes");
        setLoading(false);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Hace un momento";
    if (diffInSeconds < 3600)
      return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400)
      return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowProfileMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="font-bold text-xl cursor-pointer"
              onClick={() => navigate("/")}
            >
              Reporte Ciudadano
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 hover:bg-gray-100 rounded-lg"
              onClick={() => navigate("/report")}
            >
              Report
            </button>
            {isAuthenticated ? (
              <>
                <NotificationButton />
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <svg 
                      className="w-6 h-6 text-gray-800 dark:text-white" 
                      aria-hidden="true" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" 
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => navigate("/profile")}
                      >
                        Profile
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-grey-400"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="relative bg-gradient-to-b from-[#98f5e1] to-transparent h-72">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bienvenido a Reporte Ciudadano
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Una plataforma para que usted informe problemas e incidentes en su comunidad
          </p>
          <button
            className="px-6 py-2 bg-grey-200 text-black rounded-lg hover:bg-blue-200 transition-colors"
            onClick={() => navigate("/report")}
          >
            Crear Reporte
          </button>
        </div>
      </div>

      <MobileNavigation />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border">
            <p className="text-gray-500">No reports yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/report/${report.id}`)}
              >
                <div className="flex items-center gap-4">
                  {report.imagen ? (
                    <img
                      src={`${ENV.API_URL}/${report.imagen}`}
                      alt={report.titulo}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{report.titulo}</h3>
                    <div className="flex gap-2 text-sm text-gray-500">
                      <span>{getTimeAgo(report.created_at)}</span>
                      {report.ubicacion && (
                        <>
                          <span>•</span>
                          <span>{report.ubicacion}</span>
                        </>
                      )}
                    </div>
                    {report.descripcion && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {report.descripcion}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      report.estado === "completado"
                        ? "bg-green-100 text-green-800"
                        : report.estado === "en_proceso"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {report.estado === "resuelto"
                      ? "Completado"
                      : report.estado === "en_proceso"
                      ? "En Proceso"
                      : "No Evaluado"}
                  </span>
                  {report.categoria && (
                    <span className="text-sm text-gray-500">
                      {report.categoria.nombre}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<CitizenReporter />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <IncidentReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community-chat"
            element={
              <ProtectedRoute>
                <NeighborhoodChat />
              </ProtectedRoute>
            }
          />
          <Route path="/incidentmaps" element={<Incidentmaps />} />
          <Route path="/incidentlist" element={<IncidentList />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Profile Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            }
          />
          <Route path="/report/:id" element={<ReportDetailPage />} />
          <Route path="/media" element={<CommunicationMedia />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="reports" element={<div>Gestión de Reportes</div>} />
                  <Route path="notices" element={<div>Gestión de Noticias</div>} />
                  <Route path="users" element={<div>Gestión de Usuarios</div>} />
                </Routes>
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;