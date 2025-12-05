export enum Status {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
}

export interface User {
    nickName: string; // @Id field, used for lookups
    fullName: string;
    status: Status;
}
