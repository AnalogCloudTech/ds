interface Response {
  status: number;
}

export class ErrorInfo extends Error {
  response: Response;
  message: string;
}

export interface PlanTypes {
  isAfy: boolean;
  isRm: boolean;
  isDentist: boolean;
}

export const planTypeKeys = {
  isAfy: 'AFY',
  isRm: 'RM',
  isDentist: 'Dentist',
} as const;
