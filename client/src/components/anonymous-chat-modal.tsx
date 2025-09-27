import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Shield, MessageCircle, User, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'counselor';
  timestamp: Date;
}

interface AnonymousChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnonymousChatModal({ isOpen, onClose }: AnonymousChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m here to provide you with confidential support. You can share whatever you\'re comfortable with. How are you feeling today?',
      sender: 'counselor',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  const counselorResponses = [
    "I understand this must be difficult for you. Can you tell me more about what's happening?",
    "Your feelings are completely valid. You're taking a brave step by reaching out for support.",
    "Thank you for sharing that with me. How long has this been going on?",
    "It sounds like you're dealing with a lot right now. What kind of support would be most helpful for you?",
    "I want you to know that you're not alone in this. There are resources and people who want to help.",
    "That must have been really challenging to experience. How are you coping with everything?",
    "Your safety is the most important thing. Do you have somewhere safe you can go if needed?",
    "It takes courage to share these experiences. Have you been able to talk to anyone else about this?",
    "I'm here to listen and support you. What would you like to focus on right now?",
    "Remember that none of this is your fault. What do you think would help you feel safer?"
  ];

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate counselor response after a delay
    setTimeout(() => {
      const randomResponse = counselorResponses[Math.floor(Math.random() * counselorResponses.length)];
      const counselorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'counselor',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, counselorMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] flex flex-col" data-testid="anonymous-chat-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Anonymous Support Chat</span>
          </DialogTitle>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Connected with trained counselor</span>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 border rounded-lg">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send)"
            className="flex-1"
            data-testid="input-chat-message"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim()}
            size="icon"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="flex items-center space-x-1 mb-1">
            <Shield className="h-3 w-3" />
            <span className="font-medium">Your privacy is protected</span>
          </div>
          <p>This conversation is confidential and anonymous. No personal information is stored.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}