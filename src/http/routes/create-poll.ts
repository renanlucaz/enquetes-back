import z from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

interface JwtPayload {
    user: {
        id: string
        avatar: string
        name: string
        email: string
    }
}

export async function createPoll(app: FastifyInstance) {
    //@ts-ignore
    app.post('/polls', { onRequest: [app.authenticate] }, async (request, reply) => {
        const createPollBody = z.object({
            title: z.string(),
            options: z.array(z.string())
        })
    
        const { title, options } = createPollBody.parse(request.body)

        const jwtToken = app.jwt.lookupToken(request) ; 

        const { user } = app.jwt.decode(jwtToken) as JwtPayload;

        const poll = await prisma.poll.create({
            data: {
                title,
                userId: user.id,
                options: {
                    createMany: {
                        data: options.map(option => {
                            return { title: option }
                        })
                    }
                }
            }
        })
         
        return reply.status(201).send({ pollId: poll.id })
    })
}
