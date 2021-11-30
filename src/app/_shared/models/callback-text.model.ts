export class CallbackTextModel {
  id: number;
  name: string;
  content: string;
  isActive: boolean;
}

export const CallbackTextNames = [
  'messageMaxRetries', 'messageCompleted', 'messageLeave',
  'customerReturn', 'notHandled', 'outOfSchedule', 'leftOpen'
];

