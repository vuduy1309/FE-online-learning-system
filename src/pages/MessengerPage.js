import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SOCKET_URL = "http://localhost:8080"; // Đổi lại nếu backend chạy port khác

const MessengerPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null); // Lấy user từ localStorage hoặc context
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Lấy user từ token trong localStorage
    const token = localStorage.getItem("token");
    let userData = null;
    if (token) {
      try {
        userData = jwtDecode(token);
      } catch (e) {
        userData = null;
      }
    }
    console.log("[MessengerPage] user from token:", userData); // DEBUG
    setUser(userData);
    // Ưu tiên lấy userId từ các trường phổ biến
    const _userId =
      userData?.userId || userData?.id || userData?.sub || userData?.UserID;
    if (_userId) {
      fetchChatRooms(_userId);
    }
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.ChatRoomID);
      if (!socketRef.current) {
        socketRef.current = io(SOCKET_URL);
      }
      socketRef.current.emit("joinRoom", {
        chatRoomId: selectedRoom.ChatRoomID,
      });
      socketRef.current.on("receiveMessage", (msg) => {
        if (msg.chatRoomId === selectedRoom.ChatRoomID) {
          // Lấy userId từ các trường phổ biến
          const _userId = user?.userId || user?.id || user?.sub || user?.UserID;
          let senderId = msg.senderId ?? msg.SenderID ?? null;
          const isMe = senderId && String(senderId) === String(_userId);
          setMessages((prev) => [
            ...prev,
            {
              ...msg,
              Content: msg.Content || msg.content, // đồng bộ trường Content
              FullName:
                msg.FullName || (isMe ? user.fullName || "You" : "Ẩn danh"),
              SenderID: senderId,
              SentAt: msg.sentAt || msg.SentAt || new Date().toISOString(),
              MessageID: msg.MessageID
                ? msg.MessageID
                : Math.random().toString(36).substr(2, 9),
            },
          ]);
        }
      });
      return () => {
        socketRef.current.off("receiveMessage");
      };
    }
  }, [selectedRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatRooms = async (userId) => {
    try {
      const res = await axios.get(`/chatrooms/user/${userId}`);
      if (res.data.success) setChatRooms(res.data.data);
    } catch (err) {
      alert("Không lấy được danh sách phòng chat");
    }
  };

  const fetchMessages = async (chatRoomId) => {
    try {
      const res = await axios.get(`/chatrooms/${chatRoomId}/messages`);
      if (res.data.success) setMessages(res.data.data);
    } catch (err) {
      alert("Không lấy được lịch sử chat");
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedRoom) return;
    // Ưu tiên lấy userId từ các trường phổ biến
    const _userId = user?.userId || user?.id || user?.sub || user?.UserID;
    if (!_userId) {
      alert("Không tìm thấy userId trong token!");
      return;
    }
    socketRef.current.emit("sendMessage", {
      chatRoomId: selectedRoom.ChatRoomID,
      senderId: _userId,
      content: newMessage,
      imageUrl: null,
    });
    setNewMessage("");
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          height: "80vh",
          border: "1px solid #ccc",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* Danh sách phòng chat */}
        <div
          style={{
            width: 280,
            borderRight: "1px solid #eee",
            background: "#fafafa",
            overflowY: "auto",
          }}
        >
          <h5 style={{ padding: 16, borderBottom: "1px solid #eee" }}>
            Chat Rooms
          </h5>
          {chatRooms.map((room) => (
            <div
              key={room.ChatRoomID}
              onClick={() => setSelectedRoom(room)}
              style={{
                padding: 16,
                cursor: "pointer",
                background:
                  selectedRoom?.ChatRoomID === room.ChatRoomID
                    ? "#e6f7ff"
                    : "inherit",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              Room #{room.ChatRoomID}
            </div>
          ))}
        </div>
        {/* Khung chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              background: "#fff",
            }}
          >
            {selectedRoom ? (
              messages.length ? (
                messages.map((msg) => {
                  // Xác định phía hiển thị dựa vào SenderID
                  const senderId = msg.SenderID ?? msg.senderId ?? null;
                  const _userId =
                    user?.userId || user?.id || user?.sub || user?.UserID;
                  const isMe = senderId && String(senderId) === String(_userId);
                  return (
                    <div
                      key={msg.MessageID || Math.random()}
                      style={{
                        marginBottom: 12,
                        textAlign: isMe ? "right" : "left",
                      }}
                    >
                      <div style={{ fontWeight: "bold", fontSize: 13 }}>
                        {msg.FullName || (isMe ? "You" : "Ẩn danh")}
                      </div>
                      <div
                        style={{
                          display: "inline-block",
                          background: isMe ? "#d1e7dd" : "#f1f1f1",
                          padding: 8,
                          borderRadius: 8,
                          maxWidth: 320,
                        }}
                      >
                        {msg.Content}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {msg.SentAt && !isNaN(new Date(msg.SentAt))
                          ? new Date(msg.SentAt).toLocaleString()
                          : msg.sentAt && !isNaN(new Date(msg.sentAt))
                          ? new Date(msg.sentAt).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>Chưa có tin nhắn nào.</div>
              )
            ) : (
              <div>Chọn phòng chat để bắt đầu.</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Nhập tin nhắn */}
          {selectedRoom && (
            <div
              style={{
                display: "flex",
                padding: 12,
                borderTop: "1px solid #eee",
                background: "#fafafa",
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập tin nhắn..."
                style={{
                  flex: 1,
                  marginRight: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  padding: 8,
                }}
              />
              <button className="btn btn-primary" onClick={handleSend}>
                Gửi
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MessengerPage;
