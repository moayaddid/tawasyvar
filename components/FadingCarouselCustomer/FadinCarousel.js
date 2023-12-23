import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";

export function FadingCarousel({ ads }) {

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % ads.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="static h-max">
    {ads.map((image, index) => (
      <Image
        key={index}
        src={image.image}
        width={1920}
        height={540}
        alt={`slide-${index}`}
        className={`absolute w-full h-full transition-opacity duration-1000 ${
          index === currentSlide ? 'opacity-100' : 'opacity-0'
        }`}
      />
    ))}
  </div>

  );
}
