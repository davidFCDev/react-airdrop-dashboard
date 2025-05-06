import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { siteConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";

// Definir imágenes con posiciones, z-index y animaciones individuales
const images = [
  {
    src: "/public/images/bitcoin.png",
    alt: "Bitcoin",
    width: 150,
    height: 150,
    style: { top: "20%", right: "40%" },
    mobileStyle: { top: "15%", right: "5%" },
    zIndex: 10,
    animation: {
      duration: 1.5 + Math.random() * 1.5, // 1.5s a 3s
      delay: Math.random(), // 0s a 1s
    },
  },
  {
    src: "/public/images/ethereum.png",
    alt: "Ethereum",
    width: 150,
    height: 150,
    style: { top: "30%", right: "20%" },
    mobileStyle: { top: "25%", right: "10%" },
    zIndex: 10,
    animation: {
      duration: 1.5 + Math.random() * 1.5,
      delay: Math.random(),
    },
  },
  {
    src: "/public/images/dolar.png",
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
    src: "/public/images/airdrops.png",
    alt: "Airdrops",
    width: 250,
    height: 250,
    style: { top: "70%", right: "10%" },
    mobileStyle: { top: "50%", right: "2%" },
    zIndex: 5, // Detrás del texto
    animation: {
      duration: 1.5 + Math.random() * 1.5,
      delay: Math.random(),
    },
  },
  {
    src: "/public/images/dolar2.png",
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
    src: "/public/images/usdc.png",
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

export default function IndexPage() {
  const { t } = useTranslation();
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <DefaultLayout>
      <div className="bg-default-100">
        {/* Sección Hero: Título + Imágenes */}
        <section className="relative h-[90vh] p-2 xs:p-4">
          {/* Título principal */}
          <div className="inline-block text-left justify-center z-20 relative">
            <h1 className="text-[6rem] xs:text-[8rem] sm:text-[10rem] md:text-[12rem] lg:text-[16rem] font-semibold leading-none tracking-tighter">
              {t("home.title_part_1")}
              <br />
              <span className="text-primary">{t("home.title_part_2")}</span>
              <br />
              {t("home.title_part_3")}
            </h1>
          </div>

          {/* Imágenes en posición absoluta con animaciones */}
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.alt}
                animate={{ opacity: 1, scale: 1 }}
                className="pointer-events-none xs:right-[2%] xs:w-[40%] sm:right-[5%] sm:w-[50%] md:w-auto"
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                style={{
                  position: "absolute",
                  ...(window.innerWidth < 640
                    ? image.mobileStyle
                    : image.style),
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

        {/* Sección Subtítulo + Botones */}
        <section className="flex items-center px-2 py-8 xs:px-4 xs:py-8 sm:px-4 sm:py-16 ml-2 xs:ml-4 sm:ml-10 md:ml-20">
          <div className="flex items-start justify-center flex-col sm:flex-row">
            <h3 className="text-3xl xs:text-3xl sm:text-4xl md:text-5xl font-light">
              {t("home.subtitle")}
            </h3>
            <div className="flex items-center mt-4 sm:mt-0">
              <Link
                isExternal
                href={siteConfig.links.telegram}
                title="Telegram Channel"
              >
                <Button
                  className="ml-0 sm:ml-6 font-semibold"
                  color="default"
                  radius="lg"
                  size="lg"
                  variant="ghost"
                >
                  {t("home.contact")}
                </Button>
              </Link>
              <Link className="ml-2" href="/login" title="Login">
                <Button
                  className="text-default-50 font-semibold"
                  color="primary"
                  radius="lg"
                  size="lg"
                  variant="solid"
                >
                  {t("home.login")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Sección Estadísticas */}
        <section
          ref={statsRef}
          className="bg-secondary-500 text-secondary-100 flex flex-col items-center justify-center p-2 xs:p-4 sm:p-10 md:p-20"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            {[
              { title: "Market coverage", value: "100%" },
              { title: "Total volume", value: "$7bn", suffix: "+" },
              { title: "Liquidity sources", value: "15" },
              { title: "Networks", value: "100", suffix: "+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                className="flex flex-col items-start justify-center leading-none"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2 className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl font-bold">
                  {stat.title}
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

        {/* Sección Eslogan */}
        <section className="relative bg-secondary-50 text-left p-2 xs:p-4 w-full min-h-[600px]">
          <div className="z-15 relative">
            <h4 className="text-[5rem] xs:text-[5rem] sm:text-[7rem] md:text-[10rem] font-bold leading-none">
              Search.
              <br />
              <span className="text-secondary-500">Manage.</span>
              <br />
              <span className="text-secondary-200">Track.</span>
            </h4>
          </div>

          <div className="flex flex-col gap-4 items-start px-2 py-4 xs:px-2 xs:py-4 sm:px-20 sm:py-16 w-full z-15 relative">
            <h3 className="text-2xl xs:text-2xl sm:text-4xl md:text-5xl font-light max-w-3xl">
              Manage your favorites airdrops, track your investments and
              discover new opportunities.
            </h3>
            <Link href="/airdrops" title="Telegram Channel">
              <Button
                className="font-semibold"
                radius="lg"
                size="lg"
                variant="ghost"
              >
                {t("navbar.airdrops")}
              </Button>
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 z-10 xs:scale-50 sm:scale-75 md:scale-100 origin-bottom-right">
            <Image
              alt="Cat"
              height={750}
              src="/public/images/cat.png"
              width={750}
            />
          </div>

          <div className="absolute right-[35%] top-0 z-10 xs:scale-50 sm:scale-75 md:scale-100 origin-bottom-left">
            <Image
              alt="Bocadillo"
              height={350}
              src="/public/images/bocadillo.png"
              width={350}
            />
          </div>
        </section>

        {/* Sección  */}
        <section className="relative bg-default-100 text-left p-2 xs:p-4 w-full min-h-[600px]">
          <div className="z-15 relative">
            <h4 className="text-[5rem] xs:text-[5rem] sm:text-[7rem] md:text-[10rem] font-bold leading-none ">
              We get you covered.
            </h4>
          </div>

          <div className="flex justify-between gap-14 items-start px-2 py-4 xs:px-2 xs:py-4 sm:px-20 sm:py-16 w-full">
            <div className="flex flex-col items-start gap-4 max-w-lg">
              <Image
                alt="New Airdrops"
                height={200}
                src="/public/images/new-airdrops.png"
                width={200}
              />
              <h2 className="text-2xl xs:text-2xl sm:text-4xl md:text-5xl font-bold text-primary ">
                New airdrops every day, always updated
              </h2>
              <p className="text-lg xs:text-lg sm:text-xl md:text-2xl font-light">
                The most complete guides for the latest airdrops. Keep track of
                your tasks, all in one place.
              </p>
              <p className="text-lg xs:text-lg sm:text-xl md:text-2xl font-light">
                Don&apos;t miss anything & always be early.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 max-w-lg">
              <Image
                alt="Live Chat"
                height={200}
                src="/public/images/chat.png"
                width={200}
              />
              <h2 className="text-2xl xs:text-2xl sm:text-4xl md:text-5xl font-bold text-primary ">
                Live chat with our community
              </h2>
              <p className="text-lg xs:text-lg sm:text-xl md:text-2xl font-light">
                Get real-time support from users when you need it. Ask
                questions, share tips and whatever else you can think of.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 max-w-lg">
              <Image
                alt="Investment Chart"
                height={200}
                src="/public/images/chart.png"
                width={200}
              />
              <h2 className="text-2xl xs:text-2xl sm:text-4xl md:text-5xl font-bold text-primary ">
                Track your profits and losses
              </h2>
              <p className="text-lg xs:text-lg sm:text-xl md:text-2xl font-light">
                Keep track of your investments and airdrops in one place.
              </p>
              <p className="text-lg xs:text-lg sm:text-xl md:text-2xl font-light">
                Get notified when your airdrops are ready to claim.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
