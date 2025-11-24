import { Component } from '@angular/core';
import { ChatComponent } from './chat/chat.component'; // <-- Static import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent], // <-- Use static reference here!
  template: `<app-chat />`
})
export class AppComponent {}
