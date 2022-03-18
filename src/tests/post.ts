import request from "supertest";
import { Express } from "express";
import ROUTES from "../constants/Routes";
import { StatusCodes } from "http-status-codes";
import Post from "../Models/Post";

export default (app: Express) => {
   let token = "";
   describe("POST", () => {
      describe("Post have permissions", () => {
         test("Sign in successfully", async () => {
            const response = await request(app).post(ROUTES.Login).send({
               email: "tin.mai1@gmail.com",
               password: "huutin123",
            });
            token = "Bearer " + response.body.token;
            expect(response.statusCode).toBe(StatusCodes.OK);
         });

         test("Get All Posts", async () => {
            const response = await request(app).get(ROUTES.Posts).set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body).toBeInstanceOf(Array);
         });
         test("Create Post", async () => {
            var milliseconds = new Date().getTime();
            const response = await request(app)
               .post(ROUTES.Posts)
               .send({
                  authorId: 4,
                  title: "Post Title ",
                  slug: `ascwi${milliseconds}`,
                  content: "Post content",
               })
               .set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.CREATED);
         });
         test("Update Post", async () => {
            const response = await request(app)
               .put(ROUTES.PostId)
               .send({
                  authorId: 4,
                  title: "Updated Title",
                  slug: "Updated slug",
                  content: "Updated Content",
               })
               .set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
         });
         test("Delete Post with permission", async () => {
            const data: any = await Post.createPost({
               authorId: 4,
               title: "abcs",
               slug: "PQWOffEd",
               content: "Nice try",
            });
            const response = await request(app).delete(`/post/${data[0]?.insertId}`).set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
         });
      });
      describe("Post have no permissions", () => {
         test("Sign in successfully", async () => {
            const response = await request(app).post(ROUTES.Login).send({
               email: "tin.mai12@gmail.com",
               password: "huutin123",
            });
            token = "Bearer " + response.body.token;
            expect(response.statusCode).toBe(StatusCodes.OK);
         });

         test("Get All Posts without permission", async () => {
            const response = await request(app).get(ROUTES.Posts).set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
         });
         test("Create without Post", async () => {
            const response = await request(app)
               .post(ROUTES.Posts)
               .send({
                  authorId: 4,
                  title: "abcs",
                  slug: "PQWOE",
                  content: "Nice try",
               })
               .set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
         });
         test("Update Post with no permission", async () => {
            const response = await request(app)
               .put(ROUTES.PostId)
               .send({
                  title: "Updated Title",
                  slug: "Updated slug",
                  content: "Updated Content",
               })
               .set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
         });
         test("Delete Post with no permission", async () => {
            const response = await request(app).delete(ROUTES.PostId).set("Authorization", token);
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
         });
      });
   });
};
