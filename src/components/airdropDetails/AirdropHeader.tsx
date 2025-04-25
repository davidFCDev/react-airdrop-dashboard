import { Airdrop } from "@/constants/airdrop.table";

interface Props {
  airdrop: Airdrop;
}

const AirdropHeader = ({ airdrop }: Props) => (
  <>
    <div className="relative w-full h-52 overflow-y-hidden">
      <img
        alt={`${airdrop.name} backdrop`}
        className="absolute inset-0 w-full h-full object-cover object-center border-8 border-black"
        src={airdrop.backdrop}
      />
    </div>
    <div className="relative px-10 -mt-24">
      <img
        alt={airdrop.name}
        className="w-32 h-32 rounded-full border-8 border-black"
        src={airdrop.image}
      />
    </div>
  </>
);

export default AirdropHeader;
