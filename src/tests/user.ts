import request from "supertest";
import { Express } from "express";
import ROUTES from "../constants/Routes";
import User from "../Models/User";
import { StatusCodes } from "http-status-codes";
import md5 from "md5";

export default (app: Express) => {
   let token = "";
   describe("Sign In", () => {
      test("Successful", async () => {
         const response = await request(app).post(ROUTES.Login).send({
            email: "huutin123@gmail.com",
            password: "huutin123",
         });
         token = "Bearer " + response.body.token;
         expect(response.statusCode).toBe(StatusCodes.OK);
      });
      test("Wrong email or password", async () => {
         const response = await request(app).post(ROUTES.Login).send({
            email: "tin.ma2i1@gmail.com",
            password: "huutin123",
         });
         expect(response.body.message).toEqual("Email or password is not correct!");
         expect(response.statusCode).toBe(StatusCodes.OK);
      });
      test("Email or password null", async () => {
         const response = await request(app).post(ROUTES.Login).send({
            email: "",
            password: "",
         });

         expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      });
   });
   describe("Register", () => {
      test("Success", async () => {
         var milliseconds = new Date().getTime();
         const email = "huutin";
         const response = await request(app)
            .post(ROUTES.Register)
            .send({
               email: `${email}${milliseconds}@gmail.com`,
               password: "huutin123",
            });

         expect(response.statusCode).toBe(StatusCodes.CREATED);
      });
      test("Failed or Duplicate email or mobile", async () => {
         const response = await request(app).post(ROUTES.Register).send({
            email: "huutin123@gmail.com",
            password: "huutin123",
         });
         expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      });
   });
   describe("USER", () => {
      describe("Get Users", () => {
         test("Get All Users", async () => {
            const response = await request(app).get(ROUTES.Users);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body).toBeInstanceOf(Array);
         });
         test("Get User By Id", async () => {
            const response = await request(app).get(ROUTES.UserId).set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body).toBeInstanceOf(Object);
         });
         test("Get User By Id Without Login", async () => {
            const response = await request(app).get(ROUTES.UserId);
            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
         });
      });
      describe("Update User", () => {
         test("Success", async () => {
            const response = await request(app)
               .put(ROUTES.UserId)
               .send({
                  email: "huutin123@gmail.com",
                  password: "huutin123",
                  lastName: "Huti",
               })
               .set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
         });
         test("No Login", async () => {
            const response = await request(app).put(ROUTES.UserId).send({
               email: "huutin123@gmail.com",
               password: "huutin123",
               lastName: "Huti",
            });
            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
         });
      });
      describe("Delete User", () => {
         test("Success", async () => {
            var milliseconds = new Date().getTime();
            const data: any = await User.register({
               firstName: "Nguyen",
               middleName: "Huu",
               lastName: "Tin",
               mobile: milliseconds,
               email: `abcsd${milliseconds}@gmail.com`,
               passwordHash: md5("huutin123"),
            });
            const response = await request(app).delete(`/user/${data[0]?.insertId}`).set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
         });
         test("No Login", async () => {
            const response = await request(app).delete(ROUTES.UserId);
            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
         });
      });
   });
};
