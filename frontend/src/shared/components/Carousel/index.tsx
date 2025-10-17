import Slider from "react-slick";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { CarouselProps } from "@shared/types/CarouselType";
import "@shared/styles/carouselStyle.css";


const NextArrow = ({ onClick }: { onClick?: () => void }) => (
    <motion.div
        whileHover={{ scale: 1.2 }}
        onClick={onClick}
        className="absolute top-1/2 right-4 -translate-y-1/2 z-10 cursor-pointer bg-white/80 p-3 rounded-full shadow-lg hover:bg-white"
    >
        <FaArrowRight className="text-gray-800" size={22} />
    </motion.div>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <motion.div
        whileHover={{ scale: 1.2 }}
        onClick={onClick}
        className="absolute top-1/2 left-4 -translate-y-1/2 z-10 cursor-pointer bg-white/80 p-3 rounded-full shadow-lg hover:bg-white"
    >
        <FaArrowLeft className="text-gray-800" size={22} />
    </motion.div>
);

export function Carousel({
    slides,
    autoPlay = true,
    interval = 5000,
    className,
}: CarouselProps) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: autoPlay,
        autoplaySpeed: interval,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        appendDots: (dots: React.ReactNode) => (
            <div className="absolute bottom-4 w-full flex justify-center">
                <ul className="flex gap-2">{dots}</ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all" />
        ),
    };

    return <Slider {...settings} className={className}>{slides}</Slider>;
}
