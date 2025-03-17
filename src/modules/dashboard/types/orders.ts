export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  total: number;
}

export interface PopulatedOrder extends Order {
  items: OrderItem[];
  profile: Profile;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface OrdersResult {
  orders: PopulatedOrder[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}