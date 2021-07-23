import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import UserModel from "../../services/user/userSchema";
import { JWTAuthenticate } from "./tools";

passport.use(
  "google",
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      callbackURL: process.env.BE_URL! + "/users/googleRedirect",
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: any,
      passportNext: any
    ) => {
      try {
        console.log("profile:", profile);
        const user = await UserModel.findOne({
          "profile.email": profile.emails[0].value,
        });
        if (user) {
          const tokens = await JWTAuthenticate(user);
          passportNext(null, { user, tokens });
        } else {
          const newUser = {
            profile: {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              googleId: profile.id,
            },
          };
          const createdUser = new UserModel(newUser);
          const savedUser = await createdUser.save();
          const tokens = await JWTAuthenticate(savedUser);
          passportNext(null, { user: savedUser, tokens });
        }
      } catch (error: any) {
        passportNext(error);
      }
    }
  )
);

passport.serializeUser(function (user: any, passportNext: any) {
  // this is for req.user
  passportNext(null, user);
});

export default passport;
