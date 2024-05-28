export declare class CreateRmPrintTicketDto {
    email: string;
    coverUrl: string;
    magazineMonth: string;
    additionalInformation: string;
    rmProofLink: string;
    rmShippedMagazineLink: string;
    rmMemberSiteLink: string;
    adminFullName?: string;
}
export declare class CreateRmPrintTicketResponseDto {
    ticketId: string;
    contactId: string;
}
