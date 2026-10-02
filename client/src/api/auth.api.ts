import {api, unwrap} from "./axios";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "../types";


export const authApi={
    register: (payload:RegisterPayload): Promise<AuthResponse>=>
        unwrap(api.post("/auth/register",payload)),

    login: (payload:LoginPayload): Promise<AuthResponse>=>
        unwrap(api.post("/auth/login",payload)),

    me: ():Promise<User>=>
        unwrap(api.get("/auth/me")),
};