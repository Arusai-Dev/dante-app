import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const { email } = await req.json();

        const user = await (await clerkClient()).users.getUser(userId)

        if (user.primaryEmailAddress?.emailAddress == email) {
            return NextResponse.json({ success: true, message: 'Email is already primary'})
        }
        
        const existing = user.emailAddresses.find(e => e.emailAddress === email)
        const emailAddress = existing || await (await clerkClient()).emailAddresses.createEmailAddress({
            userId,
            emailAddress: email
        })

        if (!emailAddress.verification?.status || emailAddress.verification.status !== 'verified') {
            await (await clerkClient()).emailAddresses.updateEmailAddress(emailAddress.id, {
                verified: false,
            })
        }
        
        return Response.json({ 
            success: true, 
            message: 'Verification email sent',
            emailAddressId: emailAddress.id 
        });
    } catch (error) {
        console.error('Error updating email:', error);
        return Response.json({ error: 'Failed to update email' }, { status: 500 });
    }
}