import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function listPolls(app: FastifyInstance) {
    //@ts-ignore
    app.get('/polls', { onRequest: [app.authenticate] },  async (request, reply) => {
        const polls = await prisma.poll.findMany({
            orderBy: {
                created_at: 'desc'
            },
            include: {
                options: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true, 
                        avatar: true,
                        email: true
                    }
                },
                votes: {
                    select: {
                        pollOption: true,
                        createdById: true
                    }
                }
            }
        })

        return reply.send(polls)
    })
}
