import { Image } from "@heroui/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const images = [
    {
      src: "/images/bitcoin.png",
      alt: "Bitcoin",
      width: 150,
      height: 150,
      style: { top: "25%", right: "40%" },
      mobileStyle: { top: "15%", right: "5%" },
      zIndex: 10,
      animation: {
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random(),
      },
    },
    {
      src: "/images/ethereum.png",
      alt: "Ethereum",
      width: 150,
      height: 150,
      style: { top: "30%", right: "17%" },
      mobileStyle: { top: "25%", right: "10%" },
      zIndex: 20,
      animation: {
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random(),
      },
    },
    {
      src: "/images/dolar.png",
      alt: "Dolar",
      width: 150,
      height: 150,
      style: { top: "50%", right: "30%" },
      mobileStyle: { top: "35%", right: "5%" },
      zIndex: 10,
      animation: {
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random(),
      },
    },
    {
      src: "/images/airdrops.png",
      alt: "Airdrops",
      width: 250,
      height: 250,
      style: { top: "65%", right: "8%" },
      mobileStyle: { top: "50%", right: "2%" },
      zIndex: 20,
      animation: {
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random(),
      },
    },
    {
      src: "/images/dolar2.png",
      alt: "Dolar2",
      width: 100,
      height: 100,
      style: { top: "40%", right: "15%" },
      mobileStyle: { top: "45%", right: "8%" },
      zIndex: 10,
      animation: {
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random(),
      },
    },
    {
      src: "/images/usdc.png",
      alt: "USDC",
      width: 100,
      height: 100,
      style: { top: "25%", right: "35%" },
      mobileStyle: { top: "20%", right: "2%" },
      zIndex: 10,
      animation: {
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random(),
      },
    },
  ];

  const { t } = useTranslation();

  return (
    <section className="relative h-[90vh] p-1 xs:p-2 sm:p-4">
      <div className="relative z-20 inline-block text-left">
        <h1 className="text-[6rem] xs:text-[8rem] sm:text-[10rem] md:text-[12rem] 2xl:text-[16rem] font-semibold leading-none tracking-tighter">
          {t("home.title_part_1")}
          <br />
          <span className="text-primary">{t("home.title_part_2")}</span>
          <br />
          {t("home.title_part_3")}
        </h1>
      </div>
      <AnimatePresence>
        {images.map((image, index) => (
          <motion.div
            key={image.alt}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none xs:w-[30%] xs:right-[2%] sm:w-[40%] sm:right-[5%] md:w-auto"
            exit={{ opacity: 0, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.8 }}
            style={{
              position: "absolute",
              ...(window.innerWidth < 640 ? image.mobileStyle : image.style),
              zIndex: image.zIndex,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: index * 0.1,
            }}
          >
            <motion.div
              animate={{ y: [-10, 10] }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: image.animation.duration,
                delay: image.animation.delay,
                ease: "easeInOut",
              }}
            >
              <Image
                alt={image.alt}
                className="xs:scale-40 sm:scale-50 md:scale-75 lg:scale-100"
                height={image.height}
                src={image.src}
                width={image.width}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
