//Auth

export interface User{
    _id:string;
    name:string;
    email:string;
}

export interface AuthResponse{
    user:User;
    token:string;
}

export interface LoginPayload{
    email:string;
    password:string;
}

export interface RegisterPayload{
    name:string;
    email:string;
    password:string;
}

//Requests
export const REQUEST_STATUSES=["New","In Progress","Done"] as const;
export type RequestStatus=(typeof REQUEST_STATUSES)[number];

export interface ClientRequest{
    _id:string;
    clientName:string;
    clientEmail:string;
    title:string;
    description?:string;
    status:RequestStatus;
    createdBy:string;
    createdAt:string;
    updatedAt:string;
}

export interface CreateRequestPayload{
    clientName:string;
    clientEmail:string;
    title:string;
    description?:string;
    status?:RequestStatus;
}

//API (matches the backend which is (success,message,data))
export interface ApiEnvelope<T>{
    success:boolean;
    message:string;
    data:T;
}

export interface ApiErrorBody{
   success:false;
   message:string;
   errors?: {path:string, message:string}[];
}