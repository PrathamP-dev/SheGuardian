import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, MapPin, Phone, HeartHandshake, Clock } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="mobile-container flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">SheGuardian</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mobile-container px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Your Safety, Our Priority
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Empowering women's safety through real-time emergency response, 
            community support, and trusted networks.
          </p>
          
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-16 w-16 text-primary-foreground" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="font-semibold">Emergency SOS</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                One-touch emergency alerts to contacts, volunteers, and authorities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-semibold">Trusted Network</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect with trusted contacts and nearby volunteer responders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-semibold">Location Sharing</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time location tracking and safe zone identification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <HeartHandshake className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-semibold">Community Support</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                24/7 support services and incident reporting for safer communities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-center mb-4">Trusted by Women Worldwide</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-xs text-muted-foreground">Emergency Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">500m</div>
                <div className="text-xs text-muted-foreground">Volunteer Radius</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">&lt;2min</div>
                <div className="text-xs text-muted-foreground">Average Response</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary-foreground font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Press and hold SOS button</p>
                  <p className="text-xs text-muted-foreground">3-second activation prevents accidental triggers</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary-foreground font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Instant alert distribution</p>
                  <p className="text-xs text-muted-foreground">Contacts, volunteers, and authorities notified with your location</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary-foreground font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Help is on the way</p>
                  <p className="text-xs text-muted-foreground">Real-time updates on responder locations and estimated arrival</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="w-full gradient-primary text-white font-semibold py-4"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-login"
          >
            Get Started - Sign Up Free
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Your safety matters. Join our community today.
          </p>
        </div>
      </main>
    </div>
  );
}
