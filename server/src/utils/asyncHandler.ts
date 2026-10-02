import { Request, Response,NextFunction, RequestHandler } from "express";

type AsyncRequestHandler=(
    req:Request,
    res:Response,
    next:NextFunction
)=>Promise<unknown>;

/**
 * Wraps an async route handler and forwards any thrown error to Express's
 * error middleware. Eliminates try/catch boilerplate in controllers.
 */
export const asyncHandler=(fn:AsyncRequestHandler): RequestHandler =>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch(next);
    };
};