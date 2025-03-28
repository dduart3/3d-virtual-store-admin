import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useCreateProduct, useCreateModel } from "../hooks/useProducts";
import { useSections } from "../hooks/useProducts";
import { ProductViewerModal } from "./viewer/ProductViewerModal";

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductDialog({
  open,
  onOpenChange,
}: CreateProductDialogProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    section_id: "",
    description: "",
  });

  // File state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | undefined>(undefined);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  // Model viewer state
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [modelPreviewUrl, setModelPreviewUrl] = useState<string | undefined>(undefined);
  const [modelConfig, setModelConfig] = useState({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
  });

  // Loading and error states
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sections for dropdown
  const { data: sections, isLoading: sectionsLoading } = useSections();
  
  // Mutations
  const createProduct = useCreateProduct();
  const createModel = useCreateModel();

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle section selection
  const handleSectionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, section_id: value }));
  };

  // Handle thumbnail file selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setThumbnailPreview(objectUrl);
      
      // Clean up the URL when the component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Handle model file selection
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelFile(file);
      
      // Create a temporary URL for the model preview
      const objectUrl = URL.createObjectURL(file);
      setModelPreviewUrl(objectUrl);
      
      // Clean up the URL when the component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      section_id: "",
      description: "",
    });
    setThumbnailFile(null);
    setModelFile(undefined);
    setThumbnailPreview(null);
    setModelPreviewUrl(undefined);
    setModelConfig({
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
    });
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.stock || !formData.section_id) {
        throw new Error("Please fill in all required fields");
      }
      
      if (!thumbnailFile) {
        throw new Error("Please upload a thumbnail image");
      }
      
      // Create the product
      const newProduct = await createProduct.mutateAsync({
        product: {
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          section_id: formData.section_id,
          description: formData.description,
        },
        thumbnailFile,
        modelFile,
      });
      
      // If we have a model file, create the model configuration
      if (modelFile && newProduct.id) {
        await createModel.mutateAsync({
          product_id: newProduct.id,
          position: modelConfig.position,
          rotation: modelConfig.rotation,
          scale: modelConfig.scale,
        });
      }
      
      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating product:", error);
      setError(error instanceof Error ? error.message : "Error creating product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nuevo producto</DialogTitle>
          <DialogDescription>
            Completa los detalles del producto para añadirlo a la tienda.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/15 border border-destructive text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={isUploading}
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Precio
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={isUploading}
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={isUploading}
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="section" className="text-right">
              Sección
            </Label>
            <Select
              value={formData.section_id}
              onValueChange={handleSectionChange}
              disabled={isUploading || sectionsLoading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona una sección" />
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
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Descripción
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="col-span-3"
              rows={4}
              disabled={isUploading}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="thumbnail" className="text-right">
              Imagen
            </Label>
            <div className="col-span-3">
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={isUploading}
                required
              />
              {thumbnailPreview && (
                <div className="mt-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="h-32 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Modelo 3D
            </Label>
            <div className="col-span-3">
              <Input
                id="model"
                type="file"
                accept=".glb,.gltf"
                onChange={handleModelChange}
                disabled={isUploading}
              />
              {modelFile && (
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsViewerOpen(true)}
                    className="w-full"
                  >
                    Configurar modelo 3D
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Creando..." : "Crear producto"}
            </Button>
          </DialogFooter>
        </form>
        
        {/* Model Viewer Modal */}
        {modelPreviewUrl && (
          <ProductViewerModal
            open={isViewerOpen}
            onOpenChange={setIsViewerOpen}
            modelUrl={modelPreviewUrl}
            onSave={(config) => {
              setModelConfig(config);
              console.log("Model config saved:", config);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
