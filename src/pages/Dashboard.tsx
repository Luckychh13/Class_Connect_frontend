import { useGetIdentity, useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { ClassDetails, Subject, User, UserRole } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: identity } = useGetIdentity<User>();

  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { pageSize: 1 },
  });

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 1 },
  });

  const { query: studentsQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "student" }],
    pagination: { pageSize: 1 },
  });

  const isAdminOrTeacher =
    identity?.role === UserRole.ADMIN || identity?.role === UserRole.TEACHER;

  const stats = [
    {
      label: "Total Classes",
      value: classesQuery.data?.total,
      isLoading: classesQuery.isLoading,
      icon: GraduationCap,
    },
    {
      label: "Total Subjects",
      value: subjectsQuery.data?.total,
      isLoading: subjectsQuery.isLoading,
      icon: BookOpen,
    },
    ...(isAdminOrTeacher
      ? [
          {
            label: "Total Students",
            value: studentsQuery.data?.total,
            isLoading: studentsQuery.isLoading,
            icon: Users,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">
          Welcome{identity?.name ? `, ${identity.name}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your academic hub.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stat.isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value ?? 0}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;