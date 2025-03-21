import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { ProductEditDialog } from './dialogs/product-edit-dialog';
import { PopulatedProduct } from '../types/products';


export function ProductList() {
    const [products, setProducts] = useState<PopulatedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<PopulatedProduct | null>(null);


    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, sections(name)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los productos.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);


    const handleEditProduct = (product: PopulatedProduct) => {
        setCurrentProduct(product);
        setEditDialogOpen(true);
    };


    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) throw error;




            // Show success toast
            toast({
                title: 'Producto eliminado',
                description: 'El producto ha sido eliminado correctamente.',
                variant: 'default',
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el producto.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Sección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6}>Cargando productos...</td>
                        </tr>
                    ) : products.length === 0 ? (
                        <tr>
                            <td colSpan={6}>No hay productos disponibles</td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.stock}</td>
                                <td>{product.section?.name}</td>
                                <td>
                                    <button onClick={() => handleEditProduct(product)}>
                                        Editar
                                    </button>
                                    <button onClick={() => handleDeleteProduct(product.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>


            {currentProduct && (
                <ProductEditDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    currentProduct={currentProduct}
                    onProductUpdated={fetchProducts}
                />
            )}
        </div>
    );
}
