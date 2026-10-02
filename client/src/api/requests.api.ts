import {api, unwrap} from "./axios";
import type {CreateRequestPayload, ClientRequest,RequestStatus} from "../types";

export const requestsApi={
    list: ():Promise<ClientRequest[]>=>
        unwrap(api.get("/requests")),

    create: (payload:CreateRequestPayload): Promise<ClientRequest>=>
        unwrap(api.post("/requests",payload)),

    updateStatus: (id:string, status:RequestStatus): Promise<ClientRequest>=>
        unwrap(api.patch(`/requests/${id}/status`, { status })),
};