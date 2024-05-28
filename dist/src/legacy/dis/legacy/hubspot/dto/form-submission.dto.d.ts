export declare class FormFields {
    objectTypeId: string;
    name: string;
    value: string | number | boolean;
}
export declare class FormContext {
    pageUri: string;
    pageName: string;
}
export declare class FormSubmissionDto {
    portalId: string;
    formId: number;
    fields: FormFields[];
    context: FormContext;
}
