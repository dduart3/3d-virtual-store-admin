import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { PopulatedProduct } from '../../types/products'
import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useSections } from '@/modules/sections/hooks/use-sections'
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query'


const productFormSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  description: z.string().min(1, 'Descripcion es requerido'),
  price: z.string()
    .min(1, 'Precio es requerido')
    .refine((val) => parseFloat(val) >= 0, {
      message: 'El precio no puede ser negativo',
    }),
  stock: z.string()
    .min(1, 'Stock es requerido')
    .refine((val) => parseInt(val) >= 0, {
      message: 'El stock no puede ser negativo',
    }),
  section_id: z.string().min(1, 'Seccion es requerido'),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentProduct: PopulatedProduct
  onProductUpdated?: () => void
}

export function ProductEditDialog({ open, onOpenChange, currentProduct }: Props) {
  const queryClient = useQueryClient();
  const { sections, isLoading, refreshSections } = useSections();

  const dialogOpenedRef = useRef(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: currentProduct.name,
      description: currentProduct.description,
      price: currentProduct.price.toString(),
      stock: currentProduct.stock.toString(),
      section_id: currentProduct.section_id,
    },
  });


  useEffect(() => {
    if (currentProduct) {
      form.reset({
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price.toString(),
        stock: currentProduct.stock.toString(),
        section_id: currentProduct.section_id,
      });
    }
  }, [currentProduct, form]);

  useEffect(() => {
    if (open && !dialogOpenedRef.current) {
      refreshSections();
      dialogOpenedRef.current = true;
    }

    if (!open) {
      dialogOpenedRef.current = false;
    }
  }, [open, refreshSections]);

  const onSubmit = async (data: ProductFormValues) => {
    try {


      const { error } = await supabase
        .from('products')
        .update({
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          stock: parseInt(data.stock),
          section_id: data.section_id,
          updated_at: new Date().toISOString(),

        })
        .eq('id', currentProduct.id);


      if (error) {
        throw new Error(error.message);
      }

      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['products-populated'] });

      toast({
        title: 'Producto actualizado',
        description: 'El producto se ha actualizado correctamente.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Hubo un error al actualizar el producto.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type='number' step='0.01' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='section_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seccion</FormLabel>
                  <FormControl>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      items={sections}
                      isControlled
                      disabled={isLoading}
                      placeholder={isLoading ? "Cargando secciones..." : "Selecciona una sección"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end space-x-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type='submit'>Guardar Cambios</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}