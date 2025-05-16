import { Card, CardHeader } from "@heroui/card";
import { FC } from "react";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({ title }) => {
  return (
    <Card
      className="bg-default-50 border border-default-200"
      radius="none"
      shadow="none"
    >
      <CardHeader className="px-4">
        <h3 className="text-2xl font-bold text-neutral-100">{title}</h3>
      </CardHeader>
    </Card>
  );
};

export default SectionHeader;
