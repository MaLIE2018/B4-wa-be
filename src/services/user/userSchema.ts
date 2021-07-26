import mongoose, { Model, SchemaType } from "mongoose";
import { User } from "../../types/interfaces";
import bcrypt from "bcrypt";

const { model, Schema } = mongoose;

interface UserModel extends Model<User> {
  checkCredentials(email: string, password: string): {} | null;
}

const UserSchema = new Schema<User, UserModel>(
  {
    profile: {
      username: { type: String },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      socketId: { type: String, default: "" },
      lastSeen: { type: Date },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      avatar: { type: String, default: "https://source.unsplash.com/random" },
      online: { type: Boolean, default: false },
    },
    password: { type: String },

    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    refreshToken: { type: String },
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: true, strict: false }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.refreshToken;
  delete userObj.password;
  delete userObj.__v;

  return userObj;
};

UserSchema.pre("save", async function () {
  const newUser = this;
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(newUser.password!, 10);
  }
});

UserSchema.static(
  "checkCredentials",
  async function checkCredentials(email, password) {
    const user = await this.findOne({ "profile.email": email })
      .populate({
        path: "chats",
        select: { participants: 1, latestMessage: 1, name: 1 },
        populate: {
          path: "participants",
          select: "profile",
        },
      })
      .populate("friends", {
        profile: 1,
      });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password!);

      if (isMatch) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
);

export default model("User", UserSchema);
