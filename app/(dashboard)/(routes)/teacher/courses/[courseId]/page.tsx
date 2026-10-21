import { Actions } from '@/components/course-config/actions';
import { AttachmentForm } from '@/components/course-config/attachment-form';
import { CategoryForm } from '@/components/course-config/category-form';
import { ChaptersForm } from '@/components/course-config/chapters/chapters-form';
import { DescriptionForm } from '@/components/course-config/description-form';
import { ImageForm } from '@/components/course-config/image-form';
import { PriceForm } from '@/components/course-config/price-form';
import { TitleForm } from '@/components/course-config/title-form';
import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { ArrowLeft, CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';


interface Props {
  params: { courseId: string }
}
const Course = async ({ params }: Props) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className='p-6  py-8'>
        <div className='w-full'>
          <Link
            href={`/teacher/courses/`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6 w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all my courses
          </Link>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-y-2'>
            <h1 className='text-4xl font-bold'>Course setup</h1>
            <span className='text-sm text-slate-400'>
              Complete all the fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-8'>
          <div>

            <div className='flex items-center gap-x-2 mb-14'>
              <IconBadge icon={LayoutDashboard} />
              <h2 className='text-xl'>Customize your course</h2>
            </div>

            <TitleForm
              initialData={course}
              courseId={params.courseId}
            />
            <DescriptionForm
              initialData={course}
              courseId={params.courseId}
            />
            <ImageForm
              initialData={course}
              courseId={params.courseId}
            />
            <CategoryForm
              initialData={course}
              courseId={params.courseId}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2 mb-14">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">
                  Course chapters
                </h2>
              </div>
              <ChaptersForm
                initialData={course}
                courseId={params.courseId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2 my-10">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">
                  Sell your course
                </h2>
              </div>
              <PriceForm
                initialData={course}
                courseId={params.courseId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2 my-10">
                <IconBadge icon={File} />
                <h2 className="text-xl">
                  Resources & Attachments
                </h2>
              </div>
              <AttachmentForm
                initialData={course}
                courseId={params.courseId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Course


