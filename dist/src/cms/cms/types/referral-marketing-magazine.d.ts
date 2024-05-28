import { MediaCMS } from './media';
export type ReferralMarketingCoverDesignOption = {
    id: number;
    name: string;
    html: string;
    formKeyword: string;
    defaultText: string;
    displayImage: MediaCMS;
};
export declare class ReferralMarketingMagazine {
    month: string;
    year: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    pdf: MediaCMS;
    previewPdf?: MediaCMS;
    frontCoverDesign: ReferralMarketingCoverDesignOption[];
    frontInsideCover: ReferralMarketingCoverDesignOption[];
    frontCoverStrip: ReferralMarketingCoverDesignOption[];
    backInsideCover: ReferralMarketingCoverDesignOption[];
    backCover: ReferralMarketingCoverDesignOption[];
}
