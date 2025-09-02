import { Card, CardContent } from "@/components/ui/card";
import { Phone, Shield, MessageCircle } from "lucide-react";

export default function EmergencyServices() {
  const handleCallEmergency = () => {
    // In a real implementation, this would:
    // - Detect user's location and country
    // - Call the appropriate emergency number (911, 100, 112, etc.)
    // - Log the call in activity history
    window.location.href = "tel:911";
  };

  const handleCallWomensHelpline = () => {
    // In a real implementation, this would:
    // - Connect to national women's helpline
    // - Provide 24/7 crisis support
    // - Offer anonymous support options
    alert("Connecting to Women's Helpline...\n\nThis would dial the national women's crisis support number based on your location.");
  };

  const handleAnonymousChat = () => {
    // In a real implementation, this would:
    // - Open chat interface with trained counselors
    // - Provide anonymous crisis support
    // - Connect to mental health resources
    alert("Opening Anonymous Chat...\n\nThis would connect you with trained counselors for immediate support.");
  };

  return (
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
                <p className="text-xs text-red-600">911 / Local Emergency Services</p>
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
                <p className="text-xs text-blue-600">24/7 Support Available</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}
