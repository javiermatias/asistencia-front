import ProtectedRoleLayout from "@/app/ui/layout/ProtectedRoleLayout";
// src/app/admin/layout.tsx
// This layout will wrap all pages inside the /admin route segment,
// e.g., /admin/dashboard, /admin/empleados, etc.

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // We wrap the children with our protected layout and specify the role.
    <ProtectedRoleLayout requiredRole="supervisor">
      {children}
    </ProtectedRoleLayout>
  );
}