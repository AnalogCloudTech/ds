export interface AppConfig {
  id: number;
  key: string;
  value: Value;
  createdAt: string;
  updatedAt: string;
}

export interface Value {
  MONTH: string;
  YEAR: string;
  SOCIAL_MEDIA_TRAINING_PLANS?: string[] | null;
  AFY_PLANS?: string[];
  RM_PREVIEW_URL: boolean;
  RMM_MARKETING_PLANS?: string[] | null;
  html?: string;
}
