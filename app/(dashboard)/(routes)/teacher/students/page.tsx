import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { AccessPanel } from "@/components/access/access-panel";

export const dynamic = "force-dynamic";

const TeacherStudentsPage = () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  return <AccessPanel ownerId={userId} />;
};

export default TeacherStudentsPage;
