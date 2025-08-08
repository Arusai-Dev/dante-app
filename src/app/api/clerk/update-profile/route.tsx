import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const { firstName, lastName, userName, bio, location, website } = await req.json();
        
        const updatedUser = await (await clerkClient()).users.updateUser(userId, {
            firstName: firstName,
            lastName: lastName,
            publicMetadata: {
                userName,
                bio,
                location,
                website,
            }
        });

        
        return Response.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        return Response.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}