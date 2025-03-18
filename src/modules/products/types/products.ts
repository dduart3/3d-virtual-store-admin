export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface BaseProduct {
    id: string;
    name: string;
    price: number;
    description: string;
    section_id: string;
    stock: number;
    thumbnail: string;  // Changed from thumbnail_path
    created_at: string;
    updated_at: string;
}

export interface Section {
    id: string;
    name: string;
}

export interface Model {
    id: string;
    path: string;
    thumbnail_path: string;
    scale: number[];
    position: number[];
    rotation: number[];
    product_id: string;
}

export interface PopulatedProduct extends BaseProduct {
    section: Section;
    model: Model | null;
}

export interface TableProduct {
    id: string;
    name: string;
    price: number;
    stock: number;
    status: ProductStatus;
    thumbnail: string;
}

export interface ProductsBySection {
    [key: string]: TableProduct[];
}

export interface ProductsTableProps {
    section: string;
    products: TableProduct[];
    onEdit?: (productId: string) => void;
    onDelete?: (productId: string) => void;
}

export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface ProductsResult {
    products: PopulatedProduct[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

// Type aliases for compatibility
export type Product = BaseProduct;
export type ProductWithRelations = PopulatedProduct;