/// <reference types="multer" />
/// <reference types="node" />
import { SchemaId } from '@/internal/types/helpers';
import { ValidationError } from 'class-validator';
import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
export declare class LeadEntity {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    segments: Segments;
    allSegments: boolean;
    customerEmail: string;
    bookId: string;
    isValid: boolean;
    unsubscribed: boolean;
    customer: SchemaId;
    private validator;
    constructor(params?: {});
    fill(params: object): void;
    validate(): Promise<Array<ValidationError>>;
    set(property: string, value: LeadEntity[keyof LeadEntity]): void;
}
export declare class LeadEntityList {
    private file;
    list: LeadEntity[];
    setFile(file: Express.Multer.File): void;
    push(lead: LeadEntity): void;
    readFile(): Promise<unknown>;
    setAll(property: string, value: LeadEntity[keyof LeadEntity]): void;
    fillFromRawCsvFile(fileBuffer: Buffer): Promise<unknown>;
    fillFromXLSFile(fileBuffer: Buffer): boolean;
    private processCsvData;
}
