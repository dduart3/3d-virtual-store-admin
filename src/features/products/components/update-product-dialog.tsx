import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ProductWithExtras } from '../data/schema'
import {
  useUpdateProduct,
  useProductModels,
  useUpdateModel,
  useCreateModel,
  getProductModelUrl,
} from '../hooks/useProducts'
import { useSections } from '../hooks/useProducts'
import { ProductViewerModal } from '../../product-viewer/ProductViewerModal'

interface UpdateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductWithExtras
  thumbnailUrl?: string
}

export function UpdateProductDialog({
  open,
  onOpenChange,
  product,
  thumbnailUrl,
}: UpdateProductDialogProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price.toString(),
    stock: product.stock.toString(),
    section_id: product.section_id,
    description: product.description,
  });

  // File state
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(undefined);
  const [modelFile, setModelFile] = useState<File | undefined>(undefined);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(thumbnailUrl || null);

  // Model viewer state
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [modelPreviewUrl, setModelPreviewUrl] = useState<string | undefined>(undefined);
  const [modelConfig, setModelConfig] = useState({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
  });

  // Loading and error states
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch sections for dropdown
  const { data: sections, isLoading: sectionsLoading } = useSections()

  // Fetch existing model for this product
  const { data: models } = useProductModels(product.id)
  const existingModel = models?.[0]

  // Mutations
  const updateProduct = useUpdateProduct()
  const updateModel = useUpdateModel()
  const createModel = useCreateModel()


  // Update form data when product changes
  useEffect(() => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      section_id: product.section_id,
      description: product.description,
    })

    if (thumbnailUrl) {
      setThumbnailPreview(thumbnailUrl)
    }
  }, [product, thumbnailUrl])

  // Update model config when existing model is loaded
  useEffect(() => {
    if (existingModel) {
      setModelConfig({
        position: existingModel.position,
        rotation: existingModel.rotation ?? [0, 0, 0],
        scale: existingModel.scale ?? 1,
      })

    }
  }, [existingModel, setModelConfig])

  // Then in the useEffect:
  useEffect(() => {
    if (product.id && !modelFile) {
      setModelPreviewUrl(getProductModelUrl(product.id))
    }
  }, [product.id, modelFile])

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle section selection
  const handleSectionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, section_id: value }))
  }

  // Handle thumbnail file selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)

      // Create a preview URL
      const objectUrl = URL.createObjectURL(file)
      setThumbnailPreview(objectUrl)

      // Clean up the URL when the component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    }
  }

  // Handle model file selection
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setModelFile(file)

      // Create a temporary URL for the model preview
      const objectUrl = URL.createObjectURL(file)
      setModelPreviewUrl(objectUrl)

      // Clean up the URL when the component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)
    setError(null)

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.price ||
        !formData.stock ||
        !formData.section_id
      ) {
        throw new Error('Please fill in all required fields')
      }

      // Update the product
      await updateProduct.mutateAsync({
        product: {
          id: product.id,
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          section_id: formData.section_id,
          description: formData.description,
        },
        thumbnailFile,
        modelFile,
      })

      // Update or create the model configuration
      if (existingModel) {
        // Update existing model
        console.log('Updating model:', existingModel)
        await updateModel.mutateAsync({
          id: existingModel.id,
          product_id: product.id,
          position: modelConfig.position,
          rotation: modelConfig.rotation,
          scale: modelConfig.scale,
        })
      } else if (modelFile) {
        // Create new model
        await createModel.mutateAsync({
          product_id: product.id,
          position: modelConfig.position,
          rotation: modelConfig.rotation,
          scale: modelConfig.scale,
        })
      }

      onOpenChange(false)
    } catch (error) {
      console.error('Error updating product:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Error updating product. Please try again.'
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Actualizar producto</DialogTitle>
          <DialogDescription>
            Modifica los detalles del producto.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className='rounded-md border border-destructive bg-destructive/15 p-3 text-sm text-destructive'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Nombre
            </Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              className='col-span-3'
              disabled={isUploading}
              required
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='price' className='text-right'>
              Precio
            </Label>
            <Input
              id='price'
              name='price'
              type='number'
              step='0.01'
              min='0'
              value={formData.price}
              onChange={handleInputChange}
              className='col-span-3'
              disabled={isUploading}
              required
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='stock' className='text-right'>
              Stock
            </Label>
            <Input
              id='stock'
              name='stock'
              type='number'
              min='0'
              value={formData.stock}
              onChange={handleInputChange}
              className='col-span-3'
              disabled={isUploading}
              required
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='section' className='text-right'>
              Sección
            </Label>
            <Select
              value={formData.section_id}
              onValueChange={handleSectionChange}
              disabled={isUploading || sectionsLoading}
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Selecciona una sección' />
              </SelectTrigger>
              <SelectContent>
                {sections?.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-4 items-start gap-4'>
            <Label htmlFor='description' className='pt-2 text-right'>
              Descripción
            </Label>
            <Textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='col-span-3'
              rows={4}
              disabled={isUploading}
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='thumbnail' className='text-right'>
              Imagen
            </Label>
            <div className='col-span-3'>
              <Input
                id='thumbnail'
                type='file'
                accept='image/*'
                onChange={handleThumbnailChange}
                disabled={isUploading}
              />
              {thumbnailPreview && (
                <div className='mt-2'>
                  <img
                    src={thumbnailPreview}
                    alt='Thumbnail preview'
                    className='h-32 rounded border object-contain'
                  />
                </div>
              )}
            </div>
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='model' className='text-right'>
              Modelo 3D
            </Label>
            <div className='col-span-3'>
              <Input
                id='model'
                type='file'
                accept='.glb,.gltf'
                onChange={handleModelChange}
                disabled={isUploading}
              />
              {(modelFile || modelPreviewUrl) && (
                <div className='mt-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsViewerOpen(true)}
                    className='w-full'
                  >
                    {existingModel
                      ? 'Editar configuración del modelo 3D'
                      : 'Configurar modelo 3D'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isUploading}>
              {isUploading ? 'Actualizando...' : 'Actualizar producto'}
            </Button>
          </DialogFooter>
        </form>

        {/* Model Viewer Modal */}
        {modelPreviewUrl && (
          <ProductViewerModal
            open={isViewerOpen}
            onOpenChange={setIsViewerOpen}
            modelUrl={modelPreviewUrl}
            initialConfig={modelConfig} // Pass the current modelConfig
            onSave={(config) => {
              setModelConfig(config)
              console.log('Model config updated:', config)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
