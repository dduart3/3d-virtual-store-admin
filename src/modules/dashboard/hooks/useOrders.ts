import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { OrdersResult, PopulatedOrder, Profile, OrderItem, PaginationParams } from "../types/orders";

export function useRecentOrders() {
    return useQuery({
        queryKey: ["orders", "recent"],
        queryFn: async (): Promise<PopulatedOrder[]> => {
            const { data: orders, error } = await supabase
                .from("orders")
                .select('*, profiles(*)')
                .order("created_at", { ascending: false })
                .limit(5);

            if (error) {
                throw new Error(`Error fetching orders: ${error.message}`);
            }

            if (!orders) return [];

            return orders.map((order) => ({
                ...order,
                items: [],
                profile: order.profiles || {
                    id: order.user_id,
                    username: 'Unknown User',
                    email: 'unknown@email.com'
                }
            }));
        },
        refetchInterval: 5 * 60 * 1000,
        staleTime: 60 * 1000,
    });
}

export function useOrders(pagination: PaginationParams = { page: 1, pageSize: 10 }) {
    return useQuery<OrdersResult>({
        queryKey: ['orders-populated', pagination.page, pagination.pageSize],
        queryFn: async () => {
            const from = (pagination.page - 1) * pagination.pageSize;
            const to = from + pagination.pageSize - 1;

            // Get total count of all orders
            const { count, error: countError } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;
            const totalCount = count || 0;

            // Fetch all orders without user filtering
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .range(from, to);

            if (ordersError) throw ordersError;
            if (!orders || orders.length === 0) {
                return {
                    orders: [],
                    totalCount,
                    totalPages: Math.ceil(totalCount / pagination.pageSize),
                    currentPage: pagination.page
                };
            }

            // Get profiles
            const userIds = [...new Set(orders.map(order => order.user_id))];
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .in('id', userIds);

            if (profilesError) throw profilesError;

            const profilesMap = (profiles || []).reduce((map, profile) => {
                map[profile.id] = profile;
                return map;
            }, {} as Record<string, Profile>);

            // Get order items
            const orderIds = orders.map(order => order.id);
            const { data: orderItems, error: itemsError } = await supabase
                .from('order_items')
                .select('*, products(name, thumbnail_path)')
                .in('order_id', orderIds);

            if (itemsError) throw itemsError;

            const orderItemsMap = (orderItems || []).reduce((map, item) => {
                if (!map[item.order_id]) {
                    map[item.order_id] = [];
                }
                map[item.order_id].push({
                    ...item,
                    product_name: item.products?.name || 'Unknown Product',
                });
                return map;
            }, {} as Record<string, OrderItem[]>);

            const populatedOrders = orders.map(order => ({
                ...order,
                items: orderItemsMap[order.id] || [],
                profile: profilesMap[order.user_id] || {
                    id: order.user_id,
                    username: 'Unknown User',
                    email: 'unknown@example.com'
                }
            }));

            return {
                orders: populatedOrders,
                totalCount,
                totalPages: Math.ceil(totalCount / pagination.pageSize),
                currentPage: pagination.page
            };
        }
    });
}

export function useOrder(orderId: string | undefined) {
    return useQuery<PopulatedOrder | null>({
        queryKey: ['order-populated', orderId],
        queryFn: async () => {
            if (!orderId) return null;

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (orderError) throw orderError;
            if (!order) return null;

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', order.user_id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                throw profileError;
            }

            const { data: orderItems, error: itemsError } = await supabase
                .from('order_items')
                .select('*, products(name, thumbnail_path)')
                .eq('order_id', orderId);

            if (itemsError) throw itemsError;

            const processedItems = (orderItems || []).map(item => ({
                ...item,
                product_name: item.products?.name || 'Unknown Product',
            }));

            return {
                ...order,
                items: processedItems,
                profile: profile || {
                    id: order.user_id,
                    username: 'Unknown User',
                    email: 'unknown@example.com'
                }
            };
        },
        enabled: !!orderId
    });
}
