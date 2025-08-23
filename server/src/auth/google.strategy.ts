import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-google-oauth20";
import * as process from "node:process";
import e from "express";
import passport from "passport";

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    // protected _oauth2: OAuth2;
    // name: string;

    validate(args: any): Promise<false | unknown | null> | false | unknown | null {
        return undefined;
    }

    authenticate(req: e.Request, options?: any): void;
    authenticate(req: e.Request, options?: any): any;
    authenticate(req: e.Request, options?: any): any {
    }

    // authorizationParams(options: any): object {
    //     return undefined;
    // }

    error(err: any): void {
    }

    fail(challenge?: passport.StrategyFailure | string | number, status?: number): void {
    }

    // parseErrorResponse(body: any, status: number): Error | null {
    //     return undefined;
    // }

    pass(): void {
    }

    redirect(url: string, status?: number): void {
    }

    success(user: Express.User, info?: object): void {
    }

    // tokenParams(options: any): object {
    //     return undefined;
    // }

    userProfile(accessToken: string, done: (err?: unknown, profile?: any) => void): void {
    }
}