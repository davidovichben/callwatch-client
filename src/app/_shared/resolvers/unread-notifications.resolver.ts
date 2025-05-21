import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NotificationService } from '../services/http/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UnreadNotificationsResolver implements Resolve<number> {

  constructor(private notificationService: NotificationService) {}

  async resolve(): Promise<number> {
    try {
      return await this.notificationService.getUnreadCount();
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
      return 0;
    }
  }
}
