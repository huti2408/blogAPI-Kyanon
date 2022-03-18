import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import md5 from "md5";
import apiMessage from "../constants/Message";
import User from "../Models/User";
import Permission from "../Models/Permission";
import { DeleteValue, SetValue } from "../lib/redis-helper";
import _ from "lodash";
import { validationResult } from "express-validator";

export default class UserController {
   public static async GetAllUsers(req: Request, res: Response) {
      try {
         res.status(StatusCodes.OK).json(await User.find());
      } catch (err) {
         console.log(err.message);
         res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
      }
   }
   public static async GetUser(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const cate = await User.findOnebyId(id);
         res.status(200).json(cate);
      } catch (err) {
         console.log(err.message);
         res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
      }
   }
   public static async Register(req: Request, res: Response) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }
         const { firstName, middleName, lastName, mobile, email, password } = req.body;
         var passwordHash = md5(password);
         var existedUser = await User.findByEmail(email);
         if (!existedUser) {
            User.register({ firstName, middleName, lastName, mobile, email, passwordHash });
            return res.status(StatusCodes.CREATED).json({ message: apiMessage.CREATE.message });
         } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email isn't available!" });
         }
      } catch (err) {
         console.log(err.message);
         res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
      }
   }
   public static async UpdateUser(req: Request, res: Response) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }
         const { id } = req.params;
         const { firstName, middleName, lastName, mobile, email, password } = req.body;
         var passwordHash = md5(password);
         User.updateUser({ firstName, middleName, lastName, mobile, email, passwordHash }, id);
         return res.status(StatusCodes.OK).json(apiMessage.UPDATE);
      } catch (err) {
         console.log(err.message);
         res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
      }
   }
   public static async DeleteUser(req: Request, res: Response) {
      try {
         const { id } = req.params;
         User.deleteById(id);
         res.status(StatusCodes.OK).json(apiMessage.DELETE);
      } catch (err) {
         console.log(err.message);
         res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
      }
   }
   public static async Login(req: Request, res: Response) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }
         const { email, password } = req.body;
         const passwordHash = md5(password);
         var existedUser: any = await User.findByEmail(email);
         if (!email || !password) {
            res.status(StatusCodes.BAD_REQUEST).json("Bad Request");
         } else {
            if (!existedUser || existedUser.passwordHash !== passwordHash) {
               res.status(StatusCodes.OK).json({ message: "Email or password is not correct!" });
            } else {
               const userId = existedUser.id;
               const userEmail = existedUser.email;
               var permissionObj = {};
               const permissions = await Permission.getUserPermission(userId);

               _.forEach(permissions, (value: any) => {
                  const resource = value.resource;
                  const action = value.action;
                  _.has(permissionObj, resource) ? permissionObj[resource].push(action) : (permissionObj[resource] = [action]);
               });
               // if(Array.isArray(permissions)){
               //     permissionObj = _.groupBy(permissions,'resource')
               //     var newObj = Object.values(permissionObj).map(rs=>{
               //     if(!Array.isArray(rs)){
               //         return res.status(StatusCodes.UNAUTHORIZED).json("Server error");
               //     }
               //     else{
               //         return rs.map(item=>item.action)
               //     }
               //     })
               //     Object.keys(permissionObj).map((item,index)=>{
               //         permissionObj[item] = newObj[index]
               //     })
               // }
               const token = jwt.sign(
                  {
                     id: userId,
                     email: userEmail,
                     permissions: permissionObj,
                  },
                  process.env.KEY_JWT || "SADASC"
               );
               setTimeout(() => {
                  SetValue(userId, token);
               }, 0);
               res.status(StatusCodes.OK).json({ token });
               // new Promise((resolve, reject) => {
               //     if(userId) resolve(userId)
               //     else reject("User ID not found")
               // }).then(userId=>{
               //     SetValue(userId,token)
               // }).catch(err=>{
               //     console.log(err)
               // })
            }
         }
      } catch (err) {
         console.log(err.message);
         res.status(StatusCodes.UNAUTHORIZED).json({ error: err.message });
      }
   }

   public static async LogOut(req: Request, res: Response) {
      const { userId } = req.body;
      if (!userId) {
         return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Server error" });
      }
      try {
         DeleteValue(userId);
         res.status(StatusCodes.OK).json({ message: "Log out Successfully!" });
      } catch (err: any) {
         console.log(err.message);
         res.status(StatusCodes.UNAUTHORIZED).json({ message: "Server error" });
      }
   }
}
