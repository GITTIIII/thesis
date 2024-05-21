import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db';

export const currentUser = async () => {
    const session = await getServerSession(authOptions);
    const username = session?.user.username

    if(!session) {
        return null;
    }

    const user = await db.user.
    findUnique({
        where: {
            username: username
        }
    });

    return user;
}