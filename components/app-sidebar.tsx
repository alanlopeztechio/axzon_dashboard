import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { UserMenu } from './UserMenu';
import {
  ChevronRight,
  GitBranchPlusIcon,
  LayoutGrid,
  MapPinHouse,
  Route,
  Truck,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const data: { navMain: NavGroup[] } = {
  navMain: [
    {
      title: 'Dashboard',
      items: [
        {
          title: 'Global Command Center',
          url: '/',
          icon: LayoutGrid,
        },
      ],
    },
    {
      title: 'Logistics',
      items: [
        {
          title: 'Logistics Overview',
          url: '/logistics/overview',
          icon: Truck,
        },
        {
          title: 'Carriers',
          url: '/logistics/carriers',
          icon: GitBranchPlusIcon,
        },
        {
          title: 'Routes & Lanes',
          url: '/logistics/routes-lanes',
          icon: Route,
        },
        {
          title: 'Map Fleet',
          url: '/logistics/map-fleet',
          icon: MapPinHouse,
        },
      ],
    },
    {
      title: 'Infrastructure',
      items: [
        {
          title: 'Warehouses',
          url: '#',
          icon: MapPinHouse,
        },
        {
          title: 'Readers',
          url: '#',
          icon: MapPinHouse,
        },
        {
          title: 'Programming Station',
          url: '#',
          icon: MapPinHouse,
        },
      ],
    },
  ],
};

function NavSubItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
        isActive={isActive}
        className={cn(
          'h-9 rounded-lg border border-transparent px-3 text-sm font-medium tracking-tight transition-all',
          'text-[#666] hover:bg-[#1a1a1a] hover:text-[#ccc]',
          '[&>svg]:text-[#666] hover:[&>svg]:text-[#ccc]',
          'data-[active=true]:bg-[#1a0a09] data-[active=true]:text-white',
          'data-[active=true]:border-[#c0392b55] data-[active=true]:[&>svg]:text-[#e74c3c]!',
        )}
      >
        <a href={item.url}>
          <Icon className="size-4 shrink-0 transition-colors" />
          <span>{item.title}</span>
        </a>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

function NavGroup({
  group,
  pathname,
  groupId,
}: {
  group: NavGroup;
  pathname: string;
  groupId: string;
}) {
  const contentId = `${groupId}-content`;

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="flex w-full items-center justify-between px-2 py-2 hover:bg-transparent">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">
                  {group.title}
                </span>
                <ChevronRight className="size-3 text-[#444] transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent
              id={contentId}
              className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
            >
              <SidebarMenuSub>
                {group.items.map((subItem) => {
                  const isActive = subItem.url === pathname;

                  return (
                    <NavSubItem
                      key={subItem.title}
                      item={subItem}
                      isActive={isActive}
                    />
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function AppSidebar({
  pathname,
  ...props
}: React.ComponentProps<typeof Sidebar> & { pathname: string }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="flex items-center gap-2">
                <div className="flex aspect-square size-10 items-center justify-center rounded-full border border-[#333] bg-[#1a1a1a] text-white">
                  <Zap className="size-5 text-[#c0392b]" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-base font-bold tracking-widest">
                    AXZON
                  </span>
                  <span className="text-[10px] font-medium tracking-[0.12em] text-[#c0392b]">
                    CONNECT
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => {
          const groupId = `sidebar-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

          return (
            <NavGroup
              key={group.title}
              group={group}
              pathname={pathname}
              groupId={groupId}
            />
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
