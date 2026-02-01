
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface TestimonialWork {
  id: string;
  testimonial_id: string;
  image_url: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string | null;
  message: string;
  image_url: string | null;
  rating: number | null;
  is_published: boolean;
  created_at: string;
  testimonial_works?: TestimonialWork[];
}

export const useTestimoni = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('testimonials')
        .select('*, testimonial_works(*)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Helper to upload image to Supabase Storage
   * Returns the public URL of the uploaded file
   */
  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      // Generate a unique file name to avoid overwrites
      const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ruang-imaji')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ruang-imaji')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error(`Upload error in folder ${folder}:`, err);
      return null;
    }
  };

  /**
   * Orchestrates the submission of a new testimonial including files
   */
  const submitTestimonial = async (
    payload: { client_name: string; client_title?: string; message: string; rating: number },
    profileFile?: File,
    workFiles: File[] = []
  ) => {
    try {
      let profileUrl = null;

      // 1. Upload Profile Picture if exists
      if (profileFile) {
        profileUrl = await uploadImage(profileFile, 'avatars');
      }

      // 2. Insert main testimonial
      const { data: testimonial, error: insertError } = await supabase
        .from('testimonials')
        .insert([{
          client_name: payload.client_name,
          client_title: payload.client_title || null,
          message: payload.message,
          rating: payload.rating,
          image_url: profileUrl,
          is_published: true // Default to true as per trigger logic or business requirement
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      if (!testimonial) throw new Error('Failed to retrieve inserted testimonial');

      // 3. Upload and Insert Project Works if any
      if (workFiles.length > 0) {
        const uploadPromises = workFiles.slice(0, 3).map(file => uploadImage(file, 'works'));
        const uploadedUrls = await Promise.all(uploadPromises);
        
        const validUrls = uploadedUrls.filter((url): url is string => url !== null);
        
        if (validUrls.length > 0) {
          const worksData = validUrls.map(url => ({
            testimonial_id: testimonial.id,
            image_url: url
          }));

          const { error: worksError } = await supabase
            .from('testimonial_works')
            .insert(worksData);

          if (worksError) {
            console.error('Error inserting testimonial works:', worksError);
            // Non-fatal for the main testimonial, but logged
          }
        }
      }

      // 4. Refresh the list
      await fetchTestimonials();
      return { success: true };
    } catch (err) {
      console.error('Submission failed:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Gagal mengirim testimoni' 
      };
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return { testimonials, loading, error, submitTestimonial, refresh: fetchTestimonials };
};
