import jwt from "jsonwebtoken";
import { ResponseHelper } from "../helpers/responseHelper";
import { UserDataServiceProvider } from "../services/database/userDataServiceProvider";
import configData from "../../config/appConfig";
import { BadRequestException } from "../exceptions/badRequestException";
import { Context, Next } from "hono";
import { UnauthorisedException } from "../exceptions/unauthorisedException";
import { NotFoundException } from "../exceptions/notFounException";
import { ForbiddenException } from "../exceptions/forbiddenException";
const userDataServiceProvider = new UserDataServiceProvider();

export class AuthMiddleware {


    public async checkAuthHeader(c: Context, next: any) {
        const authHeader = c.req.header("authorization");
        if (!c.req.header("authorization")) {        
            throw new UnauthorisedException("No Authorization Token");
        }
        await next();
    };

    public async validateAccessToken(c: Context, next: any) {
        try {

            const accessToken = c.req.header("authorization") || "";

            if (accessToken) {
                const decodedToken: any = await jwt.decode(accessToken);
                if (!decodedToken) {
                    throw new ForbiddenException('Forbidden - Invalid Token')
                }
                const user = await userDataServiceProvider.findUserById(decodedToken.id);
                if (user) {
                    const tokenSecret = configData.jwt.token_secret + user.password
                    await jwt.verify(accessToken, tokenSecret);
                    c.set("user", user);
                    await next();
                } else {
                    throw new ForbiddenException('Access Denied - User not found');
                }
            } else {
                throw new ForbiddenException('Forbidden - Token is required');
            }

        } catch (error: any) {
            throw error;
        }
    }

}
