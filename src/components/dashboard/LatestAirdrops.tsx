import { ScrollShadow } from "@heroui/scroll-shadow";
import { t } from "i18next";

import AirdropCard from "../AirdropCard";

import { Airdrop } from "@/types";

interface LatestAirdropsProps {
  latestAirdrops: Array<Airdrop>;
}

const LatestAirdrops = ({ latestAirdrops }: LatestAirdropsProps) => {
  return (
    <ScrollShadow className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4 py-4">
      {latestAirdrops.length === 0 ? (
        <p className="text-sm text-default-500">{t("dashboard.no_airdrops")}</p>
      ) : (
        latestAirdrops.map((airdrop) => (
          <div key={airdrop.id}>
            <AirdropCard airdrop={airdrop} />
          </div>
        ))
      )}
    </ScrollShadow>
  );
};

export default LatestAirdrops;
