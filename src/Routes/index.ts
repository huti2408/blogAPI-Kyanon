import {Express} from 'express';
import PostRoute from "./PostRoute"
import CategoryRoute from "./CategoryRoute"
import UserRoute from "./UserRoute"
import PermissionRoute from "./PermissionRoute"

import Authentication from "../middlewares/Authentication"

const router = (app:Express) =>{
    app.use("/post",Authentication, PostRoute);
    app.use("/cate",Authentication,CategoryRoute);
    app.use("/user/",UserRoute);
    app.use("/permission",Authentication,PermissionRoute);
}
export default router