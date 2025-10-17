export interface CarouselProps {
    slides: React.ReactNode[];   // Can be images or any JSX
    autoPlay?: boolean;
    interval?: number;
    className?: string;
  }