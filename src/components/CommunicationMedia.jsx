import React from 'react';
import { 
  ArrowLeft, 
  Phone, 
  AlertCircle,
  Flame,
  Heart, 
  Shield 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunicationMedia = () => {
  const navigate = useNavigate();

  const communicationData = [
    { title: 'Números Urgentes', icons: [
      { icon: <Shield className="w-8 h-8 text-blue-500" />, name: 'POLICIA NACIONAL', number: '101' },
      { icon: <Flame className="w-8 h-8 text-red-500" />, name: 'CUERPO DE BOMBEROS', number: '102' },
      { icon: <Heart className="w-8 h-8 text-red-500" />, name: 'CRUZ ROJA', number: '131' },
      { icon: <AlertCircle className="w-8 h-8 text-blue-500" />, name: 'CONTROL ANTIDELICUENCIAL Y SECUESTROS', number: '137' },
      { icon: <Shield className="w-8 h-8 text-red-500" />, name: 'DEFENSA CIVIL', number: '110' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'EMERGENCIAS', number: '911' },
    ]},
    { title: 'Teléfonos de Utilidad', icons: [
      { icon: <Heart className="w-8 h-8 text-red-500" />, name: 'BANCO DE SANGRE', number: '131' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'EMPRESA ELECTRICA REGIONAL CENTRO SUR', number: '136' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'AEROPUERTO', number: '2862-203' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'TELEFONO CIUDADANO', number: '150' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'RELOJ PARLANTE', number: '109' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'CENTRO DE ATENCION TELEFONICA', number: '100' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'COMISARIA DE LA MUJER', number: '2846-607' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'PREVENSION DE SUICIDIOS', number: '2829-118' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'JEFATURA DE TRANSITO', number: '2831-510' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'EDUCACION VIAL', number: '140' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'ALO EMAC', number: '139' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'OID', number: '2864-924' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'REPARACION DE DAÑOS TELEFONICOS', number: '132' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'REPARACION DAÑOS AGUA POTABLE Y ALCANTARILLADO', number: '134' },
      { icon: <Phone className="w-8 h-8 text-blue-500" />, name: 'RED DIGITAL DE TRANSMISION DE DATOS', number: '152' },
    ]},
  ];

  const handleGoBack = () => {
    navigate('/');
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
              title="Back to Home"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="font-bold text-xl text-gray-800">
              Medios de Comunicación
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
                <div 
                  key={itemIndex} 
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-4"
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
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunicationMedia;