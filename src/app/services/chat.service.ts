import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8090/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, conversationId?: string): Observable<any> {
    const body = {
      message: message,
      conversationId: conversationId || null
    };
    return this.http.post<any>(this.apiUrl, body);
  }
  analyzeImage(image: File, description?: string): Observable<any> {
  const formData = new FormData();
  formData.append('image', image);
  if (description) {
    formData.append('description', description);
  }
  return this.http.post('http://localhost:8090/api/image/analyze', formData);
}

}
