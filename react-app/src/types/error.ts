import * as json from './json';

export interface UIError {
    code: string;
    source: string;
    message: string;
    data?: json.JSONValue;
}

export class UIException extends Error {
    error: UIError;
    constructor(error: UIError) {
        super(error.message);
        this.error = error;
    }

    getError(): UIError {
        return this.error;
    }
}