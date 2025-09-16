import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { WeaviateStore } from "@langchain/weaviate";
import { client } from "../config/weviate.connection";


export interface ChatHistory {
    query: string
    response: string
}


const llm = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY as string
})

export const chatService = async (question: string, history: Array<ChatHistory>, databaseName: string) => {


    try {
        const sanitizedQuestion = question.trim().replaceAll('\n', ' ')

        const formattedDatabaseName = databaseName.charAt(0).toUpperCase() + databaseName.slice(1);
        const weaviateStore = await WeaviateStore.fromExistingIndex(
            new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY as string
            }),
            {
                client: client,
                indexName: databaseName,
                metadataKeys: ['userId', 
                    'chunkIndex', 
                    'title',
                    'source',
                    'pdf_numpages',
                    'pageNumber',
                    'loc_lines_from',
                    'loc_lines_to']
            }
        )
        const vectorStore = weaviateStore.asRetriever(5);
        

    }
    catch (error) {

    }
}