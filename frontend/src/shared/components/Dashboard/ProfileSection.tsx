import { Carousel } from "../Carousel";
import { imagesDashBoard } from "@shared/config/common";

export const ProfileSection = () => {
  return (
    <section className="w-full overflow-hidden">
      {/* Banner */}
      <div className="w-full overflow-hidden relative">
        <Carousel
          slides={imagesDashBoard.map((src, i) => (
            <div
              key={i}
              className="relative w-full h-[45vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh]"
            >
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
            </div>
          ))}
          autoPlay
          dots={false}
          interval={5000}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};
