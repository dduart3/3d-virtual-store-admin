import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ProductsResult, PopulatedProduct, Section, Model, PaginationParams } from "../types/products";

export function useProducts(pagination: PaginationParams = { page: 1, pageSize: 10 }) {
    return useQuery<ProductsResult>({
        queryKey: ['products-populated', pagination.page, pagination.pageSize],
        queryFn: async () => {
            const from = (pagination.page - 1) * pagination.pageSize;
            const to = from + pagination.pageSize - 1;

            // Get total count
            const { count, error: countError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;
            const totalCount = count || 0;

            // Fetch products
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select(`
                    id,
                    name,
                    price,
                    stock,
                    description,
                    section_id,
                    thumbnail_path,
                    created_at,
                    updated_at
                `)
                .order('created_at', { ascending: false })
                .range(from, to);



            if (productsError) throw productsError;
            if (!products || products.length === 0) {
                return {
                    products: [],
                    totalCount,
                    totalPages: Math.ceil(totalCount / pagination.pageSize),
                    currentPage: pagination.page
                };
            }

            // Get sections
            const sectionIds = [...new Set(products.map(product => product.section_id))];
            const { data: sections, error: sectionsError } = await supabase
                .from('sections')
                .select('*')
                .in('id', sectionIds);

            if (sectionsError) throw sectionsError;

            const sectionsMap = (sections || []).reduce((map, section) => {
                map[section.id] = section;
                return map;
            }, {} as Record<string, Section>);

            // Get models
            const productIds = products.map(product => product.id);
            const { data: models, error: modelsError } = await supabase
                .from('models')
                .select('*')
                .in('product_id', productIds);

            if (modelsError) throw modelsError;

            const modelsMap = (models || []).reduce((map, model) => {
                map[model.product_id] = model;
                return map;
            }, {} as Record<string, Model>);

            const populatedProducts = products.map(product => {
                const populated = {
                    ...product,
                    section: sectionsMap[product.section_id] || {
                        id: product.section_id,
                        name: 'Unknown Section'
                    },
                    model: modelsMap[product.id] || null,
                    status: product.stock > 20 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"
                };
                console.log('Populated product:', { id: populated.id, name: populated.name, thumbnail: populated.thumbnail_path });
                return populated;
            });

            return {
                products: populatedProducts,
                totalCount,
                totalPages: Math.ceil(totalCount / pagination.pageSize),
                currentPage: pagination.page
            };
        }
    });
}

export function useProduct(productId: string | undefined) {
    return useQuery<PopulatedProduct | null>({
        queryKey: ['product-populated', productId],
        queryFn: async () => {
            if (!productId) return null;

            const { data: product, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (productError) throw productError;
            if (!product) return null;

            const { data: section, error: sectionError } = await supabase
                .from('sections')
                .select('*')
                .eq('id', product.section_id)
                .single();

            if (sectionError && sectionError.code !== 'PGRST116') {
                throw sectionError;
            }

            const { data: model, error: modelError } = await supabase
                .from('models')
                .select('*')
                .eq('product_id', productId)
                .single();

            if (modelError && modelError.code !== 'PGRST116') {
                throw modelError;
            }

            return {
                ...product,
                section: section || {
                    id: product.section_id,
                    name: 'Unknown Section'
                },
                model: model || null
            };
        },
        enabled: !!productId
    });
}