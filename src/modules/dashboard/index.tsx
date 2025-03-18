import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNav } from "@/components/layout/top-nav";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { Layout } from "@/components/layout/layout";


import RevenueCard from "./components/cards/revenue-card";
import SalesCard from "./components/cards/sales-card";
import ClientsCard from "./components/cards/clients-card";
import ActiveUsersCard from "./components/cards/active-users-card";
import OverviewCard from "./components/cards/overview-card";
import RecentSalesCard from "./components/cards/recent-sales-card";


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleNavigate = (href: string) => {
    // In a real app, you might use Tanstack Query's queryClient to fetch data here
    console.log(`Navigating to ${href}`);
  };

  const headerContent = (
    <>
      <TopNav links={topNav} onNavigate={handleNavigate} />
      <div className="ml-auto flex items-center space-x-4">
        <Search />
        <ThemeSwitch />
        <ProfileDropdown />
      </div>
    </>
  );

  return (
    <Layout header={headerContent}>
      <div className="flex flex-col h-full"> {/* Added pb-6 for bottom padding */}
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button>Download</Button>
          </div>
        </div>
        <Tabs
          orientation="vertical"
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="space-y-4 pb-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <RevenueCard />
              <SalesCard />
              <ClientsCard />
              <ActiveUsersCard />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <OverviewCard />
              <RecentSalesCard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

const topNav = [
  {
    title: "Overview",
    href: "dashboard/overview",
    isActive: true,
    disabled: false,
  },
  {
    title: "Customers",
    href: "dashboard/customers",
    isActive: false,
    disabled: true,
  },
  {
    title: "Products",
    href: "dashboard/products",
    isActive: false,
    disabled: true,
  },
  {
    title: "Settings",
    href: "dashboard/settings",
    isActive: false,
    disabled: true,
  },
];
