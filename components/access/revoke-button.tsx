"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface RevokeButtonProps {
  courseId: string;
  userId: string;
}

export const RevokeButton = ({ courseId, userId }: RevokeButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (!window.confirm("Remove this student's access?")) return;

    setLoading(true);
    try {
      await axios.delete(`/api/courses/${courseId}/grant`, { data: { userId } });
      toast.success("Access removed");
      router.refresh();
    } catch (error: any) {
      const message = error?.response?.data;
      toast.error(typeof message === "string" && message ? message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" variant="ghost" disabled={loading} onClick={onClick}>
      Remove
    </Button>
  );
};
