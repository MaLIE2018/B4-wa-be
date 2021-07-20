import passport from "passport";
import UserModel from "../../services/user/userSchema";
import { JWTAuthenticate } from "./tools";

let GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.FE_URL + "/users/googleRedirect",
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: any,
      passportNext: any
    ) => {
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
      } catch (error) {
        passportNext(error);
      }
    }
  )
);

passport.serializeUser(function (user, passportNext) {
  // this is for req.user
  passportNext(null, user);
});

export default {};
