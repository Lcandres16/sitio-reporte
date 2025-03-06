import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import noticeService from "../../../services/notice-service";

const NoticePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef(null);

  const { mutate: saveNotice } = useMutation({
    mutationFn: noticeService.save,
    onSuccess: () => {
      setIsLoading(false);
      setShowSuccess(true);
      
      // Resetear el formulario
      if (formRef.current) {
        formRef.current.reset();
      }
      
      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    },
    onError: (err) => {
      setIsLoading(false);
      const message = err.message;
      alert(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = Object.fromEntries(new FormData(e.target));
    saveNotice({
      titulo: formData["titulo"],
      contenido: formData["contenido"],
      importante: formData["importante"] === "on",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Comunicado creado exitosamente
        </div>
      )}

      <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            required
            type="text"
            name="titulo"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contenido
          </label>
          <textarea
            rows={4}
            name="contenido"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="importante"
            className="rounded border-gray-300 text-blue-600"
          />
          <label className="ml-2 text-sm text-gray-700">
            Marcar como importante
          </label>
        </div>
        <button 
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </>
          ) : (
            "Publicar Aviso"
          )}
        </button>
      </form>
    </div>
  );
};

export default NoticePage;