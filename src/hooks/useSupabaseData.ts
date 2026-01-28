
// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\hooks\useSupabaseData.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Types based on database schema
export interface Brand {
  id: string;
  name: string;
  row_position: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface HeroSlide {
  id: number;
  location: string;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
  category: string;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  discount: string;
  color: string;
  created_at: string;
  features?: PackageFeature[];
}

export interface PackageFeature {
  id: string;
  package_id: string;
  type: 'photo' | 'video';
  feature: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'Photo' | 'Video';
  image_url: string;
  video_url: string | null;
  aspect_ratio: 'landscape' | 'portrait';
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  label: string;
  order_index: number;
  created_at: string;
}

// Hook for fetching brands
export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .order('row_position', { ascending: true });

        if (error) throw error;
        setBrands(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brands');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Split brands into rows based on row_position
  const brandsRow1 = brands.filter(b => b.row_position === 1).map(b => b.name);
  const brandsRow2 = brands.filter(b => b.row_position === 2).map(b => b.name);

  return { brands, brandsRow1, brandsRow2, loading, error };
};

// Hook for fetching categories
export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .order('name', { ascending: true });

        if (error) throw error;
        setCategories(data?.map(c => c.name) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Hook for fetching hero slides
export const useHeroSlides = () => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        setHeroSlides(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hero slides');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSlides();
  }, []);

  return { heroSlides, loading, error };
};

// Hook for fetching packages with features
export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Fetch packages
        const { data: packagesData, error: packagesError } = await supabase
          .from('packages')
          .select('*')
          .order('created_at', { ascending: true });

        if (packagesError) throw packagesError;

        // Fetch all package features
        const { data: featuresData, error: featuresError } = await supabase
          .from('package_features')
          .select('*');

        if (featuresError) throw featuresError;

        // Combine packages with their features
        const packagesWithFeatures = packagesData?.map(pkg => ({
          ...pkg,
          features: featuresData?.filter(f => f.package_id === pkg.id) || []
        })) || [];

        setPackages(packagesWithFeatures);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Transform packages to match the old format
  const formattedPackages = packages.map(pkg => ({
    name: pkg.name,
    price: pkg.price,
    discount: pkg.discount,
    color: pkg.color || 'border-[#c5a059]/10',
    deliverables: {
      photo: pkg.features?.filter(f => f.type === 'photo').map(f => f.feature) || [],
      video: pkg.features?.filter(f => f.type === 'video').map(f => f.feature) || []
    }
  }));

  return { packages: formattedPackages, loading, error };
};

// Hook for fetching projects (portfolio items)
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Organize projects by type
  const portfolioData = {
    Photo: projects.filter(p => p.type === 'Photo'),
    Video: projects.filter(p => p.type === 'Video')
  };

  return { projects, portfolioData, loading, error };
};

// Hook for fetching team members
export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setTeamMembers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, error };
};
