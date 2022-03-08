import {Express} from 'express';
import PostRoute from "./PostRoute"
import CategoryRoute from "./CategoryRoute"
import UserRoute from "./UserRoute"
import PermissionRoute from "./PermissionRoute"

import Authentication from "../middlewares/Authentication"
import CheckJWT from "../middlewares/CheckJWT";

const router = (app:Express) =>{
    app.use("/post", PostRoute);
    app.use("/cate",CategoryRoute);
    app.use("/user/",UserRoute);
    app.use("/permission",Authentication,CheckJWT,PermissionRoute);
}
export default router