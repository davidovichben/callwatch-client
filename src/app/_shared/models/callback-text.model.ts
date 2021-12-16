export class CallbackTextModel {
  id: number;
  type: string;
  content: string;
  isActive: boolean;
}

export const CallbackTextTypes = [
  'messageMaxRetries', 'messageCompleted', 'messageLeave',
  'customerReturn', 'notHandled', 'outOfSchedule', 'leftOpen'
];

