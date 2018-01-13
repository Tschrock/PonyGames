
export class HttpError extends Error {
    public status: number;
    constructor(message: string = "Not Found", code: number = 404) {
        super(message);
        this.status = code;
    }
}

export class HttpError_400_BadRequest extends HttpError { constructor(message: string = "Bad Request") { super(message, 400); } }
export class HttpError_401_Unauthorized extends HttpError { constructor(message: string = "Unauthorized") { super(message, 401); } }
export class HttpError_403_Forbidden extends HttpError { constructor(message: string = "Forbidden") { super(message, 403); } }
export class HttpError_404_NotFound extends HttpError { constructor(message: string = "Not Found") { super(message, 404); } }
