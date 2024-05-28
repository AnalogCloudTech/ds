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
export declare enum HubspotObjectTypes {
    DEAL = "deal",
    CONTACT = "contact",
    COMPANIES = "companies",
    TICKETS = "tickets",
    PRODUCTS = "products"
}
export declare const ACTIONS: {
    readonly ADD_CREDITS: "add_credits";
    readonly ENROLL_CONTACT_TO_LIST: "enroll_contact_to_list";
    readonly SET_BOOK_PACKAGES: "set_book_packages";
};
export type ActionsEnum = (typeof ACTIONS)[keyof typeof ACTIONS];
export declare const STATUS: {
    readonly PENDING: "pending";
    readonly PROCESSING: "processing";
    readonly COMPLETED: "completed";
    readonly FAILED: "failed";
};
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
export type SyncData = AddCreditsData | EnrollToListData | SetBookPackagesData;
export declare const MAX_ATTEMPTS = 5;
