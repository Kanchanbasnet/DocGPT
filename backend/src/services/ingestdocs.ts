import { OpenAIEmbeddings } from "@langchain/openai";
import fs from 'fs';
import path from "path";
import { chunkDocs } from "./chunkDocs";
import { client } from "../config/weviate.connection";
import { WeaviateStore } from '@langchain/weaviate';
import DataIngest from "../models/ingest/ingest.model";


export const ingestDocs = async (userId: string, dataSources: any, ingestId: string) => {
    try {
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY as string,
            model: 'text-embedding-3-small'
        })
        const fileInfo = [];

        const tempProcessingDir = `ingestUploads/${userId}/${ingestId}`;
        if (!fs.existsSync(tempProcessingDir)) {
            fs.mkdirSync(tempProcessingDir, { recursive: true });
            console.log(`Directory created :${tempProcessingDir}`);
        }
        for (const datasource of dataSources) {
            const sourcePath = datasource?.filePath;
            const destPath = path.join(tempProcessingDir, datasource.fileName)
            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, destPath);
                fileInfo.push({
                    fileName: datasource.fileName,
                    filePath: datasource.filePath

                })
                console.log(`File copied from ${sourcePath} to ${destPath}`);

            }
            else {
                console.log(`Files not found.`);
            }

        }
        if (fileInfo.length === 0) {
            throw new Error('No valid files found to ingest.')
        }
        const docs = await chunkDocs(tempProcessingDir);
        const metadata = docs.map((doc: any, index: number) => (
            {
                ...doc,
                metadata: {
                    ...doc.metadata,
                    userId: userId,
                    chunkIndex: index
                }

            }
        ))
        const indexName = `UserDocs_${userId.replace(/[^a-zA-Z0-9]/g, '_')}`;
        console.log(`Using vector index: ${indexName}`);

        //store in weaviate
        await WeaviateStore.fromDocuments(
            metadata,
            embeddings,
            {
                client,
                indexName: indexName,
                textKey: 'text',
                metadataKeys: ['userId', 'chunkIndex']
            }
        );
        console.log("Data successfully ingested to Weaviate.");
        console.log("Removing temporary files...");
        if (fs.existsSync(tempProcessingDir)) {
            fs.rmSync(tempProcessingDir, { recursive: true, force: true });
        }
        console.log('🎉 Ingestion completed successfully!');
        return {
            success: true,
            documentsProcessed: docs.length
        }



    }
    catch (error: any) {
        console.log("An error has been occured during ingestion");
        const tempProcessingDir = `ingestUploads/${userId}/${ingestId}`
        if (fs.existsSync(tempProcessingDir)) {
            fs.rmSync(tempProcessingDir, { recursive: true, force: true });
        }

    }
}

export const processIngestion = async (ingestId: string, dataSources: any, userId: string) =>{
    try {
        console.log(`Starting Ingestion process for ingest ${ingestId}`);
        await DataIngest.findByIdAndUpdate(ingestId, {
            status: 'processing'
        })
        await ingestDocs(userId, dataSources, ingestId);
        await DataIngest.findByIdAndUpdate(ingestId, {
            status: "completed"
        })
        console.log(`Ingestion completed for ingest: ${ingestId}`);

    } catch (error) {
        console.error(`Ingestion failed for ingest: ${ingestId}`, error);

        await DataIngest.findByIdAndUpdate(ingestId, {
            status: 'failed',
        });

    }
}