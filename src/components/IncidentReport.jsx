import { useState, useEffect } from "react";
import { MapPin, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ENV from "../environment/env";

const IncidentReport = () => {
  // ... [Todo el estado y efectos permanecen igual]
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria_id: "",
    ubicacion: "",
    estado: "no_evaluado",
  });

  const [categorias, setCategorias] = useState([]);

  // ... [Todos los useEffect y handlers permanecen igual]
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${ENV.API_URL}/categorias`);
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("usuario_id", user.id);
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (imageFile) {
        formDataToSend.append("imagen", imageFile);
      }

      const response = await fetch("http://localhost:3000/api/reportes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Error al crear el reporte");
      }

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear el reporte. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100 to-teal-50">
      <header className="bg-white rounded-lg shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-4 text-gray-1000"
          >
            <MapPin className="w-5 h-5" />
            <span className="font-semibold text-lg">Reporte Ciudadano</span>
          </button>
          {user && (
            <div className="text-sm text-gray-600">
              Reportando como: {user.nombre}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              Reportar un problema
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Su informe será público. Cualquiera podrá ver su nombre y la foto
              que suba.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Título breve del problema..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm h-24 resize-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Describe el problema y adjunte un numero telefónico al cual podamos contactar si la situación lo amerita."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Ingrese la ubicación..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subir Foto
                </label>
                <div className="mt-1">
                  {imagePreview ? (
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                        <Upload className="w-8 h-8 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">
                          Haga clic para subir una foto
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-300 text-white py-2 rounded-md text-sm font-medium hover:bg-teal-200 transition-colors disabled:bg-teal-300 mt-6"
              >
                {loading ? "Enviando..." : "Enviar reporte"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentReport;
