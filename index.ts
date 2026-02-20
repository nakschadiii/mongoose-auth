import * as handlers from "./handlers";
import * as types from "./types";

interface MongoAuthConstructor {
    options: types.Options;
    models: types.Models;
    fields: types.Fields;
    crypt: types.Crypt;
    jwt: types.JWT;
}

export default class MongooseAuth {
    private options: types.Options;
    private models: types.Models;
    private fields: types.Fields;
    private crypt: types.Crypt;
    private jwt: any;

    constructor({ options, models, fields, crypt, jwt }: MongoAuthConstructor) {
        this.options = options;
        this.models = models;
        this.fields = fields;
        this.crypt = crypt;
        this.jwt = jwt;
    }

    async register(payload: any) {
        try {
            return {
                success: true,
                data: await handlers.register.call(this, payload),
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async login(payload: any) {
        try {
            return {
                success: true,
                data: await handlers.login.call(this, payload),
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async verifyOTP(payload: { token: string, code: string }) {
        try {
            return {
                success: true,
                data: await handlers.verifyOTP.call(this, payload),
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}

