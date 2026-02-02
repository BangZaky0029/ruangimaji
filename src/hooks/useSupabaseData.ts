
// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\hooks\useSupabaseData.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Existing types...
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

// New Portfolio Case Study Types
export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  live_url: string;
  preview_url: string | null;
  thumbnail_url: string;
  category: string;
  tech_stack: string[] | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioScreenshot {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

// Existing hooks...
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

  const brandsRow1 = brands.filter(b => b.row_position === 1).map(b => b.name);
  const brandsRow2 = brands.filter(b => b.row_position === 2).map(b => b.name);

  return { brands, brandsRow1, brandsRow2, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, created_at')
          .order('name', { ascending: true });

        if (error) throw error;
        setCategories(data || []);
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

// New Case Study Hook
export const usePortfolioProjects = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

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

  return { projects, loading, error };
};

export const usePortfolioScreenshots = (projectId: string | null) => {
  const [screenshots, setScreenshots] = useState<PortfolioScreenshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setScreenshots([]);
      return;
    }

    const fetchScreenshots = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('portfolio_screenshots')
          .select('*')
          .eq('project_id', projectId)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setScreenshots(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch screenshots');
      } finally {
        setLoading(false);
      }
    };

    fetchScreenshots();
  }, [projectId]);

  return { screenshots, loading, error };
};

// Renamed ProjectLegacy to Project to fix export-related errors in multiple components
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

export const useProjects = () => {
  // Updated type from ProjectLegacy to Project
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

  const portfolioData = {
    Photo: projects.filter(p => p.type === 'Photo'),
    Video: projects.filter(p => p.type === 'Video')
  };

  return { projects, portfolioData, loading, error };
};

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  label: string;
  order_index: number;
  created_at: string;
}

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
