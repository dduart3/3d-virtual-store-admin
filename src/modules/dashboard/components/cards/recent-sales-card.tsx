import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import RecentSalesTable from "../tables/recent-sales-table";

function RecentSalesCard() {



    return (


        <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle>Ordenes Recientes</CardTitle>
                <CardDescription>

                </CardDescription>
            </CardHeader>
            <CardContent>
                <RecentSalesTable />
            </CardContent>
        </Card>
    );
}

export default RecentSalesCard;