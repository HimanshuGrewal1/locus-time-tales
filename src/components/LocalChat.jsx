
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Send, MessageSquare, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Sample data for demonstration
const MOCK_MESSAGES = [
  {
    id: "1",
    senderId: "user1",
    text: "Just found an amazing capsule by the library!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    locationId: "area1",
  },
  {
    id: "2",
    senderId: "user2",
    text: "Has anyone found the one near the science building?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    locationId: "area1",
  },
  {
    id: "3",
    senderId: "user3",
    text: "I'm still looking for it. Any hints?",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    locationId: "area1",
  },
  {
    id: "4",
    senderId: "user1",
    text: "Check near the fountain!",
    timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    locationId: "area1",
  },
];

const MOCK_USERS = {
  user1: { id: "user1", nickname: "TimeCapsuleExplorer", createdAt: "" },
  user2: { id: "user2", nickname: "HistoryHunter", createdAt: "" },
  user3: { id: "user3", nickname: "GeoGuru", createdAt: "" },
};

export function LocalChat({
  locationId,
  currentUser,
  isOpen,
  onClose,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Load messages for this location
  useEffect(() => {
    // In a real app, this would fetch messages from a backend
    setMessages(
      MOCK_MESSAGES.filter((msg) => msg.locationId === locationId)
    );
  }, [locationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
      locationId,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-16 left-4 right-4 max-h-[60vh] z-40 flex flex-col">
      <CardHeader className="p-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Local Chat
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="p-3 overflow-y-auto flex-1">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.senderId === currentUser.id
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[85%] ${
                  message.senderId === currentUser.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                <p className="text-xs font-medium mb-1">
                  {message.senderId === currentUser.id
                    ? "You"
                    : MOCK_USERS[message.senderId]?.nickname || "Anonymous"}
                </p>
                <p className="text-sm">{message.text}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(message.timestamp), {
                  addSuffix: true,
                })}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
