import { CreditCard, Key, LineChart, Users } from "lucide-react";
import type { ReactNode } from "react";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <nav className="p-4 space-y-2">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md text-sm font-medium">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </div>
          <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-md text-sm font-medium cursor-pointer">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </div>
          <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-md text-sm font-medium cursor-pointer">
            <Users className="h-4 w-4" />
            <span>Team</span>
          </div>
          <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-md text-sm font-medium cursor-pointer">
            <LineChart className="h-4 w-4" />
            <span>Usage</span>
          </div>
        </nav>
      </aside>

      {children}
    </div>
  );
}
