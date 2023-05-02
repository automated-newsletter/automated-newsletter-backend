export enum SocketEventTypes {
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    NEWSLETTER_RESPONSE_SENT = "newsletter:response:sent",
    NEWSLETTER_RESPONSE_FAILED = "newsletter:response:failed",
}

export enum ResponseStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
}
