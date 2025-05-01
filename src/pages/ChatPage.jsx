import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { mentorId, studentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!mentorId || !studentId) return;

    socket.emit("joinChat", { mentorId, studentId });

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/chat/${mentorId}/${studentId}`
        );
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [mentorId, studentId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const senderId = mentorId; // Change if needed (Assuming mentor is sending)
    const messageData = { mentorId, studentId, senderId, message: newMessage };

    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  return (
    <div>
      <ChatBox messages={messages} />
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={() => navigate("/mentees")}>Go Back</button>
    </div>
  );
};

export default ChatPage;
