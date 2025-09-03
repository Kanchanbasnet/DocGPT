import weaviate, { WeaviateClient } from 'weaviate-client';


export const client: WeaviateClient =   await weaviate.connectToLocal({
    authCredentials: new weaviate.ApiKey(
      process.env.WEAVIATE_API_KEY || 'jane-secret-key'
    ),
    host: process.env.WEAVIATE_HOST || '127.0.0.1',
    port: Number(process.env.WEAVIATE_PORT) || 8080,
    grpcPort: Number(process.env.WEAVIATE_GRPC_PORT) || 50051,
    skipInitChecks: true,
})


const isLive = await client.isLive()
const version = await client.getWeaviateVersion()
console.info('Live:', isLive)
console.info('Version:', version)

export const weaviateClient = client;