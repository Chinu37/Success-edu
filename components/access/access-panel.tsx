import { clerkClient } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { GrantAccessForm } from "@/components/access/grant-access-form";
import { RevokeButton } from "@/components/access/revoke-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AccessPanelProps {
  // Teacher view: only this owner's courses. Omit for the super admin view (all courses).
  ownerId?: string;
}

export const AccessPanel = async ({ ownerId }: AccessPanelProps) => {
  const courses = await db.course.findMany({
    where: ownerId ? { userId: ownerId } : {},
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  const purchases = await db.purchase.findMany({
    where: { courseId: { in: courses.map((course) => course.id) } },
    include: { course: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const userIds: string[] = Array.from(
    new Set<string>(purchases.map((purchase: { userId: string }) => purchase.userId))
  );
  const users = userIds.length
    ? await clerkClient.users.getUserList({ userId: userIds, limit: 200 })
    : [];
  const userMap = new Map(users.map((user) => [user.id, user]));

  return (
    <div className="p-6 space-y-8">
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold">Give access (cash payment)</h2>
          <p className="text-sm text-muted-foreground">
            Use this when a student paid you in cash. They get the course right away.
          </p>
        </div>
        <GrantAccessForm courses={courses} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Enrolled students</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>How</TableHead>
                <TableHead>Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No students yet.
                  </TableCell>
                </TableRow>
              )}
              {purchases.map((purchase) => {
                const user = userMap.get(purchase.userId);
                const name =
                  [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "—";
                const email = user?.emailAddresses[0]?.emailAddress ?? "";
                const isCash = purchase.source === "CASH";

                return (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      <div className="font-medium">{name}</div>
                      <div className="text-xs text-muted-foreground">{email}</div>
                    </TableCell>
                    <TableCell>{purchase.course.title}</TableCell>
                    <TableCell>
                      {purchase.amount != null ? formatPrice(purchase.amount) : "—"}
                    </TableCell>
                    <TableCell>
                      {isCash ? "Cash" : "Online"}
                      {purchase.note ? (
                        <div className="text-xs text-muted-foreground">{purchase.note}</div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {new Date(purchase.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right">
                      {isCash && (
                        <RevokeButton
                          courseId={purchase.courseId}
                          userId={purchase.userId}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};
