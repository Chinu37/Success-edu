import { clerkClient } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Always fetch fresh data: this page shows live students and payments.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;

const AdminStudentsPage = async () => {
  const [totalUsers, users] = await Promise.all([
    clerkClient.users.getCount(),
    clerkClient.users.getUserList({ limit: PAGE_SIZE, orderBy: "-created_at" }),
  ]);

  const userIds = users.map((user) => user.id);

  const purchases = await db.purchase.findMany({
    where: { userId: { in: userIds } },
    include: { course: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  const purchasesByUser = new Map<string, typeof purchases>();
  for (const purchase of purchases) {
    const list = purchasesByUser.get(purchase.userId) ?? [];
    list.push(purchase);
    purchasesByUser.set(purchase.userId, list);
  }

  const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Students</h1>
        <p className="text-sm text-muted-foreground">
          {totalUsers} registered users. Showing the latest {users.length}.
          Revenue from these students: {formatPrice(totalRevenue)}.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Courses bought</TableHead>
              <TableHead className="text-right">Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const userPurchases = purchasesByUser.get(user.id) ?? [];
              const spent = userPurchases.reduce(
                (sum, p) => sum + (p.amount ?? 0),
                0
              );
              const name =
                [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
              const email = user.emailAddresses[0]?.emailAddress ?? "—";

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {userPurchases.length > 0
                      ? userPurchases.map((p) => p.course.title).join(", ")
                      : "None yet"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(spent)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminStudentsPage;
