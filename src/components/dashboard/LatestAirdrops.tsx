import { t } from "i18next";
import { useEffect, useRef, useState } from "react";

import AirdropCard from "../AirdropCard";
import { RightArrowIcon } from "../icons";

import { Airdrop } from "@/types";

interface LatestAirdropsProps {
  latestAirdrops: Array<Airdrop>;
}

const LatestAirdrops = ({ latestAirdrops }: LatestAirdropsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    updateArrows();
    const scrollElement = scrollRef.current;
    const handleScroll = () => updateArrows();

    const resizeObserver = new ResizeObserver(() => updateArrows());

    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      resizeObserver.observe(scrollElement);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
        resizeObserver.unobserve(scrollElement);
      }
    };
  }, []);

  const scrollBy = (distance: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4 pt-4">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex flex-row flex-nowrap overflow-x-auto gap-4 scrollbar-hide"
        >
          {latestAirdrops.length === 0 ? (
            <p className="text-sm text-default-500">
              {t("dashboard.no_airdrops")}
            </p>
          ) : (
            latestAirdrops.map((airdrop) => (
              <div key={airdrop.id}>
                <AirdropCard airdrop={airdrop} star={true} />
              </div>
            ))
          )}
        </div>
        {showLeftArrow && (
          <button
            aria-label={t("dashboard.scroll_left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 text-4xl bg-default-200 border border-default-200 hover:bg-default-50 p-2 rounded-full transition-colors"
            onClick={() => scrollBy(-256)}
          >
            <RightArrowIcon className="text-neutral-300 rotate-180" />
          </button>
        )}
        {showRightArrow && (
          <button
            aria-label={t("dashboard.scroll_right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 text-4xl bg-default-200 border border-default-200 hover:bg-default-50 p-2 rounded-full transition-colors"
            onClick={() => scrollBy(256)}
          >
            <RightArrowIcon className="text-neutral-300" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LatestAirdrops;
