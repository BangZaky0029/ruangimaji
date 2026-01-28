
// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji-1\src\hooks\usePackages.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  packages: Package[];
}

export interface Package {
  id: string;
  service_id: string;
  name: string;
  tier: 'BASIC' | 'PREMIUM' | 'PRO';
  price_amount: number;
  discount_amount: number;
  color: string;
  is_popular: boolean;
  features: PackageFeature[];
}

export interface PackageFeature {
  id: string;
  package_id: string;
  feature_type_id: number;
  feature: string;
  order_index: number;
  type_code: string;
}

export const usePackages = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using Supabase joins to get everything in one go
        const { data, error: serviceError } = await supabase
            .from('services')
            .select(`
                id,
                name,
                slug,
                description,
                packages (
                id,
                service_id,
                name,
                tier,
                price_amount,
                discount_amount,
                color,
                is_popular,
                package_features!package_features_package_id_fkey (
                    id,
                    feature,
                    order_index,
                    package_feature_types (
                    code
                    )
                )
                )
            `)
            .order('name');


        if (serviceError) throw serviceError;

        // Transform the nested data into a flatter structure for the UI
        const formattedServices: Service[] = (data || []).map((service: any) => ({
          ...service,
          packages: (service.packages || []).map((pkg: any) => ({
            ...pkg,
            features: (pkg.package_features || []).map((f: any) => ({
              id: f.id,
              feature: f.feature,
              order_index: f.order_index,
              type_code: f.package_feature_types?.code || 'general'
            })).sort((a: any, b: any) => a.order_index - b.order_index)
          })).sort((a: any, b: any) => {
            const tiers = { 'BASIC': 1, 'PREMIUM': 2, 'PRO': 3 };
            return (tiers[a.tier as keyof typeof tiers] || 0) - (tiers[b.tier as keyof typeof tiers] || 0);
          })
        })).sort((a: any, b: any) => {
          // Manual sorting priority based on user request
          const getPriority = (name: string) => {
            const n = name.toUpperCase();
            if (n.includes('PREWEDDING')) return 1;
            if (n.includes('MEDSOS') || n.includes('SOCIAL')) return 2;
            if (n.includes('WEBSITE')) return 3;
            return 4;
          };
          return getPriority(a.name) - getPriority(b.name);
        });

        setServices(formattedServices);
      } catch (err) {
        console.error('Error fetching package data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { services, loading, error };
};
