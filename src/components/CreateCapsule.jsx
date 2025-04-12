
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { X, Image, Mic, Check } from "lucide-react";

export function CreateCapsule({
  userLocation,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [radius, setRadius] = useState(50); // Default radius in meters
  const [content, setContent] = useState([]);
  const [textContent, setTextContent] = useState("");

  const handleSave = () => {
    if (!userLocation || !title) return;

    // In a real app, you'd want to generate this on the server
    const newCapsule = {
      id: Date.now().toString(),
      title,
      description,
      createdAt: new Date().toISOString(),
      location: {
        lat: userLocation.lat,
        lng: userLocation.lng,
      },
      radius,
      content: [
        ...content,
        ...(textContent
          ? [
              {
                id: Date.now().toString(),
                type: "text",
                value: textContent,
              },
            ]
          : []),
      ],
      createdBy: "Anonymous", // Would be the user's ID in a real app
      isPublic: true,
      tags: [],
    };

    onSave(newCapsule);
    onClose();
  };

  const handleAddImage = () => {
    // In a real app, this would open a file picker
    // For this demo, we'll add a placeholder image
    const newContent = {
      id: Date.now().toString(),
      type: "image",
      value: "https://picsum.photos/seed/capsule/300/200",
      caption: "Sample image",
    };
    setContent([...content, newContent]);
  };

  const handleAddAudio = () => {
    // In a real app, this would record audio or open a file picker
    // For this demo, we'll just add a placeholder
    const newContent = {
      id: Date.now().toString(),
      type: "audio",
      value: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
      caption: "Sample audio recording",
    };
    setContent([...content, newContent]);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Create New Capsule</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Name your capsule"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What's this capsule about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Radius (meters): {radius}m</Label>
          <Slider
            value={[radius]}
            min={10}
            max={200}
            step={10}
            onValueChange={(values) => setRadius(values[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Add your message</Label>
          <Textarea
            id="content"
            placeholder="Write something for others to discover..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Add media</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={handleAddImage}
            >
              <Image className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={handleAddAudio}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {content.length > 0 && (
          <div className="space-y-2">
            <Label>Added content</Label>
            <div className="space-y-2">
              {content.map((item) => (
                <div
                  key={item.id}
                  className="bg-secondary p-2 rounded-md flex items-center justify-between"
                >
                  <span className="text-sm capitalize">{item.type}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setContent(content.filter((c) => c.id !== item.id))
                    }
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!title || (!textContent && content.length === 0)}
        >
          <Check className="h-4 w-4 mr-1" /> Save Capsule
        </Button>
      </CardFooter>
    </Card>
  );
}
