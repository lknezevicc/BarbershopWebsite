import express from 'express';
import * as ServiceController from '../controllers/service.controller';
import { protect, admin } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { serviceValidationSchema } from '../models/service';

const router = express.Router();

router.get('/', ServiceController.getServices);
router.post('/', validateRequest(serviceValidationSchema), protect, admin, ServiceController.addService);
router.put('/:id', validateRequest(serviceValidationSchema), protect, admin, ServiceController.editService);
router.delete('/:id', protect, admin, ServiceController.deleteService);

export default router;