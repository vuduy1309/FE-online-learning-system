import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosInstance from "../api/axios";

const SOCKET_URL = "http://localhost:8080"; // Change if backend runs on a different port

const MessengerPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null); // Get user from localStorage or context
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get user from token in localStorage
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
    // Use id from token only
    const _userId = userData?.id;
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
          // Use id from token only
          const _userId = user?.id;
          let senderId = msg.senderId ?? msg.SenderID ?? null;
          const isMe = senderId && String(senderId) === String(_userId);
          setMessages((prev) => [
            ...prev,
            {
              ...msg,
              Content: msg.Content || msg.content, // sync Content field
              FullName:
                msg.FullName || (isMe ? user.fullName || "You" : "Anonymous"),
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

  // Fetch all users for new conversation (except myself)
  useEffect(() => {
    if (!user || !user.id) return;
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/auth/users");
        const _userId = user.id;
        console.log("API Response:", res); // Debug
        // Handle both cases: array directly or nested in data property
        const users = Array.isArray(res.data) ? res.data : (res.data.data || []);
        const filtered = users.filter(
          (u) => String(u.UserID) !== String(_userId)
        );
        console.log("Filtered Users:", filtered); // Debug
        setAllUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err); // Debug
        setAllUsers([]);
      }
    };
    fetchUsers();
  }, [user?.id]);

  const fetchChatRooms = async (userId) => {
    try {
      const res = await axios.get(`/chatrooms/user/${userId}`);
      if (res.data.success) setChatRooms(res.data.data);
    } catch (err) {
      alert("Unable to fetch chat rooms");
    }
  };

  const fetchMessages = async (chatRoomId) => {
    try {
      const res = await axios.get(`/chatrooms/${chatRoomId}/messages`);
      if (res.data.success) setMessages(res.data.data);
    } catch (err) {
      alert("Unable to fetch message history");
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedRoom) return;
    // Use id from token only
    const _userId = user?.id;
    if (!_userId) {
      alert("Cannot find userId in token!");
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

  const handleCreateConversation = async () => {
    if (!selectedUser) return;
    const _userId = user?.id;
    try {
      const res = await axios.post(
        "/chatrooms",
        { userId: _userId, instructorId: selectedUser.UserID },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        fetchChatRooms(_userId);
        setShowNewConversation(false);
        setSelectedUser(null);
      }
    } catch (err) {
      alert("Failed to create new conversation");
    }
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
        {/* Chat room list */}
        <div
          style={{
            width: 280,
            borderRight: "1px solid #eee",
            background: "#fafafa",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              {selectedRoom
                ? (() => {
                    const _userId = user?.id;
                    let names = [];
                    if (
                      selectedRoom.Members &&
                      Array.isArray(selectedRoom.Members)
                    ) {
                      names = selectedRoom.Members.filter(
                        (m) => String(m.UserID) !== String(_userId)
                      ).map((m) => m.FullName);
                    } else {
                      if (
                        selectedRoom.UserID &&
                        String(selectedRoom.UserID) !== String(_userId)
                      ) {
                        names.push(selectedRoom.UserFullName || "User");
                      }
                      if (
                        selectedRoom.InstructorID &&
                        String(selectedRoom.InstructorID) !== String(_userId)
                      ) {
                        names.push(
                          selectedRoom.InstructorFullName || "Instructor"
                        );
                      }
                    }
                    return names.length ? names.join(", ") : "Other(s)";
                  })()
                : "Chat Rooms"}
            </span>
            <button
              style={{
                border: "none",
                background: "#e6f7ff",
                borderRadius: 4,
                padding: "2px 8px",
                fontSize: 16,
                cursor: "pointer",
              }}
              title="New conversation"
              onClick={() => setShowNewConversation(true)}
            >
              +
            </button>
          </div>
          {/* New Conversation Modal */}
          {showNewConversation && (
            <div
              style={{
                position: "absolute",
                top: 50,
                left: 0,
                right: 0,
                background: "#fff",
                zIndex: 10,
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                Start a new conversation
              </div>
              <select
                value={selectedUser?.UserID || ""}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  const userObj = allUsers.find((u) => u.UserID === selectedId);
                  setSelectedUser(userObj || null);
                }}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  marginBottom: 12,
                }}
              >
                <option value="">Select a user...</option>
                {allUsers.map((u) => (
                  <option key={u.UserID} value={u.UserID}>
                    {u.FullName} ({u.Email})
                  </option>
                ))}
              </select>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateConversation}
                  disabled={!selectedUser}
                >
                  Start
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowNewConversation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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
              {/* Show all other members' names in the room */}
              {(() => {
                const _userId = user?.id;
                let names = [];
                if (room.Members && Array.isArray(room.Members)) {
                  names = room.Members.filter(
                    (m) => String(m.UserID) !== String(_userId)
                  ).map((m) => m.FullName);
                } else {
                  if (room.UserID && String(room.UserID) !== String(_userId)) {
                    names.push(room.UserFullName || "User");
                  }
                  if (
                    room.InstructorID &&
                    String(room.InstructorID) !== String(_userId)
                  ) {
                    names.push(room.InstructorFullName || "Instructor");
                  }
                }
                return names.length
                  ? names.join(", ")
                  : `Room #${room.ChatRoomID}`;
              })()}
            </div>
          ))}
        </div>
        {/* Chat area */}
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
                  // Determine side based on SenderID
                  const senderId = msg.SenderID ?? msg.senderId ?? null;
                  const _userId = user?.id;
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
                        {msg.FullName || (isMe ? "You" : "Anonymous")}
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
                <div>No messages yet.</div>
              )
            ) : (
              <div>Select a chat room to start.</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Message input */}
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
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  marginRight: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  padding: 8,
                }}
              />
              <button className="btn btn-primary" onClick={handleSend}>
                Send
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
