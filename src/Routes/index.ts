import {Express} from 'express';
import PostRoute from "./PostRoute"
import CategoryRoute from "./CategoryRoute"
import UserRoute from "./UserRoute"
import PermissionRoute from "./PermissionRoute"
import Permission from "../constants/ActionPermission";
import CheckPermission from "../middlewares/CheckPermission";

import Authentication from "../middlewares/Authentication"

const router = (app:Express) =>{
    app.use("/post",CheckPermission(Permission.RESOURCE.POST),Authentication, PostRoute);
    app.use("/cate",CheckPermission(Permission.RESOURCE.CATE),Authentication,CategoryRoute);
    app.use("/user/",UserRoute);
    app.use("/permission",Authentication,PermissionRoute);
}
export default router