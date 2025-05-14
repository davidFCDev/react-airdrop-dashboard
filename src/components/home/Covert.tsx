import { Image } from "@heroui/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const coverageBlocks = [
  {
    image: {
      src: "/images/new-airdrops.png",
      alt: "New Airdrops",
      width: 200,
      height: 200,
    },
    title: "home.coverage.new_airdrops.title",
    descriptions: [
      "home.coverage.new_airdrops.desc1",
      "home.coverage.new_airdrops.desc2",
    ],
  },
  {
    image: {
      src: "/images/chat.png",
      alt: "Live Chat",
      width: 200,
      height: 200,
    },
    title: "home.coverage.live_chat.title",
    descriptions: ["home.coverage.live_chat.desc1"],
  },
  {
    image: {
      src: "/images/chart.png",
      alt: "Investment Chart",
      width: 200,
      height: 200,
    },
    title: "home.coverage.track_profits.title",
    descriptions: [
      "home.coverage.track_profits.desc1",
      "home.coverage.track_profits.desc2",
    ],
  },
];

const Covert = () => {
  const { t } = useTranslation();
  const coverageRef = useRef(null);
  const isCoverageInView = useInView(coverageRef, {
    once: true,
    amount: 0.3,
  });

  return (
    <section
      ref={coverageRef}
      className="relative bg-secondary-100 text-left p-1 xs:p-2 sm:p-4 w-full min-h-[600px]"
    >
      <div className="relative z-15">
        <h4 className="text-[5rem] xs:text-[5rem] sm:text-[7rem] md:text-[10rem] 2xl:text-[12rem] font-bold leading-none">
          {t("home.coverage.title")}
        </h4>
      </div>
      <div className="flex flex-col xs:flex-col sm:flex-col md:flex-row justify-between items-start gap-2 xs:gap-2 sm:gap-4 md:gap-14 px-1 py-2 xs:px-1 xs:py-2 sm:px-2 sm:py-4 md:px-20 md:py-16 w-full">
        {coverageBlocks.map((block, index) => (
          <motion.div
            key={block.title}
            animate={isCoverageInView ? { opacity: 1, y: 0 } : {}}
            className="flex flex-col items-start gap-4 max-w-sm 2xl:max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Image
              alt={block.image.alt}
              className="xs:w-[150px] xs:h-[150px] sm:w-[200px] sm:h-[200px] md:w-[200px] md:h-[200px]"
              height={150}
              src={block.image.src}
              width={150}
            />
            <h2 className="text-2xl xs:text-2xl sm:text-4xl md:text-5xl font-bold text-primary">
              {t(block.title)}
            </h2>
            {block.descriptions.map((desc) => (
              <p
                key={desc}
                className="text-lg xs:text-lg sm:text-xl md:text-2xl font-light"
              >
                {t(desc)}
              </p>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Covert;
