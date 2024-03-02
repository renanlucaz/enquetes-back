import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import z from "zod"

export async function auth(app: FastifyInstance) {
    app.post('/auth', async (request, reply) => {
        const userBody = z.object({
            name: z.string(),
            email: z.string(),
            avatar: z.string()
        })

        const { avatar, email, name } = userBody.parse(request.body)

        //Cria usuário caso não exista
        let user = await prisma.user.findUnique({ where: { email } });
        if(!user) {
            user = await prisma.user.create({ data: { avatar, email, name } })
        }

        const token = app.jwt.sign({ user })

        return reply.send({ token })
    })
}
