import { RouterKeyModel } from 'src/app/_shared/models/router-key.model';
import { RouterMessageModel } from 'src/app/_shared/models/router-message.model';

export class RouterModel {
	id: number;
	name: string;
  queueFile: string;
  queueFileName: string;
  general: object;
  messages: RouterMessageModel[];
  keys: RouterKeyModel[];
}
