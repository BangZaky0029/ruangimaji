// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\components\BrandCarousel.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useBrands } from '../hooks/useSupabaseData';

const BrandCarousel: React.FC = () => {
  const { brandsRow1, brandsRow2, loading } = useBrands();

  if (loading) {
    return (
      <section className="py-20 bg-[#fbfaf8] overflow-hidden border-b border-[#c5a059]/5">
        <div className="flex flex-col gap-10 items-center justify-center">
          <motion.img 
            src="public/imajiLogo.svg" 
            className="w-16 h-16" 
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1, 0.95] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#fbfaf8] overflow-hidden border-b border-[#c5a059]/5">
      <div className="flex flex-col gap-10">
        {/* Row 1 */}
        {brandsRow1.length > 0 && (
          <div className="relative flex">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex whitespace-nowrap gap-20"
            >
              {[...brandsRow1, ...brandsRow1].map((brand, i) => (
                <span key={i} className="text-5xl md:text-8xl font-bold tracking-tighter text-[#2d2a26]/5 hover:text-[#c5a059]/40 transition-colors cursor-default">
                  {brand}
                </span>
              ))}
            </motion.div>
          </div>
        )}

        {/* Row 2 */}
        {brandsRow2.length > 0 && (
          <div className="relative flex">
            <motion.div
              initial={{ x: "-50%" }}
              animate={{ x: 0 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="flex whitespace-nowrap gap-20"
            >
              {[...brandsRow2, ...brandsRow2].map((brand, i) => (
                <span key={i} className="text-5xl md:text-8xl font-bold tracking-tighter text-[#2d2a26]/5 hover:text-[#c5a059]/40 transition-colors cursor-default italic">
                  {brand}
                </span>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandCarousel;