import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Shield, 
  Building, 
  Hospital,
  Search,
  Filter
} from "lucide-react";

interface SafePlace {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'fire' | 'shelter' | 'community';
  address: string;
  distance: string;
  phone: string;
  hours: string;
  isOpen: boolean;
  lat: number;
  lng: number;
}

interface SafePlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SafePlacesModal({ isOpen, onClose }: SafePlacesModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [safePlaces, setSafePlaces] = useState<SafePlace[]>([]);

  // Mock safe places data (in real app, this would come from an API)
  const mockSafePlaces: SafePlace[] = [
    {
      id: '1',
      name: 'Delhi Police Station - Connaught Place',
      type: 'police',
      address: 'Connaught Place, New Delhi, Delhi 110001',
      distance: '0.3 km',
      phone: '100',
      hours: '24 hours',
      isOpen: true,
      lat: 28.6328,
      lng: 77.2197
    },
    {
      id: '2',
      name: 'All India Institute of Medical Sciences',
      type: 'hospital',
      address: 'Ansari Nagar, New Delhi, Delhi 110029',
      distance: '1.2 km',
      phone: '102',
      hours: '24 hours',
      isOpen: true,
      lat: 28.5672,
      lng: 77.2100
    },
    {
      id: '3',
      name: 'Women\'s Help Desk - Khan Market',
      type: 'community',
      address: 'Khan Market, New Delhi, Delhi 110003',
      distance: '0.8 km',
      phone: '181',
      hours: '24 hours',
      isOpen: true,
      lat: 28.5986,
      lng: 77.2339
    },
    {
      id: '4',
      name: 'Fire Station - Central Delhi',
      type: 'fire',
      address: 'Barakhamba Road, New Delhi, Delhi 110001',
      distance: '0.5 km',
      phone: '101',
      hours: '24 hours',
      isOpen: true,
      lat: 28.6289,
      lng: 77.2065
    },
    {
      id: '5',
      name: 'Nirmal Chhaya Shelter Home',
      type: 'shelter',
      address: 'Lajpat Nagar, New Delhi, Delhi 110024',
      distance: '2.1 km',
      phone: '+91-11-29817603',
      hours: '24 hours',
      isOpen: true,
      lat: 28.5651,
      lng: 77.2428
    },
    {
      id: '6',
      name: 'Safdarjung Hospital',
      type: 'hospital',
      address: 'Ansari Nagar West, New Delhi, Delhi 110029',
      distance: '1.5 km',
      phone: '102',
      hours: '24 hours',
      isOpen: true,
      lat: 28.5738,
      lng: 77.2063
    }
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use Delhi as default location
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    } else {
      // Use Delhi as default location
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
    }

    setSafePlaces(mockSafePlaces);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'police':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'hospital':
        return <Hospital className="h-4 w-4 text-red-600" />;
      case 'fire':
        return <Building className="h-4 w-4 text-orange-600" />;
      case 'shelter':
        return <Building className="h-4 w-4 text-purple-600" />;
      case 'community':
        return <Building className="h-4 w-4 text-green-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'police':
        return 'bg-blue-100 text-blue-800';
      case 'hospital':
        return 'bg-red-100 text-red-800';
      case 'fire':
        return 'bg-orange-100 text-orange-800';
      case 'shelter':
        return 'bg-purple-100 text-purple-800';
      case 'community':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPlaces = safePlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || place.type === selectedType;
    return matchesSearch && matchesType;
  });

  const openDirections = (place: SafePlace) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const callPlace = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] flex flex-col" data-testid="safe-places-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Safe Places Nearby</span>
          </DialogTitle>
        </DialogHeader>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-places"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Button
              size="sm"
              variant={selectedType === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedType('all')}
              className="whitespace-nowrap"
              data-testid="filter-all"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={selectedType === 'police' ? 'default' : 'outline'}
              onClick={() => setSelectedType('police')}
              className="whitespace-nowrap"
              data-testid="filter-police"
            >
              Police
            </Button>
            <Button
              size="sm"
              variant={selectedType === 'hospital' ? 'default' : 'outline'}
              onClick={() => setSelectedType('hospital')}
              className="whitespace-nowrap"
              data-testid="filter-hospital"
            >
              Hospitals
            </Button>
            <Button
              size="sm"
              variant={selectedType === 'shelter' ? 'default' : 'outline'}
              onClick={() => setSelectedType('shelter')}
              className="whitespace-nowrap"
              data-testid="filter-shelter"
            >
              Shelters
            </Button>
          </div>
        </div>

        {/* Places List */}
        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="border rounded-lg p-4 space-y-3"
                data-testid={`place-${place.id}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getTypeIcon(place.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-sm truncate">{place.name}</h3>
                      <Badge className={`text-xs ${getTypeColor(place.type)}`}>
                        {place.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{place.address}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Navigation className="h-3 w-3" />
                        <span>{place.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className={place.isOpen ? 'text-green-600' : 'text-red-600'}>
                          {place.hours}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDirections(place)}
                    className="flex-1"
                    data-testid={`button-directions-${place.id}`}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Directions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => callPlace(place.phone)}
                    data-testid={`button-call-${place.id}`}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Emergency Services</span>
          </div>
          <p className="text-xs text-red-600 mt-1">
            For immediate emergencies, call 112 (National Emergency) or 100 (Police)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}