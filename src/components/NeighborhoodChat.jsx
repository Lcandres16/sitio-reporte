import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, VideoIcon, X, ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NeighborhoodChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [activeNotices, setActiveNotices] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Función para cargar avisos activos
  const loadActiveNotices = async () => {
    try {
      const response = await fetch('/api/notices/active');
      if (response.ok) {
        const notices = await response.json();
        setActiveNotices(notices);
      }
    } catch (error) {
      console.error('Error al cargar avisos:', error);
    }
  };

  useEffect(() => {
    loadActiveNotices();
    // Recargar avisos cada 5 minutos
    const interval = setInterval(loadActiveNotices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/') || file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachedFile({
            preview: reader.result,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor, sube solo imágenes o videos');
      }
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage || attachedFile) {
      const newMessage = {
        id: Date.now(),
        text: trimmedMessage,
        sender: 'current_user',
        senderName: 'Tú',
        timestamp: new Date().toLocaleTimeString(),
        attachment: attachedFile
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputMessage('');
      setAttachedFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = () => {
    setMessages([]);
    setAttachedFile(null);
    setInputMessage('');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Chat Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGoBack}
              className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 mr-2"
              title="Volver"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="font-bold text-xl text-gray-800">
              Chat del Vecindario
            </h1>
          </div>
          <button 
            onClick={handleReset}
            className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
            title="Reiniciar Chat"
          >
            Reiniciar
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-120px)]">
        {/* Avisos Activos */}
        {activeNotices.length > 0 && (
          <div className="mb-4 space-y-2">
            {activeNotices.map((notice) => (
              <div
                key={notice.id}
                className={`p-4 rounded-lg ${
                  notice.isImportant
                    ? 'bg-yellow-50 border-2 border-yellow-400'
                    : 'bg-blue-50 border-2 border-blue-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bell className={`w-5 h-5 ${notice.isImportant ? 'text-yellow-600' : 'text-blue-600'}`} />
                  <span className="font-bold text-gray-800">{notice.title}</span>
                </div>
                <p className="text-gray-700">{notice.content}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(notice.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-grow overflow-y-auto bg-white border rounded-lg mb-4 p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">
              No hay mensajes aún. ¡Inicia la conversación!
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'current_user' ? 'items-end' : 'items-start'}`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {msg.senderName}
                </div>
                <div 
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === 'current_user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.text && <p className="mb-2">{msg.text}</p>}
                  
                  {msg.attachment && (
                    <div className="mt-2">
                      {msg.attachment.type === 'image' ? (
                        <img 
                          src={msg.attachment.preview} 
                          alt="Archivo adjunto" 
                          className="max-w-full rounded-lg"
                        />
                      ) : (
                        <video 
                          src={msg.attachment.preview} 
                          controls 
                          className="max-w-full rounded-lg"
                        />
                      )}
                    </div>
                  )}
                  
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment Preview */}
        {attachedFile && (
          <div className="relative mb-4">
            {attachedFile.type === 'image' ? (
              <img 
                src={attachedFile.preview} 
                alt="Vista previa" 
                className="max-h-40 w-auto rounded-lg"
              />
            ) : (
              <video 
                src={attachedFile.preview} 
                className="max-h-40 w-auto rounded-lg"
                controls
              />
            )}
            <button
              onClick={removeAttachment}
              className="absolute top-2 right-2 bg-white/75 p-1 rounded-full"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          {/* File Upload Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*,video/*" 
            onChange={handleFileUpload} 
            className="hidden" 
            id="file-upload" 
          />
          <label 
            htmlFor="file-upload" 
            className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
          >
            <Paperclip className="w-6 h-6 text-gray-600" />
          </label>

          {/* Video Upload Button */}
          <label 
            htmlFor="file-upload" 
            className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
          >
            <VideoIcon className="w-6 h-6 text-gray-600" />
          </label>

          {/* Text Input */}
          <input 
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Send Button */}
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default NeighborhoodChat;