import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cookie from '@fastify/cookie'
import websocket from '@fastify/websocket';
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';
import { voteOnPoll } from './routes/vote-on-poll';
import { pollResults } from './ws/poll-results';
import { listPolls } from './routes/list-polls';
import { auth } from './routes/auth';

const app = fastify();

app.register(cookie, {
    secret: 'polls-app-nlw',
    hook: 'onRequest',
    parseOptions: {}
})


app.register(cors)
app.register(websocket)
app.register(auth)
app.register(jwt, { secret: process.env.JWT_SECRET || 'string' })

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        await request.jwtVerify()
    } catch (err) {
        reply.send(err)
    }
})
app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)
app.register(listPolls)

app.register(pollResults)

app.listen({ 
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('HTTP server running')
}) 