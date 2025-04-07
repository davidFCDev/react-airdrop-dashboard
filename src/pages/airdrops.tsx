import { Select, SelectItem } from "@heroui/select";

import AirdropCard from "@/components/AirdropCard";
import { AIRDROP_TEST as airdrop } from "@/constants";
import DefaultLayout from "@/layouts/default";

export default function AirdropsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="justify-between w-full p-4 flex gap-4 items-start">
          <div className="flex flex-col items-start justify-center gap-4 p-5 rounded-md bg-default-200">
            <h2>Filters</h2>
            <Select className="w-full" placeholder="Select an option">
              <SelectItem key="option1" textValue="option1">
                Option 1
              </SelectItem>
              <SelectItem key="option2" textValue="option2">
                Option 2
              </SelectItem>
              <SelectItem key="option3" textValue="option3">
                Option 3
              </SelectItem>
            </Select>
            <Select className="w-full" placeholder="Select an option">
              <SelectItem key="option1" textValue="option1">
                Option 1
              </SelectItem>
              <SelectItem key="option2" textValue="option2">
                Option 2
              </SelectItem>
              <SelectItem key="option3" textValue="option3">
                Option 3
              </SelectItem>
            </Select>
            <Select className="w-full" placeholder="Select an option">
              <SelectItem key="option1" textValue="option1">
                Option 1
              </SelectItem>
              <SelectItem key="option2" textValue="option2">
                Option 2
              </SelectItem>
              <SelectItem key="option3" textValue="option3">
                Option 3
              </SelectItem>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-default-200 p-5 rounded-md">
            <AirdropCard airdrop={airdrop} />
            <AirdropCard airdrop={airdrop} />
            <AirdropCard airdrop={airdrop} />
            <AirdropCard airdrop={airdrop} />
            <AirdropCard airdrop={airdrop} />
            <AirdropCard airdrop={airdrop} />
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
