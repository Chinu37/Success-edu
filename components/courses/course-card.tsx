import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/courses/course-progress";
import ActionTooltip from '../action-tooltip';

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
};

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-lg hover:shadow-[#99E1D9]/10 transition overflow-hidden border border-white/50 rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex flex-col pt-2">
          {
            title.length >= 40
              ? <ActionTooltip label={title}>
                <div className="text-lg md:text-base font-medium group-hover:text-[#99E1D9] transition line-clamp-2">
                  {title}
                </div>
              </ActionTooltip>
              : <div className="text-lg md:text-base font-medium group-hover:text-[#99E1D9] transition line-clamp-2">
                {title}
              </div>
          }
          <p className="text-xs text-muted-foreground">
            {category}
          </p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : (
            <p className="text-md md:text-sm font-bold text-[#99E1D9]">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}