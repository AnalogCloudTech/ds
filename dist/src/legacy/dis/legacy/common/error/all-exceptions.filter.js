"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
var ExceptionTypes;
(function (ExceptionTypes) {
    ExceptionTypes["HUBSPOT"] = "Hubspot";
    ExceptionTypes["AXIOS"] = "Axios";
    ExceptionTypes["BAD_REQUEST"] = "BadRequest";
    ExceptionTypes["STRIPE"] = "Stripe";
    ExceptionTypes["GOOGLE"] = "Google";
    ExceptionTypes["DEFAULT"] = "Default";
})(ExceptionTypes || (ExceptionTypes = {}));
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        try {
            const exceptionType = this.getExceptionType(exception);
            const errorObject = this[`buildErrorObjectFor${exceptionType}`](exception, request);
            response.status(errorObject.statusCode).json(errorObject);
        }
        catch (e) {
            const errorObject = this.buildErrorObjectForDefault(e, request);
            response.status(errorObject.statusCode).json(errorObject);
        }
    }
    buildErrorObjectForBadRequest(exception, request) {
        const { response, status } = exception;
        const { method, url } = request;
        return {
            statusCode: status,
            error: response.error,
            errors: response.message,
            path: url,
            method: method,
            timestamp: new Date(),
            origin: 'DIS',
        };
    }
    buildErrorObjectForAxios(exception, request) {
        const { statusText, config, response } = exception;
        const { method, url } = request;
        const statusCode = response ? response.status : 404;
        const errorMessage = (response === null || response === void 0 ? void 0 : response.statusText) || statusText || exception.message;
        const innerError = {
            statusCode,
            error: errorMessage,
            errors: [errorMessage],
            path: `${config.baseURL}${config.url}`,
            method: config.method,
            timestamp: new Date(),
            origin: 'Axios_request',
        };
        return {
            statusCode,
            error: 'AXIOS_ERROR',
            errors: [errorMessage],
            path: url,
            method: method,
            timestamp: new Date(),
            origin: 'Axios',
            innerError,
        };
    }
    buildErrorObjectForStripe(exception, request) {
        const { message, code } = exception.raw;
        const { method, url } = request;
        return {
            statusCode: exception.statusCode,
            error: code,
            errors: [message],
            path: url,
            method: method,
            timestamp: new Date(),
            origin: 'Stripe',
        };
    }
    buildErrorObjectForHubspot(exception, request) {
        const jsonException = exception.response.toJSON();
        const { statusCode, body } = jsonException;
        const { method, url } = request;
        return {
            statusCode,
            error: body.category,
            errors: [body.message],
            path: url,
            method: method,
            timestamp: new Date(),
            origin: 'Hubspot',
        };
    }
    buildErrorObjectForDefault(exception, request) {
        const { stack, message, name } = exception;
        const { method, url } = request;
        const code = (0, lodash_1.get)(exception, ['response', 'statusCode']) ||
            (0, lodash_1.get)(exception, ['response', 'status']) ||
            (0, lodash_1.get)(exception, ['statusCode']) ||
            (0, lodash_1.get)(exception, ['code']) ||
            common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        return {
            statusCode: code,
            error: name,
            errors: [message],
            path: url,
            method: method,
            timestamp: new Date(),
            origin: 'DIS',
            stack: stack,
        };
    }
    buildErrorObjectForGoogle(exception, request) {
        const { config, response, code } = exception;
        const { method, url } = request;
        const error = (0, lodash_1.get)(response, ['data', 'error', 'message'], '');
        const errors = (0, lodash_1.map)((0, lodash_1.get)(response, ['data', 'error', 'errors'], []), (error) => error.message);
        const innerError = {
            statusCode: response.status,
            error: error,
            errors: errors,
            path: config.url,
            method: config.method,
            timestamp: new Date(),
            origin: 'Google_request',
        };
        return {
            statusCode: code,
            error: 'GOOGLE_ERROR',
            errors: ['Google API error'],
            path: url,
            method: method,
            timestamp: new Date(),
            origin: 'Google',
            innerError,
        };
    }
    getExceptionType(exception) {
        if (this.isHubspotException(exception)) {
            return ExceptionTypes.HUBSPOT;
        }
        else if (this.isAxiosError(exception)) {
            return ExceptionTypes.AXIOS;
        }
        else if (this.isBadRequest(exception)) {
            return ExceptionTypes.BAD_REQUEST;
        }
        else if (this.isStripeError(exception)) {
            return ExceptionTypes.STRIPE;
        }
        else if (this.isGoogleError(exception)) {
            return ExceptionTypes.GOOGLE;
        }
        else {
            return ExceptionTypes.DEFAULT;
        }
    }
    isGoogleError(exception) {
        const url = (0, lodash_1.get)(exception, ['config', 'url'], '');
        return url.includes('googleapis.com');
    }
    isHubspotException(exception) {
        return (0, lodash_1.get)(exception, ['response', 'request', 'uri', 'hostname'], null) ===
            'api.hubapi.com'
            ? true
            : false;
    }
    isAxiosError(exception) {
        return exception.isAxiosError;
    }
    isBadRequest(exception) {
        return exception instanceof common_1.BadRequestException;
    }
    isStripeError(exception) {
        const stripeVersion = (0, lodash_1.get)(exception, ['raw', 'headers', 'stripe-version']);
        const requestId = (0, lodash_1.get)(exception, ['raw', 'requestId']);
        return Boolean(stripeVersion && requestId);
    }
};
AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
//# sourceMappingURL=all-exceptions.filter.js.map