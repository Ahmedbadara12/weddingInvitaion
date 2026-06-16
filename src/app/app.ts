import { Component } from '@angular/core';
import { WeddingInvitationComponent } from './wedding-invitation/wedding-invitation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WeddingInvitationComponent],
  template: `<app-wedding-invitation></app-wedding-invitation>`,
  styles: [],
})
export class App {}
