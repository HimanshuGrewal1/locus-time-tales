
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Capsule } from "@/types";

interface ARViewProps {
  capsule: Capsule | null;
  onClose: () => void;
}

export function ARView({ capsule, onClose }: ARViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          console.error("getUserMedia is not supported in this browser");
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      // Clean up camera stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  if (!capsule) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-4 right-4">
          <Button variant="outline" size="icon" onClick={onClose}>
            X
          </Button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Card className="bg-background/80 backdrop-blur-md">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold">{capsule.title}</h2>
              <p className="text-sm text-muted-foreground">
                {capsule.description}
              </p>
              <p className="mt-2">
                Point your camera at the location to unlock the capsule!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
