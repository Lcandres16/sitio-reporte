import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Search, MapPin, FileText, Image, MessageCircle, Grid3X3, Menu, Bell, LogOut } from 'lucide-react';
import { useAuth, AuthProvider } from './Context/AuthContext';
import MainDashboard from './components/MainDashboard';
import IncidentReport from './components/IncidentReport';
import Incidentmaps from './components/Incidentmaps';
import IncidentList from './components/IncidentList';
import LoginPage from './components/LoginPage';
import NeighborhoodChat from './components/NeighborhoodChat';
import CommunicationMedia from './components/CommunicationMedia';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const CitizenReporter = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [reports, setReports] = useState([]);
  
  // Load reports from localStorage when component mounts
  useEffect(() => {
    const loadReports = () => {
      try {
        const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setReports(storedReports);
      } catch (error) {
        console.error('Error loading reports:', error);
        setReports([]);
      }
    };

    loadReports();

    // Add event listener for storage changes
    window.addEventListener('storage', loadReports);
    
    return () => {
      window.removeEventListener('storage', loadReports);
    };
  }, []);

  // Format relative time
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Navigation functions
  const handleCreateReport = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/report');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfileMenu(false);
  };

  const handleDashboardClick = () => navigate('/dashboard');
  const handleExploreClick = () => navigate('/explore');
  const handleLocationClick = () => navigate('/location');
  const handleIncidentClick = () => navigate('/incidents');
  const handleMediaClick = () => navigate('/media');
  const handleCommunityClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/community-chat');
  };
  const handleCategoryClick = () => navigate('/dashboard');
  const handleDescriptionClick = () => navigate('/description');

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/profile');
    setShowProfileMenu(false);
  };

  const handleNotificationsClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/notifications');
  };

  const handleLoginClick = () => navigate('/login');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span 
              className="font-bold text-xl cursor-pointer" 
              onClick={() => navigate('/')}
            >
              Citizen Reporter
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="px-4 py-2 hover:bg-gray-100 rounded-lg"
              onClick={handleCreateReport}
            >
              Report
            </button>
            <button 
              className="px-4 py-2 hover:bg-gray-100 rounded-lg"
              onClick={handleExploreClick}
            >
              Explore
            </button>
            {isAuthenticated ? (
              <>
                <Bell 
                  className="w-5 h-5 text-gray-600 cursor-pointer" 
                  onClick={handleNotificationsClick}
                />
                <div className="relative">
                  <img 
                    src="/api/placeholder/32/32" 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full cursor-pointer" 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  />
                  
                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        onClick={handleProfileClick}
                      >
                        Profile
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handleLoginClick}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-teal-100 h-72">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Citizen Reporter
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A platform for you to report issues and incidents in your community
          </p>
          
          {/* Search Bar */}
          <div className="flex gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="What's happening?"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleCreateReport}
            >
              Create a report
            </button>
          </div>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleLocationClick}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Location
          </button>
          <button 
            onClick={handleIncidentClick}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Incident
          </button>
          <button 
            onClick={handleMediaClick}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Image className="w-5 h-5" />
            Media
          </button>
          <button 
            onClick={handleCommunityClick}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Community Chat
          </button>
          <button 
            onClick={handleCategoryClick}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Grid3X3 className="w-5 h-5" />
            Category
          </button>
          <button 
            onClick={handleDescriptionClick}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Menu className="w-5 h-5" />
            Description
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        {reports.length === 0 ? (
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
                  <img
                    src={report.image || '/api/placeholder/48/48'}
                    alt={report.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <div className="flex gap-2 text-sm text-gray-500">
                      <span>{getTimeAgo(report.date)}</span>
                      {report.location && (
                        <>
                          <span>•</span>
                          <span>{report.location}</span>
                        </>
                      )}
                    </div>
                    {report.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {report.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    report.status === "Completed" 
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {report.status}
                  </span>
                  {report.category && (
                    <span className="text-sm text-gray-500">
                      {report.category}
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
          <Route path="/location" element={<Incidentmaps />} />
          <Route path="/incidents" element={<IncidentList />} />
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
                <div>Notifications Page</div>
              </ProtectedRoute>
            } 
          />
          <Route path="/report/:id" element={<div>Report Detail Page</div>} />
          <Route path="/media" element={<CommunicationMedia />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;