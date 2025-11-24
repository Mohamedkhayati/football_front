import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: Message[] = [];
  userInput: string = '';
  conversationId?: string;
  isLoading: boolean = false;

  selectedImage?: File;
  imagePreview?: string;
  imageDescription: string = '';

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({
      sender: 'user',
      content: this.userInput,
      timestamp: new Date()
    });
    this.isLoading = true;
    this.chatService.sendMessage(this.userInput, this.conversationId).subscribe({
      next: response => {
        this.conversationId = response.conversationId;
        this.messages.push({
          sender: 'bot',
          content: response.response,
          timestamp: new Date()
          // Add imageUrl if your response may include images
        });
        this.isLoading = false;
      },
      error: _ => {
        this.messages.push({
          sender: 'bot',
          content: "Error communicating with server",
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
    this.userInput = '';
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  analyzeImage() {
    if (!this.selectedImage) return;
    this.messages.push({
      sender: 'user',
      content: `[Image: ${this.selectedImage.name}] ${this.imageDescription || 'Analyze this football image'}`,
      timestamp: new Date()
    });
    this.isLoading = true;
    this.chatService.analyzeImage(this.selectedImage, this.imageDescription).subscribe({
      next: response => {
        this.messages.push({
          sender: 'bot',
          content: response.analysis,
          timestamp: new Date(),
          imageUrl: response.imageUrl // only if available in the response
        });
        this.isLoading = false;
        this.clearImage();
      },
      error: () => {
        this.messages.push({
          sender: 'bot',
          content: 'Error analyzing image',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }

  clearImage() {
    this.selectedImage = undefined;
    this.imagePreview = undefined;
    this.imageDescription = '';
  }
}
