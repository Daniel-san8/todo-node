import { FastifyReply, FastifyRequest } from "fastify";

export default async function verifyTokenJwt(req: FastifyRequest, reply: FastifyReply) {
    const token = await req.jwtVerify<{ author_id: string; }>();

    if(!token.author_id) return reply.status(401).send({
        error: "Usuário não autorizado"
    })
}