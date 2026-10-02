import { Types } from "mongoose";

import { ClientRequest, IClientRequestDocument,RequestStatus } from "../models/Request.model";
import { ApiError } from "../utils/ApiError";
import { CreateRequestInput, UpdateStatusInput } from "../validators/request.validator";



export const requestService={
    async create( userId: Types.ObjectId, input: CreateRequestInput): Promise<IClientRequestDocument>{
        const request=await ClientRequest.create({
            clientName:input.clientName,
            clientEmail:input.clientEmail,
            title:input.title,
            description:input.description,
            status:input.status ?? "New",
            createdBy:userId,
        });
        return request;
    },

    async list(userId: Types.ObjectId): Promise<IClientRequestDocument[]>{
         return ClientRequest.find({createdBy:userId})
         .sort({createdAt:-1})
         .lean<IClientRequestDocument[]>()
         .exec();
    },

    async updateStatus(id:string,userId: Types.ObjectId, input: UpdateStatusInput):Promise<IClientRequestDocument>{
        const request=await ClientRequest.findOne({
            _id:id,
            createdBy:userId,
        });

        if(!request){ 
            throw new ApiError(404, "Request not found");
        }

        request.status=input.status;
        await request.save();
        return request;
    }, 
};