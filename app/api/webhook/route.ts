import crypto from 'crypto';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('x-razorpay-signature') ?? '';

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!valid) {
    return new NextResponse('Webhook Error: Invalid signature', { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event !== 'payment_link.paid') {
    return new NextResponse(`Ignored event type ${event.event}`, { status: 200 });
  }

  const link = event.payload?.payment_link?.entity;
  const payment = event.payload?.payment?.entity;
  const userId = link?.notes?.userId;
  const courseId = link?.notes?.courseId;

  if (!userId || !courseId) {
    return new NextResponse('Webhook Error: Missing notes', { status: 400 });
  }

  // Razorpay may retry webhooks, so make this idempotent.
  await db.purchase.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: {
      userId,
      courseId,
      amount: payment?.amount ? payment.amount / 100 : null,
      razorpayPaymentId: payment?.id ?? null,
    },
  });

  return new NextResponse(null, { status: 200 });
}
