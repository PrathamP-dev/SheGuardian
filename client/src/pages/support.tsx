import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/bottom-navigation";
import AnonymousChatModal from "@/components/anonymous-chat-modal";
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Heart, 
  HelpCircle, 
  Shield, 
  Clock,
  Globe,
  Users,
  BookOpen
} from "lucide-react";

export default function Support() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleEmergencyCall = () => {
    window.location.href = "tel:112";
  };

  const handleWomensHelpline = () => {
    // Call India's Women's Helpline
    window.location.href = "tel:181";
  };

  const handleAnonymousChat = () => {
    setIsChatOpen(true);
  };

  const handleCrisisResources = () => {
    // Navigate to crisis resources page (could be external link)
    window.open('https://www.nimhans.ac.in/services/department/psychiatry', '_blank');
  };

  const handleLegalAid = () => {
    // Navigate to legal aid services
    window.open('https://nalsa.gov.in/', '_blank');
  };

  const handleSafetyGuide = () => {
    // Navigate to safety guide - could be internal page or external resource
    window.open('https://www.ncrb.gov.in/uploads/nationalcrimerecordsbureau/custom/1634724692Public%20Safety%20Awareness%20-NCRB.pdf', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading support services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="mobile-container flex items-center justify-between">
          <button 
            className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold">Support Services</h1>
          <div className="w-8 h-8"></div> {/* Spacer */}
        </div>
      </header>

      <div className="mobile-container p-4 space-y-6">
        {/* Crisis Support */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Immediate Crisis Support</h3>
                <p className="text-xs text-red-600">Available 24/7 for emergencies</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleEmergencyCall}
                data-testid="button-crisis-emergency"
              >
                <Phone className="h-4 w-4 mr-2" />
                Emergency Services (112)
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-red-300 text-red-700 hover:bg-red-100"
                onClick={handleWomensHelpline}
                data-testid="button-crisis-helpline"
              >
                <Shield className="h-4 w-4 mr-2" />
                National Women's Crisis Line
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Anonymous Support */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <MessageCircle className="h-4 w-4 mr-2 text-primary" />
              Anonymous Support
            </h3>
            
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                onClick={handleAnonymousChat}
                data-testid="button-anonymous-chat"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-purple-800">Anonymous Chat</p>
                    <p className="text-xs text-purple-600">Connect with trained counselors</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                onClick={handleCrisisResources}
                data-testid="button-crisis-resources"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-blue-800">Crisis Resources</p>
                    <p className="text-xs text-blue-600">Mental health and trauma support</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Professional Services */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Professional Services
            </h3>
            
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
                onClick={handleLegalAid}
                data-testid="button-legal-aid"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Legal Aid & Advocacy</p>
                    <p className="text-xs text-muted-foreground">Free legal consultation and support</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
                data-testid="button-counseling"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Counseling Services</p>
                    <p className="text-xs text-muted-foreground">Professional therapy and support groups</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
                data-testid="button-shelter-services"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Shelter Services</p>
                    <p className="text-xs text-muted-foreground">Safe housing and emergency accommodation</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Educational Resources */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              Educational Resources
            </h3>
            
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
                onClick={handleSafetyGuide}
                data-testid="button-safety-guide"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Personal Safety Guide</p>
                    <p className="text-xs text-muted-foreground">Tips and strategies for staying safe</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
                data-testid="button-self-defense"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Self-Defense Resources</p>
                    <p className="text-xs text-muted-foreground">Training programs and techniques</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
                data-testid="button-emergency-prep"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Emergency Preparedness</p>
                    <p className="text-xs text-muted-foreground">Plan ahead for various situations</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* International Support */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <Globe className="h-4 w-4 mr-2 text-primary" />
              International Helplines
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="font-medium">United States</span>
                <span className="text-primary">1-800-799-7233</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="font-medium">United Kingdom</span>
                <span className="text-primary">0808 2000 247</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="font-medium">Canada</span>
                <span className="text-primary">1-866-863-0511</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="font-medium">Australia</span>
                <span className="text-primary">1800 015 188</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Tap any number to call. Local helplines available in 20+ countries.
            </p>
          </CardContent>
        </Card>

        {/* 24/7 Support Features */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4 text-blue-800">24/7 Support Features</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm text-blue-800">Always Available</p>
                  <p className="text-xs text-blue-600">Round-the-clock crisis support and counseling</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm text-blue-800">Multiple Contact Methods</p>
                  <p className="text-xs text-blue-600">Phone, chat, text, and video support options</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm text-blue-800">Complete Confidentiality</p>
                  <p className="text-xs text-blue-600">Your privacy and safety are our top priority</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Support Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-16 flex flex-col"
            onClick={handleAnonymousChat}
            data-testid="button-quick-chat"
          >
            <MessageCircle className="h-5 w-5 mb-1" />
            <span className="text-xs">Quick Chat</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-16 flex flex-col"
            onClick={handleSafetyGuide}
            data-testid="button-quick-guide"
          >
            <BookOpen className="h-5 w-5 mb-1" />
            <span className="text-xs">Safety Guide</span>
          </Button>
        </div>

        {/* Community Message */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-green-800 mb-2">You're Not Alone</h3>
            <p className="text-sm text-green-700">
              Our community of supporters, volunteers, and professionals are here to help. 
              Every person deserves to feel safe and supported.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
      
      <AnonymousChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}
