import HeroSlider from "./components/HeroSlider";
import AboutSection from "./components/AboutSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import { images, aboutImages, testimonials } from "./config";

export default function LandingPage() {
    return (
        <>
            <HeroSlider images={images} />
            <AboutSection aboutImages={aboutImages} />
            {/* <TestimonialsSection testimonials={testimonials} />
            <CTASection /> */}
        </>
    );
}
