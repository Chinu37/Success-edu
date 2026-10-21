"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

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

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
};

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export const DescriptionForm = ({
  initialData,
  courseId
}: DescriptionFormProps) => {
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
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
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
          Course description
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
          <p className="text-slate-500 italic">
            {initialData.title}
          </p>
        )}
      </div>

      {(!isEditing && initialData.description) && (
        <p className='mt-3 text-base'>
          {initialData.description}
        </p>
      )}

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
                    <Textarea
                      autoFocus
                      disabled={isSubmitting}
                      placeholder="e.g. 'This course is about...'"
                      {...field}
                      className='min-h-[150px]'
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