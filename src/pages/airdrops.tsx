import AirdropTable from "@/components/AirdropTable";
import DefaultLayout from "@/layouts/default";

export default function AirdropsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-start justify-start min-h-screen p-10">
        <h2 className="text-3xl font-bold">Airdrop Tracker</h2>
        <div className="w-full mt-4">
          <AirdropTable />
        </div>
      </section>
    </DefaultLayout>
  );
}
