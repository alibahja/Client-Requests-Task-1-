import {Request, Response} from 'express';
import {authService} from '../services/auth.service';
import {ApiError} from '../utils/ApiError';
import {asyncHandler} from '../utils/asyncHandler';
import {sendResponse} from '../utils/ApiResponse';


export const register=asyncHandler(async(req:Request,res:Response)=>{
    const result=await authService.register(req.body);
    return sendResponse(res, 201, result,"User registered successfully");
})

export const login=asyncHandler(async(req:Request, res:Response)=>{
    const result=await authService.login(req.body);
    return sendResponse(res, 200, result, "User logged in successfully");
})

export const me=asyncHandler(async(req:Request,res:Response)=>{
    if(!req.user){ throw new ApiError(401,"Unauthorized");}
    const user= await authService.getById(req.user._id.toString());
    return sendResponse(res, 200, user, "Current User fetched successfully");
})