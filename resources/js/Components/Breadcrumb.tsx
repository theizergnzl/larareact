import React from "react";
import { usePage, Link } from "@inertiajs/react"; // Import Link from Inertia
import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { User } from "@/types";

export function Breadcrumbs({ user }: { user: User }) {
  const { url } = usePage(); // Get the current URL
  const [path, query] = url.split("?"); // Split the URL into path and query
  const pathSegments = path.split("/").filter(Boolean); // Split the path into segments
  const isDashboard = route().current("dashboard"); // Check if the current route is the dashboard

  return (
    <Breadcrumb className="flex-shrink-0">
      <BreadcrumbList>
        <BreadcrumbItem>
          {isDashboard ? (
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          ) : (
            <Link className="hover:underline" href={route("dashboard")}>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </Link>
          )}
        </BreadcrumbItem>
        {!isDashboard && (
          <>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1; // Check if it's the last segment
              const isUserSegment =
                pathSegments[index - 1] === "users" && !isNaN(Number(segment)); // Check if it's a user segment

              let displayText =
                segment.charAt(0).toUpperCase() + segment.slice(1); // Construct display text
              if (isUserSegment && user) {
                displayText = user.name; // Use the user's name instead of the ID
              }

              // Construct href with query params for the last segment
              const href = isLast
                ? `/${pathSegments.slice(0, index + 1).join("/")}${
                    query ? `?${query}` : ""
                  }`
                : `/${pathSegments.slice(0, index + 1).join("/")}`;

              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{displayText}</BreadcrumbPage>
                    ) : (
                      <Link className="hover:underline" href={href}>
                        <BreadcrumbPage>{displayText}</BreadcrumbPage>
                      </Link>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator>
                      <Slash />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
