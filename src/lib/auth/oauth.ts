import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

import UserModel from "../../services/user/userSchema";
import { JWTAuthenticate } from "./tools";

passport.use("google", new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: "http://localhost:3001/users/googleRedirect",
		},
		async (
			accessToken: any,
			refreshToken: any,
			profile: any,
			passportNext: any
		) => {
			try {
				console.log("profile:", profile);
				const user = await UserModel.findOne({googleId: profile.id});

				if (user) {
					const tokens = await JWTAuthenticate(user);
					passportNext(null, {user, tokens});
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
					passportNext(null, {user: savedUser, tokens});
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
