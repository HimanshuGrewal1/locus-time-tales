
import { useState } from "react";
import { ArrowLeft, Camera, MapPin, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ARView } from "@/components/ARView";
import { formatDistanceToNow } from "date-fns";

export function CapsuleDetails({
  capsule,
  userLocation,
  onBack,
}) {
  const [showAR, setShowAR] = useState(false);

  // Format the date for display
  const formattedDate = formatDistanceToNow(new Date(capsule.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <Card className="w-full h-full flex flex-col max-h-full">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="flex-1 text-center truncate">
            {capsule.title}
          </CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAR(true)}
            className="rounded-full"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                Location radius: {capsule.radius}m
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Clock className="h-4 w-4" />
              <span>Created {formattedDate}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <User className="h-4 w-4" />
              <span>By {capsule.createdBy}</span>
            </div>

            <div className="mt-4">
              <h3 className="font-medium">Description</h3>
              <p className="text-sm mt-1">{capsule.description}</p>
            </div>

            <div className="mt-2">
              <h3 className="font-medium mb-2">Content</h3>
              <div className="space-y-4">
                {capsule.content.map((content) => (
                  <CapsuleContentItem key={content.id} content={content} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showAR && <ARView capsule={capsule} onClose={() => setShowAR(false)} />}
    </>
  );
}

function CapsuleContentItem({ content }) {
  switch (content.type) {
    case "text":
      return (
        <div className="bg-secondary p-3 rounded-lg">
          <p className="text-sm">{content.value}</p>
          {content.caption && (
            <p className="text-xs text-muted-foreground mt-1">
              {content.caption}
            </p>
          )}
        </div>
      );
    case "image":
      return (
        <div className="bg-secondary p-3 rounded-lg">
          <img
            src={content.value}
            alt={content.caption || "Capsule image"}
            className="w-full h-auto rounded-md object-cover"
          />
          {content.caption && (
            <p className="text-xs text-muted-foreground mt-1">
              {content.caption}
            </p>
          )}
        </div>
      );
    case "audio":
      return (
        <div className="bg-secondary p-3 rounded-lg">
          <audio controls className="w-full">
            <source src={content.value} />
            Your browser does not support the audio element.
          </audio>
          {content.caption && (
            <p className="text-xs text-muted-foreground mt-1">
              {content.caption}
            </p>
          )}
        </div>
      );
    default:
      return (
        <div className="bg-secondary p-3 rounded-lg">
          <p className="text-sm">Unsupported content type: {content.type}</p>
        </div>
      );
  }
}
