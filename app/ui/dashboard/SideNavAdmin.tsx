import Link from "next/link";
import AcmeLogo from "@/app/ui/acme-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { handleSignOut } from "@/app/lib/actions";
import NavLinksAdmin from "@/app/ui/dashboard/NavLinksAdmin";

export default function SideNavAdmin() {
  return (
    // min-h-0 is important so inner overflow works
    <div className="flex h-full min-h-0 flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>

      {/* Container that grows and holds scrollable links + footer */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Scrollable area */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
          <NavLinksAdmin />
        </div>

        {/* Fixed footer (sign out) */}
        <form action={handleSignOut} className="mt-3">
          <button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <span className="hidden md:block">Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}
