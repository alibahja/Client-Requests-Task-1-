import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError";
import { User,IUserDocument } from "../models/User.model";
import { signToken } from "../utils/jwt";
import { RegisterInput,LoginInput } from "../validators/auth.validator";
import { email } from "zod";
import { register } from "node:module";

interface AuthResult {
    user: {
        _id:Types.ObjectId;
        name:string;
        email:string;
    };
    token:string;
}

function sanitizeUser(user: IUserDocument): AuthResult["user"] {
    return {
        _id:user._id,
        name:user.name,
        email:user.email,
    };
}

export const authService= {
    async register(input: RegisterInput): Promise<AuthResult> {
        const existing= await User.findOne({email:input.email});

        if(existing){
            throw new ApiError(409,"Email already in use");
        }

        const user=await User.create({
            name:input.name,
            email:input.email,
            password:input.password,
        });

        const token=signToken({_id:user._id.toString(), email:user.email});

        return {user:sanitizeUser(user) ,token};
    },
    async login(input: LoginInput): Promise<AuthResult> {
    // password has select:false in the model, so we must opt in
    const user = await User.findOne({ email: input.email }).select("+password");

    // Same error for both cases so we don't leak which emails exist
    if (!user) throw new ApiError(401, "Invalid email or password");

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    const token = signToken({ _id: user._id.toString(), email: user.email });

    return { user: sanitizeUser(user), token };
  },

    async getById(id: string): Promise<AuthResult["user"]> {
    const user = await User.findById(id).select("_id name email");
    if (!user) throw new ApiError(404, "User not found");
    return sanitizeUser(user);
  },
};