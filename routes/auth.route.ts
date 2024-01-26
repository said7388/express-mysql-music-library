import express from 'express';
import { userLogin, userSignUp } from '../controllers/auth.controller';
import { validateInput } from '../middleware/auth';

const router = express.Router();

router.post('/sign-up', validateInput, userSignUp);
router.post('/login', userLogin);


export default router;