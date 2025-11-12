import { Carousel } from "@shared/components/Carousel";
import { HeroSliderProps } from "../type";

export default function HeroSlider({ images }: HeroSliderProps) {
    return (
        <Carousel
            slides={images.map((src, i) => (
                <div key={i} className="relative w-full h-[50vh] sm:h-[65vh] md:h-[80vh]">
                    <img
                        src={src}
                        alt={`Slide ${i + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
            ))}
            autoPlay
            dots={false}
            interval={5000}
            className="mt-18 md:mt-18"
        />
    );
}
