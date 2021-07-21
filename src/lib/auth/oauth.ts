import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

import UserModel from "../../services/user/userSchema";
import { JWTAuthenticate } from "./tools";

import { Strategy } from "passport-google-oauth20";

let GoogleStrat;
if (
  process.env.GOOGLE_ID !== undefined &&
  process.env.GOOGLE_SECRET !== undefined
) {
  GoogleStrat = new Strategy(
    {
      clientID: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      callbackURL: "/users/googleRedirect",
    },
    async (accessToken, refreshToken, profile: any, passportNext) => {
      try {
        console.log("profile:", profile);
        const user = await UserModel.findOne({ googleId: profile.id });

        if (user) {
          const tokens = await JWTAuthenticate(user);
          passportNext(null, { user, tokens });
        } else {
          const newUser = {
            profile: {
              firstName: profile.name.givenName,
              lastName: profile.name.lastName,
              email: profile.emails[0].value,
              googleId: profile.id,
            },
          };
          const createdUser = new UserModel(newUser);
          const savedUser = await createdUser.save();
          const tokens = await JWTAuthenticate(savedUser);
          passportNext(null, { user: savedUser, tokens });
        }
      } catch (error:any) {
        passportNext(error);
      }
    }
  );
  passport.use("google", GoogleStrat);
}

passport.serializeUser(function (user, passportNext) {
  // this is for req.user
  passportNext(null, user);
});

export default {};
