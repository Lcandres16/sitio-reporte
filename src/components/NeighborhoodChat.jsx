import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, VideoIcon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import noticeService from "../services/notice-service";

const NeighborhoodChat = () => {
  const navigate = useNavigate();
  const { data: messages } = useQuery({
    queryFn: () => noticeService.findAll(),
    queryKey: ["notices"],
    refetchOnWindowFocus: true,
  });

  const [inputMessage, setInputMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Simulated user data (in a real app, this would come from authentication)
  // const users = {
  //   current_user: { id: "current_user", name: "John Doe" },
  //   other_user: { id: "other_user", name: "Jane Smith" },
  // };

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
      // Check file type (video or image)
      if (file.type.startsWith("video/") || file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachedFile({
            preview: reader.result,
            type: file.type.startsWith("video/") ? "video" : "image",
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please upload only images or videos");
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    // Trim and validate message
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage || attachedFile) {
      // const newMessage = {
      //   id: Date.now(),
      //   text: trimmedMessage,
      //   sender: "current_user", // In a real app, this would be the logged-in user
      //   senderName: users["current_user"].name,
      //   timestamp: new Date().toLocaleTimeString(),
      //   attachment: attachedFile,
      // };

      // Add message to messages array
      // setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Reset input and attachment
      setInputMessage("");
      setAttachedFile(null);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleReset = () => {
    // Clear all messages

    // Clear any attached file
    setAttachedFile(null);
    // Clear input message
    setInputMessage("");
  };

  const handleGoHome = () => {
    // Navigate back to the main page
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Chat Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoHome}
              className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 mr-2"
              title="Back to Home"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="font-bold text-xl text-gray-800">
              Neighborhood Chat
            </h1>
          </div>
          <button
            onClick={handleReset}
            className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
            title="Reset Chat"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Rest of the component remains the same as in the previous version */}
      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-120px)]">
        {/* Messages Container */}
        <div className="flex-grow overflow-y-auto bg-white border rounded-lg mb-4 p-4 space-y-4">
          {messages?.length === 0 ? (
            <div className="text-center text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages?.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "current_user" ? "items-end" : "items-start"
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">{msg.admin_id}</div>
                <h2>{msg.titulo}</h2>
                <div className={`max-w-[70%] p-3 rounded-lg`}>
                  {msg.contenido && <p className="mb-2">{msg.contenido}</p>}
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {msg.created_at}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Attachment Preview */}
        {/* {attachedFile && (
          <div className="relative mb-4">
            {attachedFile.type === "image" ? (
              <img
                src={attachedFile.preview}
                alt="Attachment Preview"
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
        )} */}

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
            placeholder="Type your message..."
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
