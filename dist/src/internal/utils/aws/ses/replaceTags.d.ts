export type Replacer = {
    [key: string]: string;
};
export declare function replaceTags(body: string, replacers: Replacer): string;
export declare function replaceTagsOnDemandEmails(body: string, replacers: Replacer): string;
