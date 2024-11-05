import React from 'react';
import { Map, Navigation, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const IncidentTracker = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center">
              <Map className="h-6 w-6 text-gray-700" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Incident Tracker</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="#" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Incidents
              </a>
              <a href="#" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Reports
              </a>
              <a href="#" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Teams
              </a>
              <a href="#" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Settings
              </a>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-700" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src="/api/placeholder/32/32"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Incidents Map</h1>
          <p className="text-sm text-gray-500">Last 24 hours</p>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          {/* Search Bar */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  placeholder="Search location..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Navigation className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50">
              <span className="text-xl font-medium">+</span>
            </button>
            <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50">
              <span className="text-xl font-medium">−</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentTracker;