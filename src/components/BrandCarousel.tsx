
import React from 'react';
import { motion } from 'framer-motion';
import { BRANDS_ROW_1, BRANDS_ROW_2 } from '../constants';

const BrandCarousel: React.FC = () => {
  return (
    <section className="py-20 bg-[#fbfaf8] overflow-hidden border-b border-[#c5a059]/5">
      <div className="flex flex-col gap-10">
        {/* Row 1 */}
        <div className="relative flex">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-20"
          >
            {[...BRANDS_ROW_1, ...BRANDS_ROW_1].map((brand, i) => (
              <span key={i} className="text-5xl md:text-8xl font-bold tracking-tighter text-[#2d2a26]/5 hover:text-[#c5a059]/40 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="relative flex">
          <motion.div
            initial={{ x: "-50%" }}
            animate={{ x: 0 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-20"
          >
            {[...BRANDS_ROW_2, ...BRANDS_ROW_2].map((brand, i) => (
              <span key={i} className="text-5xl md:text-8xl font-bold tracking-tighter text-[#2d2a26]/5 hover:text-[#c5a059]/40 transition-colors cursor-default italic">
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
