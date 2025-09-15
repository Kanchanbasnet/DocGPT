import IORedis from 'ioredis';


const connection = new IORedis({
  host: process.env.REDIS_HOST as string,
  port: Number(process.env.REDIS_PORT) || 6379,
  ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
})

export default connection
