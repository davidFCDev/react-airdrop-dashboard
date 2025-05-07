import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const stats = [
  { title: "home.stats.market_coverage", value: "100%" },
  { title: "home.stats.total_volume", value: "$7bn", suffix: "+" },
  { title: "home.stats.liquidity_sources", value: "15" },
  { title: "home.stats.networks", value: "100", suffix: "+" },
];

const Stats = () => {
  const { t } = useTranslation();
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={statsRef}
      className="flex flex-col items-center justify-center bg-secondary-500 text-secondary-100 p-1 xs:p-2 sm:p-4 md:p-10 lg:p-20"
    >
      <div className="flex items-center justify-between w-full gap-2 xs:gap-2 sm:gap-4 md:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            className="flex flex-col items-start leading-none"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h2 className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl font-bold">
              {t(stat.title)}
            </h2>
            <p className="text-[3rem] xs:text-[3rem] sm:text-[4rem] md:text-[6rem] font-bold">
              {stat.value}
              {stat.suffix && (
                <span className="text-[2rem] xs:text-[2rem] sm:text-[2.5rem] md:text-[3.5rem]">
                  {stat.suffix}
                </span>
              )}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
