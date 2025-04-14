import { useNavigate } from "react-router-dom";

import AirdropForm from "@/components/AirdropForm";
import { useUserAuth } from "@/context/AuthContext";
import DefaultLayout from "@/layouts/default";

export default function CreatePage() {
  const { role } = useUserAuth();
  const navigate = useNavigate();

  if (role !== "admin") {
    navigate("/unauthorized");

    return null;
  }

  const handleSubmit = () => {
    navigate("/airdrops");
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <AirdropForm onSubmit={handleSubmit} />
      </section>
    </DefaultLayout>
  );
}
