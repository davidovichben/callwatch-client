export class CallbackTextModel {
  id: number;
  type: string;
  content: string;
  isActive: boolean;
}

export const CallbackTextTypes = [
  'message_leave', 'customer_return', 'message_max_retries',
  'message_completed', 'not_handled', 'out_of_schedule', 'left_open'
];

