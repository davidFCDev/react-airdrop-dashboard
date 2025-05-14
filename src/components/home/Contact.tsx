import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { siteConfig } from "@/config/site";

const Contact = () => {
  const { t } = useTranslation();
  const contactRef = useRef(null);
  const isContactInView = useInView(contactRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={contactRef}
      className="bg-default-100 text-left p-1 xs:p-2 sm:p-4 w-full "
    >
      <motion.div
        animate={isContactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        className="flex items-center gap-4 px-1 py-2 xs:px-1 xs:py-2 sm:px-2 sm:py-4 md:px-20 md:py-16 w-full"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-2xl xs:text-2xl sm:text-4xl md:text-5xl font-light">
          {t("home.contactTitle")}
        </h3>
        <Link isExternal href={siteConfig.links.telegram} title="Join Telegram">
          <Button
            className="w-full font-semibold"
            color="primary"
            radius="lg"
            size="lg"
            variant="ghost"
          >
            {t("home.contactJoin")}
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default Contact;
