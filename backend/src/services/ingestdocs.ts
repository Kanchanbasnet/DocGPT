import { OpenAIEmbeddings } from "@langchain/openai";
import fs from 'fs';
import path from "path";
import { chunkDocs } from "./chunkDocs";
import { client } from "../config/weviate.connection";
import { WeaviateStore } from '@langchain/weaviate';



export const ingestDocs = async (userId: string, files: Express.Multer.File[]) => {
    try {
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY as string,
            model: "text-embedding-3-small"
        });

        // Create user specific directory if not exists
        const userChunkDir = `chunkUploads/${userId}`;
        if (!fs.existsSync(userChunkDir)) {
            fs.mkdirSync(userChunkDir, { recursive: true });
            console.log(`Directory created: ${userChunkDir}`);
        }
        // Move files to user specific directory
        for (const file of files) {
            const sourcePath = file.path;
            const destPath = path.join(userChunkDir, file.originalname);
            fs.copyFileSync(sourcePath, destPath);
            console.log(`File copied from ${sourcePath} to ${destPath}`);
        }
        const docs = await chunkDocs(userChunkDir)
        if (docs.length === 0) {
            throw new Error("No documents found after chunking.");
        }
        const metadata = docs.map((doc: any, index: number) => (
            {
                ...doc,
                metadata: {
                    ...doc.metadata,
                    userId: userId,
                    chunkIndex: index,
                    uploadTime: new Date().toISOString(),
                    originalFileName: files.map(f => f.originalname)
                }
            }
        ))
        const indexName = `UserDocs_${userId.replace(/[^a-zA-Z0-9]/g, '_')}`;
        console.log(`Using vector index: ${indexName}`);

        await WeaviateStore.fromDocuments(
            metadata,
            embeddings,
            {
                client,
                indexName: indexName,
                textKey: 'text',
                metadataKeys: ['source', 'userId', 'uploadTime', 'chunkIndex', 'originalFiles']
            }
        );

        console.log("Data Successfully ingested to Weaviate");
        console.log('🧹 Cleaning up temporary files...');
        fs.rmSync(userChunkDir, { recursive: true, force: true });
        files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
        console.log('🎉 Ingestion completed successfully!');


    }
    catch (error) {
        console.error("Error during document ingestion:", error);
        throw error;

    }
}