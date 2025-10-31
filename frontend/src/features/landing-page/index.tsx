import HeroSlider from "./components/HeroSlider";
import AboutSection from "./components/AboutSection";
import { images, aboutImages } from "./config";

export default function LandingPage() {
    return (
        <>
            <HeroSlider images={images} />
            <AboutSection aboutImages={aboutImages} />
        </>
    );
}
