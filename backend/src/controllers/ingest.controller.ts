import { Request, Response } from "express";
import User from "../models/users/user.model";
import DataIngest from "../models/ingest/ingest.model";
import connection from "../config/redis.connection";


async function generateIdentifier(identifer: string) {
    const timestamp = Date.now();
    const uniqueIdentifier = `${identifer}_${timestamp}`;
    return uniqueIdentifier;

}
const client = connection;


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

export const createIngest = async (req: Request, res: Response) => {
    try {
        const { userId, name, dataSourceIds } = req.body;
        if (!userId || !name) {
            return res.status(400).json({ error: "UserId or Name is missing." })
        }
        if (!dataSourceIds && dataSourceIds.length === 0) {
            return res.status(400).json({ error: "Please provide at least one datasource." })
        }
        const uniqueIdentifier = await generateIdentifier(name);
        const ingest = await DataIngest.create({
            userId: userId,
            name: name,
            identifier: uniqueIdentifier,
            dataSourceIds: dataSourceIds,
            status: 'processing'
         })
        //  await client.set(`ingest:${ingest.id}`, 'processing');
        return res.status(200).json({ message: "Ingest created Successfully." })
         } catch (error) {
        console.error("Error in creating new ingest::::", error);
        return res.status(500).json({ message: "Internal Server Error" })

    }

}

export const getIngestStatus = async (req: Request, res: Response)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({error: "Please provide ingestId."})
        }
        const ingest = await DataIngest.findById(id).select('status');
        if(!ingest){
            return res.status(404).json({error: "Ingest Not found."})
        }
        return res.status(200).json({message: 'Status retrieved successfully.'})

    }
    catch(error: any){
        console.error("Error in retrieving ingest status::", error)
        return res.status(500).json({
            error: "An error occurred while retrieving ingests status.",
            details: error.message || error,
        });

        
    }

}