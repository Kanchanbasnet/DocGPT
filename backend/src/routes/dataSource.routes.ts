import express from "express";

    import { upload } from "../services/uploadFile";
import { deleteDataSourceById, getAllDataSources, uploadDataSource } from "../controllers/dataSource.controller";


const router = express.Router();

router.post('/upload', upload, uploadDataSource);
router.get('/:userId', getAllDataSources);
router.delete('/:id', deleteDataSourceById);


export default router;
