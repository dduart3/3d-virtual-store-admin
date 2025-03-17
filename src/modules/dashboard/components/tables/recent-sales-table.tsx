
import { useOrders } from "../../hooks/useOrders";

export function RecentSalesTable() {
    const { data: ordersData, isLoading, error } = useOrders({ page: 1, pageSize: 5 });

    if (isLoading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div>Error loading orders</div>;
    }

    return (
        <div className="space-y-8">
            {ordersData?.orders.map((order) => (
                <div key={order.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {order.profile.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {order.profile.email}
                        </p>
                    </div>
                    <div className="ml-auto font-medium">+${order.total.toFixed(2)}</div>
                </div>
            ))}
        </div>
    );
}

export default RecentSalesTable;