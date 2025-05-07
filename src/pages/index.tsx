import About from "@/components/home/About";
import Covert from "@/components/home/Covert";
import Faq from "@/components/home/Faq";
import Hero from "@/components/home/Hero";
import Prizes from "@/components/home/Prizes";
import StartNow from "@/components/home/StartNow";
import Stats from "@/components/home/Stats";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="bg-default-100">
        {/* Sección Hero: Título + Imágenes */}
        <Hero />

        {/* Sección Subtítulo + Botones */}
        <StartNow />

        {/* Sección Estadísticas */}
        <Stats />

        {/* Sección About */}
        <About />

        {/* Sección Cobertura */}
        <Covert />

        {/* Sección Precios */}
        <Prizes />

        {/* Sección Preguntas Frecuentes */}
        <Faq />
      </div>
    </DefaultLayout>
  );
}
