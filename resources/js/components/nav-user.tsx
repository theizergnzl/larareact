"use client"

import { useState } from "react";
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  History,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {User} from "@/types";
import {Link, useForm} from "@inertiajs/react";
import { useGeolocation } from "@/hooks/use-geolocation";
import axios from "axios";

export function NavUser({
  user,
}: {
  user: User
}) {
  const { isMobile } = useSidebar()
  const { getCurrentPosition } = useGeolocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { post } = useForm({});

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Obtener ubicación antes de cerrar sesión
      const position = await getCurrentPosition();
      
      // Registrar el cierre de sesión con ubicación
      await axios.post(route("session-history.store"), {
        action: "logout",
        latitude: position.latitude,
        longitude: position.longitude,
      });
      
      // Cerrar sesión enviando la ubicación
      post(route("logout"), {
        data: {
          latitude: position.latitude,
          longitude: position.longitude,
        },
      });
    } catch (error) {
      // Si hay error al obtener la ubicación, cerrar sesión de todas formas
      post(route("logout"));
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                  <AvatarFallback className="rounded-lg">AC</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={route('profile.edit')}>
                  <BadgeCheck />
                  Edit Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={route('session-history.index')}>
                  <History />
                  Session History
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut />
              {isLoggingOut ? "Cerrando sesión..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
