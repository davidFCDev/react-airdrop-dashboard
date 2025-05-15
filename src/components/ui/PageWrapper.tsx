import { ComponentType, FC } from "react";
import { useTranslation } from "react-i18next";

import DefaultLayout from "@/layouts/default";

interface PageWrapperProps {
  component: ComponentType;
  translationKey: "airdrop" | "favorites" | "tracker" | "help";
}

const PageWrapper: FC<PageWrapperProps> = ({
  component: Component,
  translationKey,
}) => {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl 2xl:text-6xl text-neutral-100 font-bold tracking-tight">
            <span className="text-primary">{t(`${translationKey}.t`)}</span>
            {t(`${translationKey}.title`)}
          </h2>
          <p className="text-neutral-400 text-base md:text-lg lg:text-xl mt-2 md:mt-4 max-w-2xl">
            {t(`${translationKey}.subtitle`)}
          </p>
        </div>
        <div className="w-full mt-6 md:mt-8 lg:mt-10 mx-auto">
          <div className="overflow-x-auto">
            <Component />
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default PageWrapper;
