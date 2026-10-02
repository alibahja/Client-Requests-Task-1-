import {Request, Response} from 'express';
import {requestService} from '../services/request.service';
import {ApiError} from '../utils/ApiError';
import {asyncHandler} from '../utils/asyncHandler';
import {sendResponse} from '../utils/ApiResponse';


export const createRequest=asyncHandler(async(req:Request,res:Response)=>{
    if(!req.user){throw new ApiError(401,"Unauthorized");}
    const result=await requestService.create(req.user._id,req.body);
    return sendResponse(res, 201, result, "Request created successfully");
})

export const listRequests=asyncHandler(async(req:Request,res:Response)=>{
    if(!req.user){throw new ApiError(401,"Unauthorized");}
    const result=await requestService.list(req.user._id);
    return sendResponse(res, 200, result, "Requests fecthed successfully");
})

export const updateRequestStatus=asyncHandler(async(req:Request,res:Response)=>{
    if(!req.user){throw new ApiError(401,"Unauthorized");}
    const {id}=req.params;
    const updated=await requestService.updateStatus(id as string, req.user._id,req.body);
    return sendResponse(res, 200, updated, "Request status updated successfully");
})

