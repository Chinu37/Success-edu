import { z } from 'zod';
import { auth, clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import { isTeacher } from '@/lib/teacher';

const grantSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  amount: z.number().min(0).max(10_000_000).optional(),
  note: z.string().trim().max(500).optional(),
});

const revokeSchema = z.object({
  userId: z.string().min(1),
});

// Only the course owner (a teacher) or a super admin may change access.
const getManageableCourse = async (userId: string, courseId: string) => {
  const course = await db.course.findUnique({ where: { id: courseId } });

  if (!course) return null;
  if (isAdmin(userId)) return course;
  if (isTeacher(userId) && course.userId === userId) return course;

  return null;
};

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const parsed = grantSchema.safeParse(await req.json());

    if (!parsed.success) {
      return new NextResponse('Enter a valid email and amount', { status: 400 });
    }

    const course = await getManageableCourse(userId, params.courseId);

    if (!course) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { email, amount, note } = parsed.data;

    const students = await clerkClient.users.getUserList({
      emailAddress: [email],
    });
    const student = students[0];

    if (!student) {
      return new NextResponse(
        'No student found with this email. Ask them to sign up first.',
        { status: 404 }
      );
    }

    const existing = await db.purchase.findUnique({
      where: {
        userId_courseId: { userId: student.id, courseId: course.id },
      },
    });

    if (existing) {
      return new NextResponse('This student already has access', {
        status: 409,
      });
    }

    await db.purchase.create({
      data: {
        userId: student.id,
        courseId: course.id,
        amount: amount ?? null,
        source: 'CASH',
        grantedBy: userId,
        note: note || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log('[COURSE_ID_GRANT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const parsed = revokeSchema.safeParse(await req.json());

    if (!parsed.success) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const course = await getManageableCourse(userId, params.courseId);

    if (!course) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: parsed.data.userId,
          courseId: course.id,
        },
      },
    });

    if (!purchase) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Online payments are real money records; only cash grants can be undone.
    if (purchase.source !== 'CASH') {
      return new NextResponse('Online payments cannot be revoked here', {
        status: 400,
      });
    }

    await db.purchase.delete({ where: { id: purchase.id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log('[COURSE_ID_REVOKE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
