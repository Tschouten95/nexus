import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    return (
                    <SidebarMenuItem key={item.title}>
                        {active && (
                            <span className="absolute -left-3 top-1/2 z-10 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                        )}
                        <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={{ children: item.title }}
                            className="data-[active=true]:bg-transparent data-[active=true]:bg-linear-to-r data-[active=true]:from-primary/25 data-[active=true]:to-transparent data-[active=true]:text-white data-[active=true]:font-medium data-[active=true]:ring-1 data-[active=true]:ring-inset data-[active=true]:ring-primary/25 data-[active=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                        >
                            <Link href={item.href} prefetch>
                                {item.dot ? (
                                    <span
                                        className={`h-2 w-2 shrink-0 rounded-full ${item.dot}`}
                                    />
                                ) : (
                                    item.icon && <item.icon />
                                )}
                                <span>{item.title}</span>
                                {item.count != null && (
                                    <span className="ml-auto font-mono text-xs text-indigo-300/70">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}