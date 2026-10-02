import {Router} from 'express';
import {register, login, me} from '../controllers/auth.controller';
import {validate} from '../middleware/validate.middleware';
import {protect} from '../middleware/auth.middleware';
import {registerSchema, loginSchema} from '../validators/auth.validator';

const router=Router();

router.post("/register", validate(registerSchema,"body"), register);
router.post("/login", validate(loginSchema,"body"), login);
router.get("/me",protect,me);

export default router;