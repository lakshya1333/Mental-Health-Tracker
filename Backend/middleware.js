import jwt from "jsonwebtoken"
const JWT_SECRET = "lakshya"


export const AuthMiddleware = async(req,res,next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ message: "Unauthorised"})
        }

        const decoded = jwt.verify(token,JWT_SECRET)
        req.userId = decoded.userId

        next()
    }catch(error){
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
