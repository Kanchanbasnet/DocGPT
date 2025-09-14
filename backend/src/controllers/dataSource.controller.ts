import { Request, Response } from "express";
import DataSource from "../models/dataSource/dataSource.model";



export const uploadDataSource = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        if (files && files.length > 5) {
            return res.status(400).json({ message: "Maximum 5 files are allowed" });
        }
        for (const file of files) {
            const metaData = {
                size: file.size,
                mimetype: file.mimetype,
                filePath: file.path,
                fileName: file.originalname,
                uploadedAt: new Date()
            }
            await DataSource.create({
                userId,
                fileName: file.originalname,
                fileType: file.mimetype,
                filePath: file.path,
                fileMetaData: metaData,
            })
        }
        return res.status(200).json({ message: "Files Uploaded Successfully" });


    } catch (error) {
        console.error("Error in uploading files::::", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }



}

export const getAllDataSources = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "UserId is required." });
        }
        const page = Math.max(1, parseInt(String(req.query.page || "1")));
        const limit = Math.min(20, parseInt(String(req.query.limit || "10")));
        const skip = (page - 1) * limit;
        const total = await DataSource.countDocuments({ userId });
        const [dataSources] = await Promise.all([
            DataSource.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ])
        return res.json({ data: dataSources, total: total, page: page, limit: limit });

    } catch (error) {
        console.error("Error in fetching data sources::::", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }

}

export const getDataSourceById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: "DataSourceId is required." });
        }
        const dataSource = await DataSource.findById(id).lean();
        if (!dataSource) {
            return res.status(404).json({ message: "DataSource not found." });
        }
        return res.status(200).json({ data: dataSource });

    } catch (error) {
        console.error("Error in fetching data source::::", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

export const deleteDataSourceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "DataSourceId is required." });
        }
        await DataSource.findByIdAndDelete(id);
        return res.status(200).json({ message: "DataSource deleted successfully." });

    } catch (error) {
        console.error("Error in deleting data source::::", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }

}