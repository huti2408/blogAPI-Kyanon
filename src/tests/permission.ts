import request from "supertest"
import {Express} from "express"
import ROUTES from "../constants/Routes"
import { StatusCodes } from "http-status-codes"

export default (app:Express) =>{
    describe("Permission",()=>{
        let token = ""
        test("Sign In",async ()=>{
            const response = await request(app).post(ROUTES.Login).send({
                email: "tin.mai1@gmail.com",
                password:"huutin123"
            })
            token = 'Bearer ' + response.body.token
            expect(response.statusCode).toBe(StatusCodes.OK)
        })
        test("Get All permissions", async () => {
            const response = await request(app).get(ROUTES.Permission).set('Authorization',token)
            expect(response.statusCode).toBe(StatusCodes.OK)
            expect(response.body).toBeInstanceOf(Array)
        })
        test("Assign permission", async () => {
            const response = await request(app).post(ROUTES.Permission).send({
                userId: 4,
                permissionId: 9,
            }).set('Authorization',token)
            expect(response.statusCode).toBe(StatusCodes.CREATED)

        })
        test("Remove permissions", async () => {

            const response = await request(app).delete(ROUTES.Permission).send({
                userId: 4,
                permissionId: 9
            }).set('Authorization',token)
            expect(response.statusCode).toBe(StatusCodes.OK)
        })
    })
}