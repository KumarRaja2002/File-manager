
import jwt from "jsonwebtoken";
import configData from "../../config/appConfig";

export const getUserAuthTokens = function (userData:any) {
    let user = {
      id: userData.id,
      email: userData.email,
      user_type: userData.user_type,
      full_name: userData.full_name,
    };
  
    let tokenSecret = configData.jwt.token_secret + userData.password;
    let refreshTokenSecret = configData.jwt.refresh_token_secret + userData.password;
  
    const token = jwt.sign(user, tokenSecret, {
      expiresIn: configData.jwt.token_life,
    });
  
    const refreshToken = jwt.sign(user, refreshTokenSecret, {
      expiresIn: configData.jwt.refresh_token_life,
    });
    return {
      token,
      refreshToken,
    };
  };