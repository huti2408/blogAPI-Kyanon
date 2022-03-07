import {Express} from 'express';
import PostRoute from "./PostRoute"
import CategoryRoute from "./CategoryRoute"
import UserRoute from "./UserRoute"

const router = (app:Express) =>{
    app.use("/post", PostRoute);
    app.use("/cate",CategoryRoute);
    app.use("/user/",UserRoute);
}
export default router