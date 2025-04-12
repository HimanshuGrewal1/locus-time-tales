
// Capsule type definition
export interface Capsule {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  expiresAt?: string;
  location: {
    lat: number;
    lng: number;
  };
  radius: number; // in meters
  content: CapsuleContent[];
  createdBy: string;
  isPublic: boolean;
  tags: string[];
}

export type CapsuleContentType = "text" | "image" | "audio" | "video" | "link";

export interface CapsuleContent {
  id: string;
  type: CapsuleContentType;
  value: string;
  caption?: string;
}

// Chat message type
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  locationId: string; // Area identifier
}

// User type
export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  createdAt: string;
}
