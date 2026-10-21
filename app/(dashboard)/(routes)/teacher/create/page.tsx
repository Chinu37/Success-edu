'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' })
})

type FormSchema = z.infer<typeof formSchema>

const CreatePage = () => {

  const router = useRouter()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' }
  })

  const handleSubmit = async (data: FormSchema) => {
    try {
      const response = await axios.post("/api/courses", data);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Course created");
      router.refresh();
      form.reset()
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center p-6 lg:py-0 py-12 md:mt-28 mt-10">
      <div className=' mx-auto'>
        <h1 className="text-3xl font-bold">
          Name your course
        </h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Course title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoFocus
                      autoComplete='off'
                      className='bg-white text-black'
                      disabled={form.formState.isSubmitting}
                      placeholder="e.g. 'Advanced web development'"
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/teacher/courses')}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant='default'
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                className='flex justify-center items-center gap-5'
              >
                {form.formState.isSubmitting && <Loader2 className='w-5 h-5 animate-spin' />}
                {form.formState.isSubmitting ? 'Creating...' : 'Continue'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
export default CreatePage