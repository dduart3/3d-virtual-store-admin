import { atom } from 'jotai';
import { PopulatedOrder, OrdersResult } from '../types/orders';

export const recentOrdersAtom = atom<PopulatedOrder[]>([]);
export const ordersLoadingAtom = atom(false);
export const ordersResultAtom = atom<OrdersResult | null>(null);