import { Input } from "@heroui/input";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DollarIcon } from "../icons";

interface AirdropInvestmentProps {
  invested: number;
  received: number;
  updateInvestment: (invested: number, received: number) => void;
}

const AirdropInvestment = ({
  invested,
  received,
  updateInvestment,
}: AirdropInvestmentProps) => {
  const { t } = useTranslation();
  const [investedInput, setInvestedInput] = useState(invested.toString());
  const [receivedInput, setReceivedInput] = useState(received.toString());

  const handleInvestmentChange = () => {
    const newInvested = parseFloat(investedInput) || 0;
    const newReceived = parseFloat(receivedInput) || 0;

    updateInvestment(newInvested, newReceived);
  };

  return (
    <div className="flex flex-col gap-4 bg-default-100 border border-default-200 p-6 w-full">
      <h3 className="text-xl font-bold flex items-center">
        <DollarIcon className="inline-block mr-2 text-primary" />
        {t("airdrop.investment")}
      </h3>
      <div className="flex gap-2">
        <Input
          label={t("airdrop.invested")}
          radius="none"
          type="number"
          value={investedInput}
          variant="faded"
          onBlur={handleInvestmentChange}
          onChange={(e) => setInvestedInput(e.target.value)}
        />
        <Input
          label={t("airdrop.received")}
          radius="none"
          type="number"
          value={receivedInput}
          variant="faded"
          onBlur={handleInvestmentChange}
          onChange={(e) => setReceivedInput(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AirdropInvestment;
