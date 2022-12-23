import { prisma } from "../database/index";

async function verifyEmail(email: string){
    return await prisma.owner.findUnique({
        where: {
            email
        }
    }) ? true : false;
}

export default verifyEmail