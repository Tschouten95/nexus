import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center">
            <AppLogoIcon className="size-8 text-sidebar-primary" />
            <div className="ml-3 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Nexus
                </span>
            </div>
        </div>
    );
}