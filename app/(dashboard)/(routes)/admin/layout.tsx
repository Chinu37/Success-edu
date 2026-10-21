import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/admin";

const AdminLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { userId } = auth();

  if (!isAdmin(userId)) {
    return redirect("/");
  }

  return <>{children}</>
}

export default AdminLayout;
