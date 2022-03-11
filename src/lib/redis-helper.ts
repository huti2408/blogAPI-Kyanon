import { createClient } from "redis";


const client = createClient({
    url: `redis://:@127.0.0.1:6379`
});
export default client;
export async function ConnectRedis(){
    client.on('error', (err) => console.log('Redis Client Error', err)); 
    await client.connect();
}
    
export async function SetValue(key:any, value:any){

    await client.setEx(key,60 * 60 * 4,value)
}

export async function GetValue(key:any){
    return await client.get(key)
}
export async function DeleteValue(key:any){
    return await client.del(key)
}

