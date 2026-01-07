import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Users, UserCheck, UserX, UserMinus } from "lucide-react";

interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}

interface StatisticsCardsProps {
  statistics: UserStatistics;
}

export function StatisticsCards({ statistics }: StatisticsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: statistics.total,
      description: "All registered users",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Users",
      value: statistics.active,
      description: "Currently active users",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Inactive Users",
      value: statistics.inactive,
      description: "Inactive users",
      icon: UserMinus,
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    },
    {
      title: "Suspended Users",
      value: statistics.suspended,
      description: "Suspended users",
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
