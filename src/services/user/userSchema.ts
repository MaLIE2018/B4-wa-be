import mongoose, { Model } from "mongoose";
import { User } from "../../types/interfaces";

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
      email: { type: String, required: true },
      avatar: { type: String, default: "https://source.unsplash.com/random" },
    },
    password: { type: String },
    status: { type: String, default: "offline", enum: ["online", "offline"] },
    lastSeen: { type: Date },
    friends: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    refreshToken: { type: String },
    chats: [
      {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
        hidden: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.refreshToken;

  return userObj;
};

UserSchema.static(
  "checkCredentials",
  async function checkCredentials(email, password) {}
);

export default model("User", UserSchema);
