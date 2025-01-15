import { useState } from 'react';
import { Bell, CheckCircle, FileText, MessageSquare, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('reports');
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Panel Admin</h2>
        </div>
        
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center w-full p-4 ${
              activeTab === 'reports' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <FileText className="w-5 h-5 mr-3" />
            Reportes Pendientes
          </button>
          
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center w-full p-4 ${
              activeTab === 'notices' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Bell className="w-5 h-5 mr-3" />
            Crear Avisos
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center w-full p-4 ${
              activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
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
              {activeTab === 'reports' && 'Gestión de Reportes'}
              {activeTab === 'notices' && 'Crear Nuevo Aviso'}
              {activeTab === 'users' && 'Gestión de Usuarios'}
            </h1>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid gap-4">
                <div className="border rounded p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Reporte #123</h3>
                      <p className="text-sm text-gray-600">Categoría: Agua Potable</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="bg-white rounded-lg shadow p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contenido</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                  <label className="ml-2 text-sm text-gray-700">Marcar como importante</label>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Publicar Aviso
                </button>
              </form>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Usuario Ejemplo</td>
                    <td className="px-6 py-4 whitespace-nowrap">ejemplo@mail.com</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Activo
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900">Editar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}