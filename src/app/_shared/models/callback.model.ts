import { CallbackTextModel } from './callback-text.model';

export class CallbackModel {
	id: number;
	name: string;
  description: string;
  requestDuration: number;
  dialAttempts: number;
  enableDialer: boolean;
  schedule: number;
  answerCalculation: number;
  dialAttemptIntervals: number;
  mailCallback: boolean;
  file: string | Blob;
  fileName: string;
  texts: CallbackTextModel[];
}
