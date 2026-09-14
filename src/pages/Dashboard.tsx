import { useGetIdentity, useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Building2, GraduationCap, Users } from "lucide-react";
import { ClassDetails, Department, Subject, User, UserRole } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

type StatDef = {
  label: string;
  value: number | undefined;
  isLoading: boolean;
  icon: typeof Users;
};

const Dashboard = () => {
  const { data: identity, isLoading: identityLoading } = useGetIdentity<User>();
  const role = identity?.role;


  const { query: studentsQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "student" }],
    pagination: { pageSize: 1 },
    queryOptions: { enabled: !!role && (role === UserRole.TEACHER || role === UserRole.ADMIN) },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: { pageSize: 1 },
    queryOptions: { enabled: role === UserRole.ADMIN },
  });

  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { pageSize: 1 },
    queryOptions: { enabled: !!role && role !== UserRole.ADMIN },
  });

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 1 },
    queryOptions: { enabled: !!role },
  });

  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 1 },
    queryOptions: { enabled: role === UserRole.ADMIN },
  });

  let stats: StatDef[] = [];

  if (role === UserRole.STUDENT) {
    stats = [
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
    ];
  } else if (role === UserRole.TEACHER) {
    stats = [
      {
        label: "Total Students",
        value: studentsQuery.data?.total,
        isLoading: studentsQuery.isLoading,
        icon: Users,
      },
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
    ];
  } else if (role === UserRole.ADMIN) {
    stats = [
      {
        label: "Total Students",
        value: studentsQuery.data?.total,
        isLoading: studentsQuery.isLoading,
        icon: Users,
      },
      {
        label: "Total Teachers",
        value: teachersQuery.data?.total,
        isLoading: teachersQuery.isLoading,
        icon: Users,
      },
      {
        label: "Total Subjects",
        value: subjectsQuery.data?.total,
        isLoading: subjectsQuery.isLoading,
        icon: BookOpen,
      },
      {
        label: "Total Departments",
        value: departmentsQuery.data?.total,
        isLoading: departmentsQuery.isLoading,
        icon: Building2,
      },
    ];
  }

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

      {identityLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      )}
    </div>
  );
};

export default Dashboard;