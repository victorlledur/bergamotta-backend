import { expressjwt } from "express-jwt";

module.exports = expressjwt({
    secret: process.env.SECRET_KEY as string,
    algorithms: ["HS256"],
});