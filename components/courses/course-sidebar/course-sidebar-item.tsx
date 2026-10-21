"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
};

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);
  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "group flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-white hover:bg-[#272B33]",
        isActive && "text-white bg-slate-200/10 hover:bg-slate-200/10 hover:text-white",
        isCompleted && "text-[#26CD4D] hover:text-[#26CD4D]",
        isCompleted && isActive && "bg-[#26CD4D]/20",
        // isLocked && 'pointer-events-none'
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500 group-hover:text-white transition-all",
            isActive && "text-white",
            isCompleted && "text-[#26CD4D] group-hover:text-[#26CD4D]"
          )}
        />
        <span className='truncate'> {label}</span>
      </div>
      <div className={cn(
        "ml-auto opacity-0 border-2 border-[#99E1D9] h-full transition-all",
        isActive && "opacity-100",
        isCompleted && "border-[#26CD4D]"
      )} />
    </button>
  )
}