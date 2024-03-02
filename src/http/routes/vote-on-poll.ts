import z from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import { redis } from "../../lib/redis"
import { voting } from "../../utils/voting-pub-sub"

export async function voteOnPoll(app: FastifyInstance) {
    //@ts-ignore
    app.post('/polls/:pollId/votes', { onRequest: [app.authenticate] }, async (request, reply) => {
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid(),
            createdById: z.string().uuid(),
        })

        const voteOnPollParams = z.object({
            pollId: z.string().uuid()
        })
    
        const { pollId } = voteOnPollParams.parse(request.params)
        const { pollOptionId, createdById } = voteOnPollBody.parse(request.body)

        await prisma.vote.create({
            data: {
                pollId,
                pollOptionId,
                createdById
            }
        })

        const votes = await redis.zincrby(pollId, 1, pollOptionId)

        voting.publish(pollId, {
            pollOptionId,
            votes: Number(votes)
        })

        return reply.status(201).send()
    })
}
