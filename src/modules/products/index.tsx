import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { Layout } from "@/components/layout/layout";
import RevenueCard from "../dashboard/components/cards/revenue-card";
import SalesCard from "../dashboard/components/cards/sales-card";
import ClientsCard from "../dashboard/components/cards/clients-card";
import ActiveUsersCard from "../dashboard/components/cards/active-users-card";
import OverviewCard from "../dashboard/components/cards/overview-card";
import RecentSalesCard from "../dashboard/components/cards/recent-sales-card";


export default function products() {
    const [activeTab, setActiveTab] = useState("products");
    const headerContent = (
        <>

            <div className="ml-auto flex items-center space-x-4">
                <Search />
                <ThemeSwitch />
                <ProfileDropdown />
            </div>
        </>
    );

    return (
        <Layout header={headerContent}>
            <div className="mb-2 flex items-center justify-between space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
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
                <TabsContent value="overview" className="space-y-4">
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


        </Layout >
    );
}

