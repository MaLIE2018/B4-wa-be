import mongoose, { Model } from 'mongoose'
import { User } from '../../types/interfaces';

const { model, Schema } = mongoose

interface UserModel extends Model<User> {
	checkCredentials(email:string, password:string): {} | null
}

const UserSchema = new Schema<User, UserModel>({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String},
	avatar: {type: String, default: "https://source.unsplash.com/random"},
	username: {type: String},
	status: { type: String, default: "offline", enum: ["online", "offline"] },
	lastSeen:{type:Date},
	friends: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
	refreshToken: { type: String },
	socketId:{type:String},
}, { timestamps: true });

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObj = user.toObject()
	delete userObj.refreshToken;

	return userObj
}

UserSchema.static(
	"checkCredentials",
	async function checkCredentials(email, password) {
		
	}
)

export default model("User", UserSchema);