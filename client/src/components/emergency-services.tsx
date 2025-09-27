import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Shield, MessageCircle } from "lucide-react";
import AnonymousChatModal from "./anonymous-chat-modal";

export default function EmergencyServices() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleCallEmergency = () => {
    // India's National Emergency Number
    // 112 - Unified emergency number for police, fire, medical
    // Also redirects to appropriate services based on need
    window.location.href = "tel:112";
  };

  const handleCallWomensHelpline = () => {
    // India's Women's Helpline - 181
    // 24/7 support for women in distress
    // Alternative: 1091 (another women's helpline)
    window.location.href = "tel:181";
  };

  const handleAnonymousChat = () => {
    setIsChatOpen(true);
  };

  return (
    <>
    <Card data-testid="emergency-services-section">
      <CardContent className="p-4">
        <h3 className="font-medium mb-4">Emergency Services</h3>
        
        <div className="grid grid-cols-1 gap-3">
          <button 
            className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors emergency-service-btn"
            onClick={handleCallEmergency}
            data-testid="button-emergency-hotline"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-red-800">Emergency Hotline</p>
                <p className="text-xs text-red-600">112 - National Emergency Number</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button 
            className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors emergency-service-btn"
            onClick={handleCallWomensHelpline}
            data-testid="button-womens-helpline"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-blue-800">Women's Helpline</p>
                <p className="text-xs text-blue-600">181 - 24/7 Support Available</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button 
            className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors emergency-service-btn"
            onClick={() => window.location.href = "tel:102"}
            data-testid="button-medical-emergency"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-green-800">Medical Emergency</p>
                <p className="text-xs text-green-600">102 - Ambulance Services</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button 
            className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors emergency-service-btn"
            onClick={() => window.location.href = "tel:100"}
            data-testid="button-police-emergency"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-orange-800">Police Emergency</p>
                <p className="text-xs text-orange-600">100 - Police Services</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button 
            className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors emergency-service-btn"
            onClick={handleAnonymousChat}
            data-testid="button-anonymous-chat"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-purple-800">Anonymous Chat</p>
                <p className="text-xs text-purple-600">Counselor Support</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
    
    {isChatOpen && (
      <AnonymousChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    )}
    </>
  );
}
