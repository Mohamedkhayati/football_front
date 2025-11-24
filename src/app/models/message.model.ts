export interface Message {
  sender: string;
  content: string;
  timestamp: Date;
  imageUrl?: string; // optional property for images
}
