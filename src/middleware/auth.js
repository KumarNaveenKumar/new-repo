import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { loadUsers, saveUsers } from "../db/db.js";

const auth = async (req, res, next) => {

     try {
        const tokenFromReqHeader = req.header('Authorization').replace('Bearer ', '');
        console.log(typeof tokenFromReqHeader)
        const decoded = jwt.verify(tokenFromReqHeader, 'thisisasecret');
        const users = loadUsers();
        const findUserWithToken = users.find((user) => user._id === decoded._id);
        
        const tokens = findUserWithToken.tokens[2];
       
        if (!user) {
           throw new Error('No such user found!')
        }

        req.token = tokenFromReqHeader;
        req.user = user;
        next();
     } catch (e) {
        res.status(401).send({ error: 'Please authenticate!' })
     }
}

export default auth
