import request from "supertest";
import { Express } from "express";
import ROUTES from "../constants/Routes";
import { StatusCodes } from "http-status-codes";
import Category from "../Models/Category";

export default (app: Express) => {
   let token = "";
   describe("CATEGORY", () => {
      describe("category have permissions", () => {
         test("Sign in successfully", async () => {
            const response = await request(app).post(ROUTES.Login).send({
               email: "tin.mai1@gmail.com",
               password: "huutin123",
            });
            token = "Bearer " + response.body.token;
            expect(response.statusCode).toBe(StatusCodes.OK);
         });

         test("Get All Categories", async () => {
            const response = await request(app).get(ROUTES.Cates).set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body).toBeInstanceOf(Array);
         });
         test("Create Category", async () => {
            const response = await request(app)
               .post(ROUTES.Cates)
               .send({
                  title: "abcs",
                  slug: "PQWOE",
                  content: "Nice try",
               })
               .set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.CREATED);
         });
         test("Update Category", async () => {
            const response = await request(app)
               .put(ROUTES.CateId)
               .send({
                  title: "Updated Title",
                  slug: "Updated slug",
                  content: "Updated Content",
               })
               .set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
         });
         test("Delete Category with permission", async () => {
            const data: any = await Category.createCategory({
               title: "abcs",
               slug: "PQWOE",
               content: "Nice try",
            });
            const response = await request(app).delete(`/cate/${data[0]?.insertId}`).set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
         });
      });
      describe("Category have no permissions", () => {
         test("Sign in successfully", async () => {
            const response = await request(app).post(ROUTES.Login).send({
               email: "tin.mai12@gmail.com",
               password: "huutin123",
            });
            token = "Bearer " + response.body.token;
            expect(response.statusCode).toBe(StatusCodes.OK);
         });

         test("Get All Categories without permission", async () => {
            const response = await request(app).get(ROUTES.Cates).set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
         });
         test("Create without Category", async () => {
            const response = await request(app)
               .post(ROUTES.Cates)
               .send({
                  title: "abcs",
                  slug: "PQWOE",
                  content: "Nice try",
               })
               .set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
         });
         test("Update Category with no permission", async () => {
            const response = await request(app)
               .put(ROUTES.CateId)
               .send({
                  title: "Updated Title",
                  slug: "Updated slug",
                  content: "Updated Content",
               })
               .set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
         });
         test("Delete Category with no permission", async () => {
            const response = await request(app).delete(ROUTES.CateId).set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
         });
      });
   });
};
