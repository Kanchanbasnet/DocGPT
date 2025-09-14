import { Request, Response } from "express";
import User from "../models/users/user.model";
import DataIngest from "../models/ingest/ingest.model";


export const getAllIngest = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "Please provide the userId" });
        }

        const userExist = await User.findById(userId);
        if (!userExist) {
            return res.status(404).json({ error: "User not found." });
        }

        const ingest = await DataIngest.find({ userId });

        return res.status(200).json({
            message: "Ingest retrieved successfully.",
            data: ingest,
        });
    } catch (error: any) {
        console.error("Could not get all ingest", error);
        return res.status(500).json({
            error: "An error occurred while retrieving ingests.",
            details: error.message || error,
        });
    }
};

export const getIngestById = async (req: Request, res: Response) => {
    try {
        const { ingestId } = req.params;
        if (!ingestId) {
            return res.status(400).json({ error: "Please provide the ingestId" })
        }
        const ingestExist = await DataIngest.findById(ingestId);
        if (!ingestExist) {
            return res.status(404).json({ error: "DataIngest not Found." });
        }
        return res.status(200).json({
            message: "Ingest retrieved successfully.",
            data: ingestExist
        })

    } catch (error: any) {
        console.error("Could not get all ingest", error);
        return res.status(500).json({
            error: "An error occurred while retrieving ingests.",
            details: error.message || error,
        });

    }
}

export const createIngest = (req: Request, res: Response) => {
    try {

    } catch (error) {

    }

}