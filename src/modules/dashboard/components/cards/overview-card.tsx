import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import OverviewChart from "../charts/overview-chart";

function OverviewCard() {
    return (
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <OverviewChart />
            </CardContent>
        </Card>
    )
}

export default OverviewCard;