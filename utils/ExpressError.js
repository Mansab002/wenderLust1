class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.stasusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;