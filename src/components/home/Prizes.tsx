import { Card } from "@heroui/card";
import { Image } from "@heroui/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const pricingPlans = [
  { title: "home.prices.monthly", price: "$19.99", image: "/images/card1.png" },
  {
    title: "home.prices.quarterly",
    price: "$49.99",
    image: "/images/card2.png",
  },
  { title: "home.prices.annual", price: "$199.99", image: "/images/card3.png" },
];

const Prizes = () => {
  const { t } = useTranslation();
  const pricesRef = useRef(null);
  const isPricesInView = useInView(pricesRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={pricesRef}
      className="relative bg-secondary-50 text-left p-1 xs:p-2 sm:p-4 w-full min-h-[600px] text-secondary-700"
    >
      <div className="relative z-15">
        <h4 className="text-[5rem] xs:text-[5rem] sm:text-[7rem] md:text-[10rem] 2xl:text-[12rem] font-bold leading-none">
          {t("home.prices.title")}
        </h4>
      </div>
      <div className="flex flex-col items-start gap-10 px-1 py-2 xs:px-1 xs:py-2 sm:px-2 sm:py-4 md:px-20 md:py-16 w-full max-w-4xl 2xl:max-w-6xl">
        <h3 className="text-2xl xs:text-2xl sm:text-4xl md:text-5xl font-light">
          {t("home.prices.subtitle")}
        </h3>
      </div>
      <div className="flex flex-col xs:flex-col sm:flex-col md:flex-row justify-center items-center gap-10 pb-20">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.title}
            animate={isPricesInView ? { opacity: 1, y: 0 } : {}}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative bg-default-900 border-8 border-secondary-700 h-[30rem] w-[300px] flex flex-col items-center text-default-50 gap-6 p-4 xs:p-4 sm:p-6 md:p-8 lg:p-10 text-center shadow-none">
              <div className="flex flex-col items-center gap-2 z-10">
                <h3 className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-100">
                  {t(plan.title)}
                </h3>
              </div>
              <p className="text-2xl sm:text-4xl md:text-7xl font-bold">
                {plan.price}
              </p>

              <div className="absolute bottom-0 w-full z-5 overflow-hidden">
                <Image
                  alt="Card Decoration"
                  className="w-full h-auto object-cover"
                  src={plan.image}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Prizes;
