import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

interface LoginHeaderProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export function LoginHeader({
  title = "Welcome back",
  description = "Sign in to your account to continue",
  showBackButton = true
}: LoginHeaderProps) {
  return (
    <div className="text-center space-y-2">
      {showBackButton && (
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      )}
      <h1 className="text-3xl font-bold tracking-tight text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm">
        {description}
      </p>
    </div>
  );
}
