import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, FileText, Image, MessageCircle, Grid3X3 } from 'lucide-react';

const MobileNavigation = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <button
          onClick={() => handleNavigation('/incidentmaps')}
          className="flex items-center justify-center gap-2 px-2 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
          <MapPin className="w-6 h-6" />
          <span className="text-sm font-medium">Location</span>
        </button>

        <button
          onClick={() => handleNavigation('/incidentlist')}
          className="flex items-center justify-center gap-2 px-2 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
          <FileText className="w-6 h-6" />
          <span className="text-sm font-medium">Incident</span>
        </button>

        <button
          onClick={() => handleNavigation('/media')}
          className="flex items-center justify-center gap-2 px-2 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
          <Image className="w-6 h-6" />
          <span className="text-sm font-medium">Media</span>
        </button>

        <button
          onClick={() => handleNavigation('/community-chat')}
          className="flex items-center justify-center gap-2 px-2 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
          <MessageCircle className="w-6 h-6" />
          <span className="text-sm font-medium">Community</span>
        </button>

        <button
          onClick={() => handleNavigation('/dashboard')}
          className="flex items-center justify-center gap-2 px-2 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
          <Grid3X3 className="w-6 h-6" />
          <span className="text-sm font-medium">Category</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;