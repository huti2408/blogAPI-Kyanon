import { createClient } from "redis";


const client = createClient({
    url: `redis://:@127.0.0.1:6379`
});
export default async function ConnectRedis(){
    client.on('error', (err) => console.log('Redis Client Error', err)); 
    await client.connect();
}
    
export async function SetValue(key:string, value:any){
    const arrObj = await client.lRange(key,0,-1)
    arrObj.map(async obj=>{
        await client.lRem(key,0,obj)
        const newObj =  JSON.parse(obj)
        newObj.is_valid = false
        if(!newObj.updatedAt){
            newObj.updatedAt = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
        }
        await client.rPush(key, JSON.stringify(newObj));
    })
    
    await client.rPush(key, JSON.stringify(value));
    
}

export async function GetValue(key:any){
    const arrObj = await client.lRange(key,0,-1)
    return arrObj.map(obj=>obj = JSON.parse(obj))
}