// src/hooks.server.ts
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '$lib/jwt';
import { env } from '$env/dynamic/private';

const prisma = new PrismaClient();
const jwtSecret = env.JWT_SECRET || 'DEFAULT_SECRET_CHANGE_IN_PROD';

export const handle = async ({ event, resolve }) => {
    const token = event.cookies.get('auth_token');
    if (token) {
        const decoded = await verifyJWT(token, jwtSecret);
        if (decoded) {
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (user) {
                event.locals.user = { id: user.id, email: user.email };
            }
        } else {
            event.locals.user = null;
        }
    }
    return resolve(event);
};