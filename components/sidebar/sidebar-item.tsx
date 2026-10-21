"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
};

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "group flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-[#17BEBB] hover:bg-slate-300/20 relative",
        isActive && "text-[#17BEBB] bg-sky-200/20  font-bold"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500 group-hover:text-[#17BEBB]",
            isActive && "text-[#17BEBB]"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-[#17BEBB] h-full transition-all absolute top-0 right-0",
          isActive && "opacity-100"
        )}
      />
    </button>
  )
}