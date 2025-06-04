import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button, Card, Form, InputGroup, Spinner } from "react-bootstrap";

export default function ChatBotBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I am the AI assistant for OLS. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/chatbot", { message: userMsg });
      setMessages((msgs) => [...msgs, { from: "bot", text: res.data.reply }]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, the chatbot service is temporarily unavailable." }
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        variant="primary"
        className="rounded-circle shadow"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 9999,
          width: 56,
          height: 56,
          fontSize: 28,
          display: open ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={() => setOpen(true)}
        title="Chat with AI Assistant"
      >
        <i className="bi bi-chat-dots"></i>
      </Button>

      {/* Chat Widget */}
      {open && (
        <Card
          className="shadow"
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            width: 370,
            maxWidth: "90vw",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            height: 480
          }}
        >
          <Card.Header className="d-flex justify-content-between align-items-center py-2 px-3 bg-primary text-white">
            <span>
              <i className="bi bi-robot me-2"></i>
              OLS Chatbot
            </span>
            <Button
              variant="light"
              size="sm"
              onClick={() => setOpen(false)}
              title="Close"
            >
              <i className="bi bi-x-lg"></i>
            </Button>
          </Card.Header>
          <Card.Body
            className="p-2"
            style={{
              overflowY: "auto",
              flex: 1,
              background: "#f8f9fa"
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 d-flex ${msg.from === "user" ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className={`p-2 rounded ${msg.from === "user" ? "bg-primary text-white" : "bg-light border"}`}
                  style={{ maxWidth: "80%" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </Card.Body>
          <Card.Footer className="p-2 bg-white border-0">
            <Form onSubmit={handleSend}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading || !input.trim()}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-send"></i>}
                </Button>
              </InputGroup>
            </Form>
          </Card.Footer>
        </Card>
      )}
    </>
  );
}