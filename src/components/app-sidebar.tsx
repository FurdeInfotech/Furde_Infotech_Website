"use client"
import { Home, BriefcaseBusiness, LogOut, Image as ImageIcon, User, Award } from "lucide-react";
import logo from "@/assets/fitmain.png"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Separator } from "./ui/separator";
import Image from "next/image";
import {signOut } from "next-auth/react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Jobs",
    url: "/dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Employees ID",
    url: "/dashboard/employees-id",
    icon: User,
  },
  {
    title: "Gallery",
    url: "/dashboard/gallery",
    icon: ImageIcon,
  },
  {
    title: "Certificates",
    url: "/dashboard/certificates",
    icon: Award,
  },
];

export function AppSidebar() {

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className=" justify-center"><Image src={logo} alt="FIT" className=" w-52"/></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarContent>
          <Separator />
        </SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton  onClick={() => signOut()}>
              <LogOut /> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
