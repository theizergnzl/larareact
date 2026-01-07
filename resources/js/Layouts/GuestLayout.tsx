import { PropsWithChildren } from "react";
import { LoginBackground } from "@/Components/auth/LoginBackground";

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LoginBackground />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
