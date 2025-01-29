import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  AlertCircle,
  Flame,
  Heart, 
  Shield,
  X,
  Hospital,
  Car,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunicationMedia = () => {
  const navigate = useNavigate();
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const communicationData = [
    { title: 'Números de Emergencia Cuenca', icons: [
      { icon: <Shield className="w-8 h-8 text-blue-500" />, name: 'ECU 911 EMERGENCIAS', number: '911' },
      { icon: <Hospital className="w-8 h-8 text-red-500" />, name: 'CRUZ ROJA', number: '102' },
      { icon: <Flame className="w-8 h-8 text-red-500" />, name: 'BOMBEROS CUENCA', number: '102' },
      { icon: <Shield className="w-8 h-8 text-blue-500" />, name: 'POLICÍA NACIONAL', number: '101' },
      { icon: <Car className="w-8 h-8 text-yellow-500" />, name: 'EMOV EP (TRÁNSITO)', number: '157' },
      { icon: <HelpCircle className="w-8 h-8 text-green-500" />, name: 'GUARDIA CIUDADANA', number: '07 4134900' },
    ]},
    { title: 'Servicios Públicos Cuenca', icons: [
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'ETAPA AGUA POTABLE', number: '134' },
      { icon: <Phone className="w-8 h-8 text-yellow-500" />, name: 'CENTROSUR ENERGÍA', number: '136' },
      { icon: <Phone className="w-8 h-8 text-green-500" />, name: 'EMAC BASURA Y RECICLAJE', number: '139' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'ETAPA TELEFONÍA', number: '100' },
      { icon: <Phone className="w-8 h-8 text-purple-500" />, name: 'HOSPITAL REGIONAL', number: '07 2831500' },
      { icon: <Phone className="w-8 h-8 text-red-500" />, name: 'HOSPITAL DEL IESS', number: '07 2868471' },
      { icon: <Phone className="w-8 h-8 text-indigo-500" />, name: 'MUNICIPIO DE CUENCA', number: '07 4134900' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'AEROPUERTO CUENCA', number: '07 2862203' },
    ]},
  ];

  const handleGoBack = () => {
    navigate('/');
  };

  const handleCallNumber = (number, name, isEmergency) => {
    setSelectedNumber({ number, name, isEmergency });
    setIsDialogOpen(true);
  };

  const handleConfirmCall = () => {
    if (selectedNumber) {
      window.location.href = `tel:${selectedNumber.number}`;
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGoBack}
              className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 mr-2"
              title="Regresar"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="font-bold text-xl text-gray-800">
              Números de Emergencia Cuenca
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {communicationData.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {section.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.icons.map((item, itemIndex) => (
                <button 
                  key={itemIndex} 
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-4 w-full text-left"
                  onClick={() => handleCallNumber(item.number, item.name, section.title === 'Números de Emergencia Cuenca')}
                >
                  {item.icon}
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {item.name}
                    </h3>
                    <span className="text-blue-600 font-bold text-lg">
                      {item.number}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar Llamada
              </h3>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-2">
              <p className="text-gray-600">
                ¿Está seguro que desea llamar a {selectedNumber?.name} al número {selectedNumber?.number}?
              </p>
              {selectedNumber?.isEmergency && (
                <p className="mt-2 text-red-600 font-medium">
                  Este es un número de emergencia. Por favor, solo continúe si es una emergencia real.
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCall}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Llamar Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationMedia;