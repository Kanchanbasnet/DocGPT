
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import {
    RecursiveCharacterTextSplitter,
} from 'langchain/text_splitter'

export const chunkDocs = async (directoryPath: string = 'chunkUploads') => {
    let docs: any = [];
    try {
        console.log("directoryPath:::", directoryPath);
        const directoryLoader = new DirectoryLoader(directoryPath, {
            '.pdf': (filePath) => new PDFLoader(filePath),
            '.docx': (filePath) => new DocxLoader(filePath),
            '.pptx': (filePath) => new PPTXLoader(filePath),
            '.txt': (filePath) => new TextLoader(filePath)
        })
        const rawDocs = await directoryLoader.load();
        console.log("RawDocs:::", rawDocs)
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        })
        docs = docs.concat(await textSplitter.splitDocuments(rawDocs));
        return docs;

    }
    catch (error) {
        console.log("An error has been occured:::", error);


    }
}