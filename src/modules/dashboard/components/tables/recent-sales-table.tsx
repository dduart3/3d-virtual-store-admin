
import { useOrders } from "../../hooks/useOrders";

export function RecentSalesTable() {
    const { data: ordersData, isLoading, error } = useOrders({
        page: 1,
        pageSize: 5
    });

    if (isLoading) {
        return <div>Cargando ordenes...</div>;
    }

    if (error) {
        return <div>Error al cargar las ordenes.</div>;
    }


    const recentOrders = ordersData?.orders.slice(0, 5);

    return (
        <div className="space-y-8">
            {recentOrders?.map((order) => (
                <div key={order.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {order.profile.username || 'Usuario Desconocido'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {order.profile.email || 'Sin email'}
                        </p>
                    </div>
                    <div className="ml-auto font-medium">
                        +${Number(order.total).toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecentSalesTable;