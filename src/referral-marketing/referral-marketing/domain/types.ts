export enum UploadImage {
  YES = 'yes',
  NO = 'no',
}

export enum ChangeStatus {
  ALL = 'all',
  APPROVED = 'approved',
  FOR_REVIEW = 'for-review',
  SUBMITTED = 'submitted',
}

export enum Leads {
  WITH_LEADS = 'with_leads',
  WITHOUT_LEADS = 'without_leads',
  BOTH = 'send_to_both_members_and_leads',
}

export type MemberDetails = {
  firstName: string;
  lastName?: string;
  emailAddress: string;
  phoneNumber: number;
  website: string;
  submittedDate: Date;
  brokerageAddress: string;
};

export type FrontCover = {
  frontCovertemplate: string;
  frontCoverStripTempalte: string;
};

export type InsideCover = {
  changeBrokerageName: string;
  brokerageName: string;
  customizedCoverLetter: string;
  coverLetter: string;
};

export type AdditionalCustomization = {
  uploadImage: UploadImage;
  updatedCoverPhoto?: UploadImage;
  uploadImageLink: string;
  additionalInstructions: string;
};

export type Testimonial = string;

export type Testimonials = Testimonial[];

export type ListingDetails = {
  listingAddress: string;
  listingName: string;
  listingGeneralDescription: string;
  listingFeatures: string[];
};

export type ReferralPartner = {
  partnerName: string;
  partnerHeader: string;
  partnerDescription: string;
  marketingPhone: number;
  partnerAddress: string;
  imageUpload: boolean;
  uploadedImageLink: string;
};
