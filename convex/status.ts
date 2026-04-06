export enum Status {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
};

export type ConvexResponse = Status | Object;

