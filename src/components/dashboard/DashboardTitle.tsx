import { ComponentType, SVGProps } from "react";

interface DashboardTitleProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
}

const DashboardTitle = ({ icon: Icon, text }: DashboardTitleProps) => {
  return (
    <h2 className="text-2xl font-bold p-4 bg-default-50 border border-default-300 flex items-center">
      <Icon className="scale-110 inline-block mr-2 text-primary" />
      {text}
    </h2>
  );
};

export default DashboardTitle;
