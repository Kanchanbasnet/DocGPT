import express from 'express';
import { fileUpload } from './services/uploadFile.ts';


const router = express.Router();



router.post('/uploads', fileUpload)


export default router;