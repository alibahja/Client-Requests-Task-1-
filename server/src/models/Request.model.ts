import mongoose, {Schema,Document,Model,Types} from "mongoose";

export const REQUEST_STATUSES=["New","In Progress","Done"] as const;
export type RequestStatus=(typeof REQUEST_STATUSES)[number];

export interface IClientRequest {
    clientName:string,
    clientEmail:string,
    title:string,
    description?:string,
    status:RequestStatus,
    createdBy:Types.ObjectId;
    createdAt:Date,
    updatedAt:Date;
}

export interface IClientRequestDocument extends IClientRequest,Document {}

const RequestSchema=new Schema<IClientRequestDocument>(
   {
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: "New",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

export const ClientRequest: Model<IClientRequestDocument>=
mongoose.model<IClientRequestDocument>("ClientRequest",RequestSchema);