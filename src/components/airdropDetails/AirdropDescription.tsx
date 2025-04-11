import { Airdrop } from "@/constants/airdrop.table";

interface Props {
  airdrop: Airdrop;
}

const AirdropDescription = ({ airdrop }: Props) => (
  <p className="text-lg p-6 bg-default-100 rounded-lg">{airdrop.description}</p>
);

export default AirdropDescription;
