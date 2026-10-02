import {Router} from "express";
import {createRequest, listRequests, updateRequestStatus} from "../controllers/request.controller";
import {protect} from "../middleware/auth.middleware";
import {validate} from "../middleware/validate.middleware";
import {createRequestSchema, updateStatusSchema,requestIdParamSchema} from "../validators/request.validator";

const router=Router();

router.use(protect);

router.post("/",validate(createRequestSchema,"body"), createRequest);
router.get("/",listRequests);
router.patch("/:id/status",validate(requestIdParamSchema,"params"),validate(updateStatusSchema,"body"),updateRequestStatus);

export default router;