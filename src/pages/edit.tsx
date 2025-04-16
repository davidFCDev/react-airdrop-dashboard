import { useNavigate, useParams } from "react-router-dom";

import AirdropForm from "@/components/AirdropForm";
import { useUserAuth } from "@/context/AuthContext";
import DefaultLayout from "@/layouts/default";
import { useAirdropStore } from "@/store/airdropStore";

export default function EditPage() {
  const { role } = useUserAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { airdrops } = useAirdropStore();

  if (role !== "admin") {
    navigate("/unauthorized");

    return null;
  }

  const airdrop = airdrops.find((a) => a.id === id);

  if (!airdrop) {
    navigate("/airdrops");

    return null;
  }

  const handleSubmit = () => {
    navigate("/airdrops");
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <AirdropForm initialAirdrop={airdrop} onSubmit={handleSubmit} />
      </section>
    </DefaultLayout>
  );
}
