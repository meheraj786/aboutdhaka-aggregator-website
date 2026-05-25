"use client";

import {
	BriefcaseMedical,
	Building,
	Bus,
	BusIcon,
	CameraIcon,
	CircleHelpIcon,
	CookingPot,
	DatabaseIcon,
	Dog,
	FileChartColumnIcon,
	FileIcon,
	FileTextIcon,
	Glasses,
	LayoutDashboardIcon,
	MapPinIcon,
	Paperclip,
	SearchIcon,
	Settings2Icon,
	UsersIcon,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./appComponents/Logo";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: <LayoutDashboardIcon />,
		},
		{
			title: "Places",
			url: "/dashboard/places",
			icon: <MapPinIcon />,
		},
		{
			title: "Hospitals",
			url: "/dashboard/hospitals",
			icon: <BriefcaseMedical />,
		},
		{
			title: "Restaurants",
			url: "/dashboard/restaurants",
			icon: <CookingPot />,
		},
		{
			title: "Malls",
			url: "/dashboard/malls",
			icon: <Building />,
		},
		{
			title: "Doctors",
			url: "/dashboard/doctors",
			icon: <UsersIcon />,
		},
		{
			title: "Rents",
			url: "/dashboard/rents",
			icon: <Building />,
		},
		{
			title: "Vets",
			url: "/dashboard/vets",
			icon: <Dog />,
		},
		{
			title: "Teachers",
			url: "/dashboard/teachers",
			icon: <Glasses />,
		},
		{
			title: "Bus",
			url: "/dashboard/bus",
			icon: <Bus />,
		},
		{
			title: "Bus Stops",
			url: "/dashboard/bus-stops",
			icon: <BusIcon />,
		},
		{
			title: "Freelancers",
			url: "/dashboard/freelancers",
			icon: <CircleHelpIcon />,
		},
		{
			title: "Blogs",
			url: "/dashboard/blogs",
			icon: <Paperclip />,
		},
		{
			title: "Area",
			url: "/dashboard/areas",
			icon: <MapPinIcon />,
		},
		{
			title: "PC Suggester",
			url: "/dashboard/pc",
			icon: <LayoutDashboardIcon />,
		},
	],
	navClouds: [
		{
			title: "Capture",
			icon: <CameraIcon />,
			isActive: true,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Proposal",
			icon: <FileTextIcon />,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Prompts",
			icon: <FileTextIcon />,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: <Settings2Icon />,
		},
		{
			title: "Get Help",
			url: "#",
			icon: <CircleHelpIcon />,
		},
		{
			title: "Search",
			url: "#",
			icon: <SearchIcon />,
		},
	],
	documents: [
		{
			name: "Data Library",
			url: "#",
			icon: <DatabaseIcon />,
		},
		{
			name: "Reports",
			url: "#",
			icon: <FileChartColumnIcon />,
		},
		{
			name: "Word Assistant",
			url: "#",
			icon: <FileIcon />,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:p-1.5!"
						>
							<Logo />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				{/* <NavDocuments items={data.documents} /> */}
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
