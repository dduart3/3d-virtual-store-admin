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
import { useToast } from '@/hooks/use-toast'
import { useSections } from '@/modules/sections/hooks/use-sections'
import { supabase } from '@/lib/supabase'
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
    onProductAdded?: () => void
}

export function ProductAddDialog({ open, onOpenChange }: Props) {
    const { toast } = useToast()
    const queryClient = useQueryClient();
    const { sections, isLoading } = useSections()

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: '',
            description: '',
            price: '',
            stock: '',
            section_id: '',
        },
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            
            const { data: existingProduct, error: checkError } = await supabase
                .from('products')
                .select('id')
                .eq('name', data.name)
                .single()

            if (checkError && checkError.code !== 'PGRST116') {
                throw new Error(checkError.message)
            }

            if (existingProduct) {
                toast({
                    title: "Error",
                    description: "Ya existe un producto con este nombre.",
                    variant: "destructive",
                })
                return
            }

            const { error } = await supabase
                .from('products')
                .insert({
                    name: data.name,
                    description: data.description,
                    price: parseFloat(data.price),
                    stock: parseInt(data.stock),
                    section_id: data.section_id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })

            if (error) {
                throw new Error(error.message)
            }

            onOpenChange(false)

            queryClient.invalidateQueries({ queryKey: ['products-populated'] });

            toast({
                title: "Producto agregado",
                variant: "success",
                description: "El producto se ha agregado correctamente.",
            })
        } catch (error) {
            console.error('Error adding product:', error)
            toast({
                title: "Error",
                description: "Hubo un error al agregar el producto.",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Agregar Producto</DialogTitle>
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
                                        <FormLabel>Disponibilidad</FormLabel>
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
                            <Button type='submit'>Agregar Producto</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}