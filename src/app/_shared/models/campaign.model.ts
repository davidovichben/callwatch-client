export class CampaignModel {
  id: number;
  name: string;
  recipients: string;
  module: string;
  status: string;
  lastSentDate: string;
  sentNumber: number;
}

export enum CampaignStatuses {
  active = 'פעיל',
  inactive = 'לא פעיל'
}

export enum CampaignModules {
  form = 'טפסים דינמיים',
  // price_quotes = 'הצעות מחיר'
}

export enum CampaignMethods {
  email = 'אימייל',
  sms = 'sms'
}

export const CampaignTimings = {
  7: 'כשבוע לפני מועד תשלום',
  3: 'כשלושה ימים לפני מועד תשלום',
  1: 'כיום לפני מועד תשלום'
};
