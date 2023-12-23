import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import logo from "@/public/images/tawasylogo.png"

export function ResponsiveCarousel({ ads }) {

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % ads.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Carousel
      autoPlay={true}
      autoFocus={true}
      infiniteLoop={true}
      // showArrows={true}
      // showIndicators={true}
      showStatus={false}
      showThumbs={false}
      // stopOnHover={false}
      swipeable = {false}
      animationHandler="fade"
      // width={`70%`}
      className="select-none  "
      dynamicHeight={false}
    >
      {ads && ads.map((ad) => {
        return (
          <div key={ad.id} className="relative  h-auto w-full shadow-xl bg-gray-200 ">
            <Image
              loading="eager"
              src={ad.image ? ad.image : logo}
              // src="https://i0.wp.com/www.westlondonstudio.co.uk/wp-content/uploads/2020/11/Image-1920x540-Clip-for-ls-v06-00_00_07_19.Still001.jpg?ssl=1"
              width={1920}
              height={540}
              style={{width : "100%" , height : "auto"}}
              alt="image 1"
              className="max-h-[540px] object-contain  "
            />
          </div>
        );
      })}
      
    </Carousel>

  );
}
