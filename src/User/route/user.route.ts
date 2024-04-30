import express from 'express';
import { getCurrentUser, getUserController, UpdateUser, UpdateUserRole } from '../controller/user.controller';
import { Authorize } from '../../Middlewares/authorize';
import { deserializeUser } from '../../Middlewares/deserializeUser';
import { requireUser } from '../../Middlewares/requireUser';
import {RoleEnumType as Role} from '../../Entities/user.entity'
import { upload } from '../../Utils/cloudinary';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get currently logged in user
router.get('/current', getCurrentUser);

// Get user
router.get('/', getUserController);


// Get user
router.patch('/update', upload.single("image"), UpdateUser);

// Update user role
router.patch('/role', Authorize([Role.ADMIN]) ,UpdateUserRole);

export default router;
