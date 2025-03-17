import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useOrders } from "../../hooks/useOrders";
import RecentSalesTable from "../tables/recent-sales-table";

function RecentSalesCard() {
    const { data } = useOrders({ page: 1, pageSize: 5 });
    const totalOrders = data?.totalCount || 0;

    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle>Ordenes Recientes</CardTitle>
                <CardDescription>
                    Tienes un total de {totalOrders} ordenes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RecentSalesTable />
            </CardContent>
        </Card>
    );
}

export default RecentSalesCard;