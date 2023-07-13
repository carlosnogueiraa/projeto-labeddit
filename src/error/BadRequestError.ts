import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
    constructor(
        public message: string
    ) {
        super(400, message)
    }
}