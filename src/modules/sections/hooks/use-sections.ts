import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Section, SectionOption } from '../types/sections';
import { toast } from '@/hooks/use-toast';

export function useSections() {
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Usar useCallback para evitar recreaciones innecesarias de la función
  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('sections').select('id, name');
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data) {
        throw new Error('No se encontraron secciones');
      }
      
      // Transformar los datos para el formato que espera SelectDropdown
      const formattedSections = data.map((section: Section) => ({
        label: section.name,
        value: section.id
      }));
      
      setSections(formattedSections);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las secciones.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []); // Sin dependencias para que no se recree

  // Cargar secciones solo una vez al montar el componente
  useEffect(() => {
    fetchSections();
  }, [fetchSections]); // fetchSections es estable gracias a useCallback

  return { sections, isLoading, refreshSections: fetchSections };
}