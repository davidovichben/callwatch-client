export class CallbackTextModel {
  id: number;
  type: string;
  content: string;
  isActive: boolean;
}

export const CallbackTextTypes = [
  'message_max_retries', 'message_completed', 'message_leave',
  'customer_return', 'not_handled', 'out_of_schedule', 'left_open'
];

