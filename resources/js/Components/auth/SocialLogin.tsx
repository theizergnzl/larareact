import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { Github, Chrome } from "lucide-react";

export function SocialLogin() {
  const handleSocialLogin = (provider: string) => {
    // Implementar lógica de login social
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => handleSocialLogin('github')}
          className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => handleSocialLogin('google')}
          className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Chrome className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  );
}
