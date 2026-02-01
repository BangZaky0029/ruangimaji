
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
  tier: string;
  price_amount: number;
  discount_amount: number;
  color: string;
  is_popular: boolean;
  features: PackageFeature[];
}

export interface PackageFeature {
  id: string;
  package_id: string;
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
        setError(null);

        // We use explicit constraint names from the schema to resolve ambiguity (PGRST201)
        // packages references services via packages_service_fk
        // package_features references packages via package_features_package_id_fkey
        // package_feature_types references package_features via package_features_type_fk
        const { data: servicesData, error: serviceError } = await supabase
          .from('services')
          .select(`
            id,
            name,
            slug,
            description,
            packages!packages_service_fk (
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
                package_feature_types!package_features_type_fk (
                  code
                )
              )
            )
          `)
          .order('name');

        if (serviceError) {
          console.warn('Gagal fetch services, mencoba fallback ke packages:', serviceError);
          
          const { data: pkgs, error: pkgError } = await supabase
            .from('packages')
            .select(`
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
                package_feature_types!package_features_type_fk (code)
              )
            `);

          if (pkgError) throw pkgError;

          if (pkgs && pkgs.length > 0) {
            const synthesizedService: Service = {
              id: 'default',
              name: 'Paket Produksi',
              slug: 'paket-produksi',
              description: 'Layanan produksi kreatif premium kami.',
              packages: pkgs.map((pkg: any) => ({
                ...pkg,
                price_amount: Number(pkg.price_amount || 0),
                discount_amount: Number(pkg.discount_amount || 0),
                features: (pkg.package_features || []).map((f: any) => ({
                  id: f.id,
                  feature: f.feature,
                  order_index: f.order_index,
                  type_code: f.package_feature_types?.code || 'general'
                })).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
              }))
            };
            setServices([synthesizedService]);
          } else {
            setServices([]);
          }
        } else {
          const formattedServices: Service[] = (servicesData || []).map((service: any) => ({
            ...service,
            packages: (service.packages || []).map((pkg: any) => ({
              ...pkg,
              price_amount: Number(pkg.price_amount || 0),
              discount_amount: Number(pkg.discount_amount || 0),
              features: (pkg.package_features || []).map((f: any) => ({
                id: f.id,
                feature: f.feature,
                order_index: f.order_index,
                type_code: f.package_feature_types?.code || 'general'
              })).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
            })).sort((a: any, b: any) => {
              const tiers: Record<string, number> = { 'BASIC': 1, 'PREMIUM': 2, 'PRO': 3 };
              const tierA = (a.tier || '').toUpperCase();
              const tierB = (b.tier || '').toUpperCase();
              return (tiers[tierA] || 99) - (tiers[tierB] || 99);
            })
          }));
          setServices(formattedServices);
        }
      } catch (err) {
        console.error('Error fetching package data:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat data paket');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { services, loading, error };
};
