import { ForwardRefExoticComponent, SVGProps, RefAttributes } from "react";

export type NavLink = {
    name: string;
    href: string;
    icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & { title?: string | undefined; titleId?: string | undefined; } & RefAttributes<SVGSVGElement>>;
  };