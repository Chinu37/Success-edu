import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { razorpay } from '@/lib/razorpay';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (!user || !user.id || !email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse('Already purchased', { status: 400 });
    }

    // Razorpay amounts are in the smallest currency unit (paise).
    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round((course.price ?? 0) * 100),
      currency: 'INR',
      description: course.title.slice(0, 2000),
      customer: { email },
      notify: { email: true },
      reminder_enable: false,
      // Webhook reads these to unlock the course for the right user.
      notes: {
        courseId: course.id,
        userId: user.id,
        instructorId: course.userId,
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      callback_method: 'get',
    });

    return NextResponse.json({ url: paymentLink.short_url });
  } catch (error) {
    console.log('[COURSE_ID_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
