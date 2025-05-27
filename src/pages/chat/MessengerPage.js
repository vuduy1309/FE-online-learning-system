import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "../../api/axios";
import { jwtDecode } from "jwt-decode";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axiosInstance from "../../api/axios";
import { Container, Card, Button, Form, InputGroup } from "react-bootstrap";
import "./MessengerPage.css";

const SOCKET_URL = "http://localhost:8080";

const MessengerPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchUnreadCounts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axiosInstance.get("/chatrooms/unread-counts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUnreadCounts(res.data.unreadCounts || {});
      }
    } catch (err) {
      setUnreadCounts({});
    }
  }, []);

  useEffect(() => {
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
    const _userId = userData?.id;
    if (_userId) {
      fetchChatRooms(_userId);
      fetchUnreadCounts();
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
        // Nếu là phòng đang mở, cập nhật messages như cũ
        if (msg.chatRoomId === selectedRoom.ChatRoomID) {
          const _userId = user?.id;
          let senderId = msg.senderId ?? msg.SenderID ?? null;
          const isMe = senderId && String(senderId) === String(_userId);
          setMessages((prev) => [
            ...prev,
            {
              ...msg,
              Content: msg.Content || msg.content,
              FullName:
                msg.FullName || (isMe ? user.fullName || "You" : "Anonymous"),
              SenderID: senderId,
              SentAt: msg.sentAt || msg.SentAt || new Date().toISOString(),
              MessageID: msg.MessageID
                ? msg.MessageID
                : Math.random().toString(36).substr(2, 9),
            },
          ]);
        } else {
          // Nếu là phòng khác, gọi lại fetchUnreadCounts để cập nhật badge
          fetchUnreadCounts();
        }
      });
      return () => {
        socketRef.current.off("receiveMessage");
      };
    }
  }, [selectedRoom, fetchUnreadCounts, user]);

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
        console.log("API Response:", res);
        // Handle both cases: array directly or nested in data property
        const users = Array.isArray(res.data) ? res.data : res.data.data || [];
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

  const findExistingChatRoom = useCallback(
    (otherUserId) => {
      const myId = String(user?.id);
      otherUserId = String(otherUserId);

      return chatRooms.find((room) => {
        // Check direct 1-1 chat rooms
        if (room.UserID && room.InstructorID) {
          const roomUserID = String(room.UserID);
          const roomInstructorID = String(room.InstructorID);
          return (
            (roomUserID === myId && roomInstructorID === otherUserId) ||
            (roomUserID === otherUserId && roomInstructorID === myId)
          );
        }
        // Check group chat rooms with Members array
        if (room.Members && Array.isArray(room.Members)) {
          const memberIds = room.Members.map((m) => String(m.UserID));
          return (
            memberIds.includes(myId) &&
            memberIds.includes(otherUserId) &&
            memberIds.length === 2
          );
        }
        return false;
      });
    },
    [chatRooms, user?.id]
  );

  const handleCreateConversation = async () => {
    if (!selectedUser) return;
    const _userId = user?.id;

    try {
      // First check if a chat room already exists
      const existingRoom = findExistingChatRoom(selectedUser.UserID);
      if (existingRoom) {
        setSelectedRoom(existingRoom);
        setShowNewConversation(false);
        return;
      }

      // If no existing room, create new one
      const res = await axiosInstance.post(
        "/chatrooms",
        { userId: _userId, instructorId: selectedUser.UserID },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        await fetchChatRooms(_userId); // Refresh chat rooms
        // Find and select the newly created room
        const newRoom = findExistingChatRoom(selectedUser.UserID);
        if (newRoom) {
          setSelectedRoom(newRoom);
        }
        setShowNewConversation(false);
        setSelectedUser(null);
      }
    } catch (err) {
      console.error("Create conversation error:", err);
      alert(err.response?.data?.message || "Failed to create new conversation");
    }
  };

  // Khi chọn chat room, đánh dấu đã đọc và cập nhật lại số tin chưa đọc
  const handleSelectRoom = async (room) => {
    setSelectedRoom(room);
    const token = localStorage.getItem("token");
    if (!token || !user?.id) return;
    try {
      await axiosInstance.post(
        "/chatrooms/mark-read",
        { chatRoomId: room.ChatRoomID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUnreadCounts();
    } catch (err) {}
  };

  return (
    <>
      <Header />
      <Container className="py-4">
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <div className="d-flex" style={{ height: "75vh" }}>
              {/* Chat room list */}
              <div className="chat-sidebar">
                {/* Header */}
                <div className="chat-sidebar-header">
                  <h5 className="mb-0 fw-semibold">Messages</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px" }}
                    title="New conversation"
                    onClick={() => setShowNewConversation(true)}
                  >
                    <i className="bi bi-plus"></i>
                  </Button>
                </div>

                {/* New Conversation Modal */}
                {showNewConversation && (
                  <div className="new-conversation-modal">
                    <h6 className="mb-3">Start a new conversation</h6>
                    <Form.Select
                      className="mb-3"
                      value={selectedUser?.UserID || ""}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        const userObj = allUsers.find(
                          (u) => u.UserID === selectedId
                        );
                        setSelectedUser(userObj || null);
                      }}
                    >
                      <option value="">Select a user...</option>
                      {allUsers.map((u) => (
                        <option key={u.UserID} value={u.UserID}>
                          {u.FullName} ({u.Email})
                        </option>
                      ))}
                    </Form.Select>
                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleCreateConversation}
                        disabled={!selectedUser}
                      >
                        <i className="bi bi-chat-dots me-1"></i>
                        Start Chat
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => setShowNewConversation(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Chat Rooms List */}
                <div className="chat-rooms-list">
                  {chatRooms.map((room) => {
                    const unread = unreadCounts[room.ChatRoomID] || 0;
                    return (
                      <div
                        key={room.ChatRoomID}
                        onClick={() => handleSelectRoom(room)}
                        className={`chat-room-item ${
                          selectedRoom?.ChatRoomID === room.ChatRoomID
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="chat-avatar">
                          {(() => {
                            const _userId = user?.id;
                            let name = "";
                            if (room.Members && Array.isArray(room.Members)) {
                              const otherMember = room.Members.find(
                                (m) => String(m.UserID) !== String(_userId)
                              );
                              name = otherMember?.FullName?.charAt(0) || "?";
                            } else {
                              name =
                                room.UserFullName?.charAt(0) ||
                                room.InstructorFullName?.charAt(0) ||
                                "?";
                            }
                            return name.toUpperCase();
                          })()}
                        </div>
                        <div className="chat-info">
                          <div className="chat-name">
                            {(() => {
                              const _userId = user?.id;
                              let names = [];
                              if (room.Members && Array.isArray(room.Members)) {
                                names = room.Members.filter(
                                  (m) => String(m.UserID) !== String(_userId)
                                ).map((m) => m.FullName);
                              } else {
                                if (
                                  room.UserID &&
                                  String(room.UserID) !== String(_userId)
                                ) {
                                  names.push(room.UserFullName || "User");
                                }
                                if (
                                  room.InstructorID &&
                                  String(room.InstructorID) !== String(_userId)
                                ) {
                                  names.push(
                                    room.InstructorFullName || "Instructor"
                                  );
                                }
                              }
                              return names.length
                                ? names.join(", ")
                                : `Room #${room.ChatRoomID}`;
                            })()}
                          </div>
                          {unread > 0 && (
                            <span className="badge bg-danger ms-2">
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat Area */}
              <div className="chat-area">
                {/* Chat Header */}
                {selectedRoom && (
                  <div className="chat-header">
                    <h6 className="mb-0">
                      {(() => {
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
                            String(selectedRoom.InstructorID) !==
                              String(_userId)
                          ) {
                            names.push(
                              selectedRoom.InstructorFullName || "Instructor"
                            );
                          }
                        }
                        return names.length ? names.join(", ") : "Chat";
                      })()}
                    </h6>
                  </div>
                )}

                {/* Messages Area */}
                <div className="messages-area">
                  {selectedRoom ? (
                    messages.length ? (
                      messages.map((msg) => {
                        const senderId = msg.SenderID ?? msg.senderId ?? null;
                        const _userId = user?.id;
                        const isMe =
                          senderId && String(senderId) === String(_userId);
                        return (
                          <div
                            key={msg.MessageID || Math.random()}
                            className={`message ${
                              isMe ? "message-mine" : "message-other"
                            }`}
                          >
                            <div className="message-content">
                              <small className="message-sender">
                                {msg.FullName || (isMe ? "You" : "Anonymous")}
                              </small>
                              <div className="message-bubble">
                                {msg.Content}
                              </div>
                              <small className="message-time">
                                {msg.SentAt && !isNaN(new Date(msg.SentAt))
                                  ? new Date(msg.SentAt).toLocaleString()
                                  : msg.sentAt && !isNaN(new Date(msg.sentAt))
                                  ? new Date(msg.sentAt).toLocaleString()
                                  : ""}
                              </small>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-muted py-4">
                        <i className="bi bi-chat-dots display-4"></i>
                        <p className="mt-2">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-chat-square-dots display-4"></i>
                      <p className="mt-2">Select a chat to start messaging</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {selectedRoom && (
                  <div className="chat-input">
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type your message..."
                      />
                      <Button
                        variant="primary"
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                      >
                        <i className="bi bi-send"></i>
                      </Button>
                    </InputGroup>
                  </div>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default MessengerPage;
