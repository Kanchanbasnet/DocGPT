import express from 'express';
import { createIngest, getAllIngest, getIngestById, getIngestStatus } from '../controllers/ingest.controller';



const router = express.Router();



router.get('/', getAllIngest);
router.get('/:id', getIngestById);
router.post('/create',createIngest);
router.get('/status', getIngestStatus);


export default router;