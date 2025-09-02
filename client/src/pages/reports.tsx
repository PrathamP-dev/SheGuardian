import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/bottom-navigation";
import IncidentReportModal from "@/components/incident-report-modal";
import { ArrowLeft, Plus, AlertTriangle, MapPin, Clock, FileText } from "lucide-react";
import type { IncidentReport } from "@shared/schema";

export default function Reports() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

  const { data: reports = [], isLoading: isLoadingReports } = useQuery({
    queryKey: ["/api/incident-reports"],
    enabled: isAuthenticated,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading reports...</p>
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
          <h1 className="text-lg font-semibold">My Reports</h1>
          <Button
            size="sm"
            onClick={() => setIsReportModalOpen(true)}
            data-testid="button-new-report"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </header>

      <div className="mobile-container p-4 space-y-4">
        {/* Summary Card */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Reports Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-primary">{reports.length}</div>
                <div className="text-xs text-muted-foreground">Total Reports</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">
                  {reports.filter((r: IncidentReport) => r.status === 'resolved').length}
                </div>
                <div className="text-xs text-muted-foreground">Resolved</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-600">
                  {reports.filter((r: IncidentReport) => r.status === 'open').length}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        {isLoadingReports ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-48"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Reports Yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Help make your community safer by reporting incidents
              </p>
              <Button 
                onClick={() => setIsReportModalOpen(true)}
                data-testid="button-create-first-report"
              >
                Create Your First Report
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reports.map((report: IncidentReport) => (
              <Card key={report.id} data-testid={`report-item-${report.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getIncidentTypeIcon(report.incidentType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{report.title}</h4>
                        <Badge variant="outline" className={getSeverityColor(report.severity || 'medium')}>
                          {report.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize mb-1">
                        {report.incidentType.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground mb-3 line-clamp-2">
                    {report.description}
                  </p>
                  
                  {report.address && (
                    <div className="flex items-center space-x-1 mb-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{report.address}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(report.createdAt!)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.isPublic && (
                        <Badge variant="secondary" className="text-xs">
                          Public
                        </Badge>
                      )}
                      <Badge 
                        variant={report.status === 'resolved' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <IncidentReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <BottomNavigation />
    </div>
  );
}
