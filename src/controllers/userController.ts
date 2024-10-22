import * as bcrypt from 'bcrypt';
import { Context } from 'hono';
import { EMAIL_EXISTED, INVALID_CREDENTIALS, USER_DELETED, USER_FETCHED, USER_LOGIN, USER_NOT_FOUND, USER_REGISTERED, USER_UPDATED } from '../constants/appMessages';
import { NotFoundException } from '../exceptions/notFounException';
import { ResourceAlreadyExistsException } from '../exceptions/resourseAlreadyExistsException';
import { UnauthorisedException } from '../exceptions/unauthorisedException';
import { getUserAuthTokens } from '../helpers/appHelper';
import { ResponseHelper } from '../helpers/responseHelper';
import { UserDataServiceProvider } from '../services/database/userDataServiceProvider';
import validate from '../helpers/validationHelper';
import { SignInSchema } from '../validations/user/signIn';

const userDataServiceProvider = new UserDataServiceProvider();
export class UserController {

    public async signUp(c: Context) {
        try {
            const reqData = await c.req.json();
            const existedUser = await userDataServiceProvider.findUserByEmail(reqData.email);
            if (existedUser) {
                throw new ResourceAlreadyExistsException("email", EMAIL_EXISTED);
            }

            const userData = await userDataServiceProvider.create(reqData);

            const { password, ...userDataWithoutPassword } = userData;

            return ResponseHelper.sendSuccessResponse(c, 200, USER_REGISTERED, userDataWithoutPassword);

        }
        catch (error: any) {
            throw error;
        }

    }


    public async signIn(c: Context) {
        try {
            const reqData = await c.req.json();

            const validatedData = await validate(SignInSchema, reqData);

            const userData = await userDataServiceProvider.findUserByEmail(validatedData.email);
            if (!userData) {
                throw new UnauthorisedException(INVALID_CREDENTIALS);
            }

            const matchPassword = await bcrypt.compare(
                validatedData.password,
                userData.password,
            );

            if (!matchPassword) {
                throw new UnauthorisedException(INVALID_CREDENTIALS);
            }

            const { token, refreshToken } = await getUserAuthTokens(userData);
            
            const { password, ...userDataWithoutPassword } = userData;

            let response = {
                user_details: userDataWithoutPassword,
                access_token: token,
                refresh_token: refreshToken
            };

            return ResponseHelper.sendSuccessResponse(c, 200, USER_LOGIN, response);

        }
        catch (error: any) {
            throw error;
        }

    }

    public async getOne(c: Context) {
        try {
            const userId = +c.req.param('id');
            const userData = await userDataServiceProvider.findUserById(userId);
            if (!userData) {
                throw new NotFoundException(USER_NOT_FOUND);
            }
            const { password, ...userDataWithoutPassword } = userData;

            return ResponseHelper.sendSuccessResponse(c, 200, USER_FETCHED, userDataWithoutPassword);
        }
        catch (error) {
            throw error;
        }
    }

    public async update(c: Context) {
        try {
            const userId = +c.req.param('id');
            const reqData = await c.req.json();

            const userData = await userDataServiceProvider.findUserById(userId);
            if (!userData) {
                throw new NotFoundException(USER_NOT_FOUND);
            }

            const emailExist = await userDataServiceProvider.findUserByEmail(reqData.email);
            if (emailExist && emailExist.id != userId) {
                throw new ResourceAlreadyExistsException("email", EMAIL_EXISTED);
            }

            await userDataServiceProvider.updateUserById(reqData, userId);

            return ResponseHelper.sendSuccessResponse(c, 200, USER_UPDATED);

        }
        catch (error: any) {
            throw error;
        }
    }


    async delete(c: Context) {
        try {
            const userId = +c.req.param('id');
            const userData = await userDataServiceProvider.findUserById(userId);
            if (!userData) {
                throw new NotFoundException(USER_NOT_FOUND);
            }

            await userDataServiceProvider.deleteUserById(userId);

            return ResponseHelper.sendSuccessResponse(c, 200, USER_DELETED);
        }
        catch (error) {
            throw error;
        }
    }

    public async getProfile(c: Context) {
        try {
            const user = c.get("user");
            const userData: any = await userDataServiceProvider.findUserById(user.id);
            if (!userData) {
                throw new NotFoundException(USER_NOT_FOUND);
            }
            delete userData.password;

            return ResponseHelper.sendSuccessResponse(c, 200, USER_FETCHED, userData);
        }
        catch (error) {
            throw error;
        }
    }

}