"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ChapterFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
};

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export const ChapterTitleForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterFormProps) => {

  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const toggleEdit = () => setIsEditing((current) => {
    if (!current) {
      form.setValue('title', initialData.title)
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
    <div className="mt-12 border border-white/50 rounded-md p-4 bg-[#272B33] relative">
      <div className={cn('font-medium flex items-center justify-between', isEditing ? '' : 'text-sm pt-2 flex-row-reverse')}>

        <p className={cn(
          'bg-[#272B33]',
          !isEditing ? 'absolute -top-5 left-2 text-md p-1 rounded-full px-3 border border-white/50 text-[#99E1D9]' : ''
        )}>
          Chapter title
        </p>

        <Button onClick={toggleEdit} variant="ghost" className='border border-white/50 hover:bg-gray-600'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit title
            </>
          )}
        </Button>
        {!isEditing && (
          <p className="  truncate">
            {initialData.title}
          </p>
        )}
      </div>
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      autoFocus
                      className=''
                      placeholder="e.g. '01 - Introduction'"
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
                Save new title
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}