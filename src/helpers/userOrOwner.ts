import { prisma } from "../database/index";

const userOrOwner = {
    async byEmail(email: string): Promise<string | null> {
        if (await prisma.user.count({ where: { email } })) {
          return 'user'
        }
        if (await prisma.owner.count({ where: { email } })) 
          return 'owner'
        return null
    },
    async byId(id: string): Promise<string | null> {
      if (await prisma.user.count({ where: { id } })) {
        return 'user'
      }
      if (await prisma.owner.count({ where: { id } })) 
        return 'owner'
      return null
  },
}

export default userOrOwner;