
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Map } from "@/components/Map";
import { CapsuleDetails } from "@/components/CapsuleDetails";
import { CreateCapsule } from "@/components/CreateCapsule";
import { LocalChat } from "@/components/LocalChat";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, MapPin, Camera } from "lucide-react";
import { Capsule } from "@/types";
import { getCurrentPosition } from "@/lib/location";
import { generateMockCapsules, currentUser } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const Index = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const { user } = useAuth();

  // Get the user's location and generate mock capsules
  useEffect(() => {
    const initializeData = async () => {
      try {
        const position = await getCurrentPosition();
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);

        // Generate mock capsules around the user's location
        const mockCapsules = generateMockCapsules(
          location.lat,
          location.lng,
          8
        );
        setCapsules(mockCapsules);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    initializeData();
  }, []);

  const handleCapsuleSelect = (capsule: Capsule) => {
    setSelectedCapsule(capsule);
  };

  const handleCreateCapsule = (newCapsule: Capsule) => {
    setCapsules([...capsules, newCapsule]);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        <Header />
        
        <main className="flex-1 relative">
          {/* Map View */}
          <div className="absolute inset-0">
            <Map capsules={capsules} onCapsuleSelect={handleCapsuleSelect} />
          </div>
          
          {/* Selected Capsule Details */}
          {selectedCapsule && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
              <CapsuleDetails
                capsule={selectedCapsule}
                userLocation={userLocation}
                onBack={() => setSelectedCapsule(null)}
              />
            </div>
          )}
          
          {/* Local Chat */}
          <LocalChat
            locationId="area1" // In a real app, this would be location-based
            currentUser={user || currentUser}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
          
          {/* Create Capsule Dialog */}
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Time Capsule</DialogTitle>
                <DialogDescription>
                  Create a digital time capsule at your current location that others can discover.
                </DialogDescription>
              </DialogHeader>
              <CreateCapsule
                userLocation={userLocation}
                onClose={() => setIsCreating(false)}
                onSave={handleCreateCapsule}
              />
            </DialogContent>
          </Dialog>
          
          {/* Introduction Dialog */}
          <Dialog open={showIntro} onOpenChange={setShowIntro}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Welcome to LocusTimeTales</DialogTitle>
                <DialogDescription>
                  Discover and create digital time capsules tied to real-world locations. Leave messages, photos, and memories for others to find when they visit the same spot.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 my-4">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">GPS-Locked Content</h3>
                    <p className="text-sm text-muted-foreground">
                      Capsules are only visible when you're physically near them.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">AR Unlocking</h3>
                    <p className="text-sm text-muted-foreground">
                      Use your camera to find and unlock capsules in the real world.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Local Chat</h3>
                    <p className="text-sm text-muted-foreground">
                      Talk anonymously with others nearby to share discoveries.
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowIntro(false)}>
                  Get Started
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
