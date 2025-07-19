import SideNav from "@/app/components/navigation/SideNav";
import { NavLink } from "@/app/types/nav-link";
import { DocumentDuplicateIcon, HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";


export default function Layout({ children }: { children: React.ReactNode }) {
    const agentLinks: NavLink[] = [
        { name: 'Home', href: '/admin/dashboard', icon: HomeIcon },
        {
          name: 'Despachos',
          href: '/admin/despacho', // I've updated the href for clarity
          icon: DocumentDuplicateIcon,
        },
        { name: 'Clientes', href: '/admin/clientes', icon: UserGroupIcon },
      ];
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav links={agentLinks} />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}