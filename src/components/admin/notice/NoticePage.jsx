import { useMutation } from "@tanstack/react-query";
import noticeService from "../../../services/notice-service";

const NoticePage = () => {
  const { mutate: saveNotice } = useMutation({
    mutationFn: noticeService.save,
    onError: (err) => {
      const message = err.message;
      alert(message);
    },
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = Object.fromEntries(new FormData(e.target));
          saveNotice({
            titulo: formData["titulo"],
            contenido: formData["contenido"],
            importante: formData["importante"] === "on",
          });
        }}
      >
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
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Publicar Aviso
        </button>
      </form>
    </div>
  );
};

export default NoticePage;
