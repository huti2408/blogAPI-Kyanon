import { createClient } from "redis";

export default async function (key:string, value:string){
    const client = createClient({
        url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.URL_REDIS}`
    });
    client.on('error',(err)=>console.log("Redis Client Error",err))

    await client.connect();
    await client.set(key, value);
    return await client.get(key)
}