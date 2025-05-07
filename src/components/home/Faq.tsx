import { Accordion, AccordionItem } from "@heroui/accordion";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { CircleMinusIcon, CirclePlusIcon } from "../icons";

const Faq = () => {
  const { t } = useTranslation();
  const faqRef = useRef(null);
  const faqItems = [1, 2, 3, 4, 5];

  return (
    <section
      ref={faqRef}
      className="relative bg-secondary-200 text-left p-1 xs:p-2 sm:p-4 w-full min-h-[600px] flex flex-col"
    >
      <div className="relative z-15">
        <h4 className="text-[5rem] xs:text-[5rem] sm:text-[7rem] md:text-[10rem] 2xl:text-[12rem] font-bold leading-none text-secondary-800">
          {t("home.faq.title")}
        </h4>
      </div>
      <div className="w-full flex justify-center items-center py-12 xs:py-14 sm:py-18 md:py-24">
        <Accordion className="rounded-none w-full max-w-4xl 2xl:max-w-6xl">
          {faqItems.map((index) => (
            <AccordionItem
              key={index}
              className="group"
              indicator={({ isOpen }) => (
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0, opacity: 1 }}
                  className={`${isOpen ? "text-white" : "text-secondary-800"} group-hover:text-white`}
                  initial={{ rotate: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {isOpen ? (
                    <CircleMinusIcon className="w-8 h-8" />
                  ) : (
                    <CirclePlusIcon className="w-8 h-8" />
                  )}
                </motion.div>
              )}
              title={
                <span className="text-lg xs:text-lg sm:text-xl md:text-2xl 2xl:text-4xl font-bold text-secondary-800 group-hover:text-white group-[.is-open]:text-white">
                  {t(`home.faq.q${index}`)}
                </span>
              }
            >
              <p className="text-lg xs:text-lg sm:text-xl md:text-xl 2xl:text-3xl font-light text-secondary-800 group-hover:text-white group-[.is-open]:text-white">
                {t(`home.faq.a${index}`)}
              </p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
