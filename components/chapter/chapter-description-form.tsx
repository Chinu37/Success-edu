"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from '../editor';
import { Preview } from '../preview';

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
};

const formSchema = z.object({
  description: z.string().min(1),
});

export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""
    },
  });

  const toggleEdit = () => setIsEditing((current) => {
    if (!current) {
      form.setValue('description', initialData.description || '')
    }
    return !current
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-12 border-white/50 border bg-[#272B33] rounded-md p-4 relative">
      <div className={cn('font-medium flex items-center justify-between', isEditing ? '' : ' pt-2 flex-row-reverse text-sm gap-5')}>

        <span className={cn(
          ' bg-[#272B33] ',
          isEditing ? '' : 'absolute -top-5 left-2 text-md p-1 rounded-full px-3 border border-white/50 text-[#99E1D9]'
        )}>
          Chapter description
        </span>
        <Button onClick={toggleEdit} variant="ghost" className='border border-white/50 hover:bg-gray-600'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
        {(!isEditing && !initialData.description) && (
          <p className={cn(
            "mt-2 text-white/70 truncate",
            !initialData.description && "text-slate-500 italic"
          )}>
            No description
          </p>
        )}
      </div>

      {
        initialData.description && !isEditing && (
          <div className='mt-2 bg-[#1d1f23] rounded'>
            <Preview value={initialData.description} />
          </div>
        )
      }

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"

              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}