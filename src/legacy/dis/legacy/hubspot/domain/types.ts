export interface HSDataObject<T = any> {
  id: string;
  attributes: T;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
}

export interface DealProperties {
  amount: string;
  status: string;
  chargify_subscription_id: string;
}

export type HubspotPropertyVersion = {
  value: string;
  'source-type': string;
  'source-id'?: string;
  'source-label'?: string;
  'updated-by-user-id'?: number;
  timestamp: number;
  selected: boolean;
};

export type HubspotProperty = {
  [key: string]: {
    value: string;
    versions: Array<HubspotPropertyVersion>;
  };
};

export type AddToListResponseV1 = {
  updated: Array<string | number>;
  discarded: Array<string | number>;
  invalidVids: Array<string | number>;
  invalidEmails: Array<string | number>;
};

export type ContactV1 = {
  vid: number;
  'canonical-vid': number;
  'merged-vids': Array<unknown>;
  properties: HubspotProperty;
  'form-submissions': Array<unknown>;
  'list-memberships': Array<unknown>;
  'identity-profiles': Array<unknown>;
  'merge-audits': Array<unknown>;
};
export type Contact = {
  results: Result[];
};
export type Contacts = {
  contacts: Contact;
};

export type Result = {
  id: string;
  type: string;
};
export type ContactResponse = {
  associations: Contacts;
};

export type ContactList = {
  vid: number;
  'canonical-vid': number;
  'merged-vids': Array<unknown>;
  properties: HubspotProperty;
  'form-submissions': Array<unknown>;
  'list-memberships': Array<unknown>;
  'identity-profiles': Array<IdentitiesProfiles>;
  'merge-audits': Array<unknown>;
};

export type IdentitiesProfiles = {
  vid: string;
  identities: Array<Identities>;
};

export type Identities = {
  type: string;
  value: string;
  'is-primary'?: boolean;
};

export type ListOfContacts = {
  contacts: Array<ContactList>;
  'has-more': boolean;
  'vid-offset': number;
};
export type Pipeline = {
  value: string;
};

export type FormSubmissionObject = {
  redirectUri: string;
  inlineMessage: string;
};

export type MessageErrorObj = {
  message: string;
  errors: number;
};

export enum HubspotObjectTypes {
  DEAL = 'deal',
  CONTACT = 'contact',
  COMPANIES = 'companies',
  TICKETS = 'tickets',
  PRODUCTS = 'products',
}

// used by: hubspot-sync-actions.repository.ts
export const ACTIONS = {
  ADD_CREDITS: 'add_credits',
  ENROLL_CONTACT_TO_LIST: 'enroll_contact_to_list',
  SET_BOOK_PACKAGES: 'set_book_packages',
  ASSOCIATE_DEAL: 'associate_deal',
} as const;

export type ActionsEnum = (typeof ACTIONS)[keyof typeof ACTIONS];

export const STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type StatusEnum = (typeof STATUS)[keyof typeof STATUS];

export interface AddCreditsData {
  newCredits: number;
}

export interface EnrollToListData {
  listId: number;
}

export interface SetBookPackagesData {
  bookPackages: Array<string>;
}

export interface AssociateDealData {
  dealId: string;
}

export interface QuoteLink {
  quoteLink: string;
}

export interface QuotesQueueJob {
  email: string;
  quoteLink: string;
}

export interface AssociationType {
  to: {
    id: string;
  };
  types: {
    associationCategory: string;
    associationTypeId: number;
  }[];
}

export interface QuotePayloadType {
  properties: {
    [key: string]: string;
  };
  associations: AssociationType[];
}

export type SyncData =
  | AddCreditsData
  | EnrollToListData
  | SetBookPackagesData
  | AssociateDealData;

export const MAX_ATTEMPTS = 5;
