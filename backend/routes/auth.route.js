import express from 'express';
import { Signup, Login, verifyEmail, Logout } from '../controllers/auth.controller.js';

const router = express.Router();


router.post('/signup', Signup);
router.post('/login', Login);
router.post("/verify-email", verifyEmail);
router.post("/logout", Logout);














export default router;