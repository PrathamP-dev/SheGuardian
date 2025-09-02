import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/bottom-navigation";
import { ArrowLeft, AlertTriangle, MapPin, Clock, Users, TrendingUp, Plus } from "lucide-react";
import type { IncidentReport } from "@shared/schema";

export default function Incidents() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  const { data: publicIncidents = [], isLoading: isLoadingIncidents } = useQuery<IncidentReport[]>({
    queryKey: ["/api/public-incidents"],
    enabled: isAuthenticated,
  });

  const getIncidentTypeIcon = (type: string) => {
    switch (type) {
      case "harassment":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "stalking":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "theft":
        return <AlertTriangle className="h-4 w-4 text-purple-600" />;
      case "unsafe_area":
        return <MapPin className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Less than 1 hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const incidentStats = {
    total: publicIncidents.length,
    harassment: publicIncidents.filter((i: IncidentReport) => i.incidentType === 'harassment').length,
    unsafeAreas: publicIncidents.filter((i: IncidentReport) => i.incidentType === 'unsafe_area').length,
    thisWeek: publicIncidents.filter((i: IncidentReport) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(i.createdAt!) > weekAgo;
    }).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertTriangle className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading community incidents...</p>
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
          <h1 className="text-lg font-semibold">Community Incidents</h1>
          <div className="w-8 h-8"></div> {/* Spacer */}
        </div>
      </header>

      <div className="mobile-container p-4 space-y-4">
        {/* Statistics Card */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              Community Safety Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{incidentStats.total}</div>
                <div className="text-xs text-muted-foreground">Total Reports</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">{incidentStats.thisWeek}</div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">{incidentStats.harassment}</div>
                <div className="text-xs text-muted-foreground">Harassment</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{incidentStats.unsafeAreas}</div>
                <div className="text-xs text-muted-foreground">Unsafe Areas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 text-sm mb-1">Community Safety Notice</h4>
                <p className="text-xs text-blue-700">
                  These reports are shared by community members to help identify unsafe areas and patterns. 
                  Stay vigilant and report any incidents to help keep everyone safe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public Incidents List */}
        {isLoadingIncidents ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : publicIncidents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Public Incidents</h3>
              <p className="text-muted-foreground text-sm">
                The community hasn't reported any public incidents yet. 
                This is a good sign for neighborhood safety!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {publicIncidents.map((incident: IncidentReport) => (
              <Card key={incident.id} data-testid={`incident-item-${incident.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getIncidentTypeIcon(incident.incidentType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{incident.title}</h4>
                        <Badge className={getSeverityColor(incident.severity || 'medium')}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize mb-2">
                        {incident.incidentType.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground mb-3">
                    {incident.description}
                  </p>
                  
                  <div className="space-y-2">
                    {incident.address && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{incident.address}</span>
                      </div>
                    )}
                    
                    {incident.tags && incident.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {incident.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(incident.createdAt!)}
                        </span>
                      </div>
                      <Badge 
                        variant={incident.status === 'resolved' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {incident.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Report Your Own Incident */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium mb-2">Experienced an Incident?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Help your community by reporting safety concerns
            </p>
            <Button 
              className="w-full"
              onClick={() => window.location.href = "/reports"}
              data-testid="button-report-incident"
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
