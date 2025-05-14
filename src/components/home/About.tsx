import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-secondary-200 text-left p-1 xs:p-2 sm:p-4 w-full min-h-[600px]">
      <div className="relative z-15">
        <h4 className="text-[5rem] xs:text-[5rem] sm:text-[7rem] md:text-[10rem] 2xl:text-[12rem] font-bold leading-none">
          {t("home.slogan.search")}
          <br />
          <span className="text-secondary-500">{t("home.slogan.manage")}</span>
          <br />
          <span className="text-secondary-50">{t("home.slogan.track")}</span>
        </h4>
      </div>
      <div className="relative z-15 flex flex-col items-start gap-4 px-1 py-2 xs:px-1 xs:py-2 sm:px-2 sm:py-4 md:px-20 md:py-16 w-full max-w-4xl 2xl:max-w-6xl">
        <h3 className="text-2xl xs:text-2xl sm:text-4xl md:text-5xl font-light">
          {t("home.slogan.subtitle")}
        </h3>
        <Link href="/airdrops" title="Airdrops">
          <Button
            className="w-full font-semibold sm:w-auto"
            color="primary"
            radius="lg"
            size="lg"
            variant="solid"
          >
            {t("navbar.airdrops")}
          </Button>
        </Link>
      </div>
      <div className="absolute right-0 bottom-0 z-10 xs:scale-40 sm:scale-50 md:scale-75 lg:scale-75 2xl:scale-100 origin-bottom-right">
        <Image alt="Cat" height={750} src="/images/cat.png" width={750} />
      </div>
      <AnimatePresence>
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-[35%] top-0 lg:right-[30%] lg:top-[5%] z-10 xs:scale-40 sm:scale-50 md:scale-75 lg:scale-75 2xl:scale-100 origin-bottom-left"
          exit={{ opacity: 0, scale: 0.8 }}
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <motion.div
            animate={{ y: [-10, 10] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5 + Math.random() * 1.5,
              delay: Math.random(),
              ease: "easeInOut",
            }}
          >
            <Image
              alt="Bocadillo"
              height={350}
              src="/images/bocadillo.png"
              width={350}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default About;
