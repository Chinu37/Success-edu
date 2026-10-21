"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GrantAccessFormProps {
  courses: { id: string; title: string }[];
}

export const GrantAccessForm = ({ courses }: GrantAccessFormProps) => {
  const router = useRouter();
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (courses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Create a course first, then you can give students access here.
      </p>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`/api/courses/${courseId}/grant`, {
        email,
        amount: amount ? Number(amount) : undefined,
        note: note || undefined,
      });
      toast.success("Access granted");
      setEmail("");
      setAmount("");
      setNote("");
      router.refresh();
    } catch (error: any) {
      const message = error?.response?.data;
      toast.error(typeof message === "string" && message ? message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2 max-w-2xl">
      <select
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm md:col-span-2"
      >
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>
      <Input
        type="email"
        required
        placeholder="Student email (they must have signed up)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="md:col-span-2"
      />
      <Input
        type="number"
        min={0}
        placeholder="Cash received in ₹ (optional)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input
        placeholder="Note (optional)"
        maxLength={500}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button type="submit" disabled={loading || !email || !courseId} className="md:col-span-2">
        Grant access
      </Button>
    </form>
  );
};
