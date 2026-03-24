import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
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
  BoxIcon,
  ChevronRight,
  GitBranchPlusIcon,
  LayoutGrid,
  MapIcon,
  Route,
  Truck,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// This is sample data.
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
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
      url: '#',
      items: [
        {
          title: 'Logistics Overview',
          url: '/logistics',
          icon: Truck,
        },
        {
          title: 'Shipments',
          url: '#',
          icon: BoxIcon,
        },
        {
          title: 'Fleet Map',
          url: '#',
          icon: MapIcon,
        },
        {
          title: 'Carriers',
          url: '#',
          icon: GitBranchPlusIcon,
        },
        {
          title: 'Routes & Lanes',
          url: '#',
          icon: Route,
        },
        {
          title: 'Optimizing',
          url: '#',
        },
        {
          title: 'Configuring',
          url: '#',
        },
        {
          title: 'Testing',
          url: '#',
        },
        {
          title: 'Authentication',
          url: '#',
        },
        {
          title: 'Deploying',
          url: '#',
        },
        {
          title: 'Upgrading',
          url: '#',
        },
        {
          title: 'Examples',
          url: '#',
        },
      ],
    },
    {
      title: 'API Reference',
      url: '#',
      items: [
        {
          title: 'Components',
          url: '#',
        },
        {
          title: 'File Conventions',
          url: '#',
        },
        {
          title: 'Functions',
          url: '#',
        },
        {
          title: 'next.config.js Options',
          url: '#',
        },
        {
          title: 'CLI',
          url: '#',
        },
        {
          title: 'Edge Runtime',
          url: '#',
        },
      ],
    },
    {
      title: 'Architecture',
      url: '#',
      items: [
        {
          title: 'Accessibility',
          url: '#',
        },
        {
          title: 'Fast Refresh',
          url: '#',
        },
        {
          title: 'Next.js Compiler',
          url: '#',
        },
        {
          title: 'Supported Browsers',
          url: '#',
        },
        {
          title: 'Turbopack',
          url: '#',
        },
      ],
    },
  ],
};

export function AppSidebar({
  pathname,
  ...props
}: React.ComponentProps<typeof Sidebar> & { pathname: string }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-[#1e1e1e] px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="space-x-2">
                <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-[#1a1a1a] border border-[#333] text-white ">
                  <Zap className="size-5 text-[#c0392b]" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-base text-white tracking-widest">
                    AXZON
                  </span>
                  <span className="text-[10px] text-[#c0392b] tracking-[0.12em] font-medium">
                    CONNECT
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <p className="text-[10px] font-semibold text-[#555] uppercase tracking-widest px-2 py-2">
                      {item.title}
                    </p>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isActive = pathname === subItem.url;
                        const Icon = subItem.icon;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive}
                              className={cn(
                                'h-9 rounded-lg border border-transparent px-3 text-sm font-medium tracking-tight transition-all',
                                'text-[#666] hover:bg-[#1a1a1a] hover:text-[#ccc]',
                                'data-[active=true]:bg-[#1a0a09] data-[active=true]:text-white data-[active=true]:border-[#c0392b55]',
                              )}
                            >
                              <a href={subItem.url}>
                                {Icon && (
                                  <Icon
                                    className={cn(
                                      'size-4 transition-colors',
                                      isActive
                                        ? 'text-[#e74c3c]'
                                        : 'text-[#666]',
                                    )}
                                  />
                                )}
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
