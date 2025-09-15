import express from 'express';
import { createIngest, deleteIngestById, getAllIngest, getIngestById, getIngestStatus } from '../controllers/ingest.controller';



const router = express.Router();



router.get('/allingest/:userId', getAllIngest);
router.get('/:id', getIngestById);
router.post('/create',createIngest);
router.get('/status', getIngestStatus);
router.delete('/:id', deleteIngestById);


export default router;