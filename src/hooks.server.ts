// src/hooks.server.ts
import { verifyJWT } from '$lib/jwt';
import { getDB, schema } from '$lib/db';
import { eq } from 'drizzle-orm';

export const handle = async ({ event, resolve }) => {
    const token = event.cookies.get('auth_token');
    const jwtSecret = event.platform?.env.JWT_SECRET || 'DEFAULT_SECRET_CHANGE_IN_PROD';

    if (token && event.platform) {
        const decoded = await verifyJWT(token, jwtSecret);
        if (decoded) {
            const db = getDB(event.platform.env.DB);
            const user = await db
                .select()
                .from(schema.users)
                .where(eq(schema.users.id, decoded.userId))
                .get();

            if (user) {
                event.locals.user = { id: user.id, email: user.email };
            }
        } else {
            event.locals.user = null;
        }
    }
    return resolve(event);
};