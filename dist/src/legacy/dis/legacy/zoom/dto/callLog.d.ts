declare enum CallLogStatus {
    recorded = "recorded",
    noAnswer = "no_answer"
}
export interface CallLog {
    id: string;
    result: CallLogStatus;
}
export type ForwardTo = {
    extension_number: string;
    id: string;
    name: string;
    type: string;
};
export type LogDetailsSite = {
    id: string;
    name: string;
};
export type LogDetailsType = {
    date_time: string;
    hold_time: number;
    device_private_ip: string;
    device_public_ip: string;
    duration: number;
    forward_to: ForwardTo;
    id: string;
    path: string;
    result: string;
    site: LogDetailsSite;
};
export type CallLogDto = {
    id: string;
    call_type: 'pstn' | 'international';
    caller_number: string;
    caller_number_type: number;
    caller_name: string;
    callee_number: string;
    callee_number_type: number;
    callee_number_source: string;
    callee_location: string;
    direction: 'outbound' | 'inbound';
    duration: number;
    result: string;
    date_time: string;
    recording_id: string;
    recording_type: string;
    has_voicemail: boolean;
    call_id: string;
    caller_did_number: string;
    caller_country_code: string;
    caller_country_iso_code: string;
    callee_did_number: string;
    callee_country_code: string;
    callee_country_iso_code: string;
    call_end_time: string;
    department: string;
    cost_center: string;
    path?: string;
    log_details?: LogDetailsType;
};
export type CallLogResponse = {
    next_page_token: string;
    page_size: number;
    total_records: number;
    from: string;
    to: string;
    call_logs: CallLogDto[];
};
export type CallLogAxiosResponse = {
    data: CallLogResponse;
};
export type AccessTokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
};
export type UrlParamsCallLog = {
    from: string;
    to: string;
    page_size: string;
    next_page_token?: string;
};
export interface CallRecording {
    id: string;
    caller_number: string;
    caller_number_type: number;
    caller_name: string;
    callee_number: string;
    callee_number_type: number;
    callee_name: string;
    direction: 'outbound' | 'inbound';
    duration: number;
    download_url: string;
    file_url: string;
    date_time: string;
    recording_type: string;
    call_log_id: string;
    call_id: string;
    owner: {
        type: string;
        id: string;
        name: string;
        extension_number: number;
    };
    site: Record<string, unknown>;
    end_time: string;
    disclaimer_status: number;
}
export {};
