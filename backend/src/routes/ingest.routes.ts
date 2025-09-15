import express from 'express';
import { createIngest, getAllIngest, getIngestById } from '../controllers/ingest.controller';



const router = express.Router();



router.get('/', getAllIngest);
router.get('/:id', getIngestById);
router.post('/create',createIngest);


export default router;