import React, { useState } from 'react';
import { MapPin, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IncidentReport = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    address: '',
  });
  
  const categories = [
    "Accidente de tráfico",
    "Daño en vía pública",
    "Alumbrado público",
    "Basura/Limpieza",
    "Seguridad",
    "Otros"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear nuevo reporte
    const newReport = {
      id: Date.now(),
      title: formData.category || 'Nuevo Reporte', // Usar categoría como título o un título por defecto
      timeAgo: 'Just now',
      status: 'In progress',
      image: imagePreview || '/api/placeholder/48/48',
      description: formData.description,
      location: formData.address,
      category: formData.category,
      date: new Date().toISOString()
    };

    // Obtener reportes existentes
    const existingReports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    // Agregar nuevo reporte al inicio del array
    const updatedReports = [newReport, ...existingReports];
    
    // Guardar en localStorage
    localStorage.setItem('reports', JSON.stringify(updatedReports));

    // Redireccionar a la página principal
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 hover:text-blue-500"
            >
              <MapPin className="w-6 h-6" />
              <span className="font-bold text-xl">Reporte Cuidadano</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold mb-2">Report a problem</h1>
          <p className="text-gray-600 mb-8">
            Your report will be public. Anyone can see your username and the photo you upload.
          </p>

          {/* Chat Bot Button */}
          <button 
            type="button"
            className="w-full bg-gray-100 text-left px-4 py-3 rounded-lg hover:bg-gray-200 mb-8"
          >
            Start chatting with our bot
          </button>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Add more information (optional)</h2>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full h-32 px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the problem..."
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the location..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo
              </label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-gray-600">Click to upload a photo</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default IncidentReport;