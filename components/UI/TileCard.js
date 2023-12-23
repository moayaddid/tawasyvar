import React, { useEffect, useState } from "react";
// import Tilt from "react-vanilla-tilt";
import Tilt from "react-parallax-tilt";
import Image from "../../public/images/burger.jpeg";
import tawasy from '../../public/images/tawasylogo.png' ;

const MyComponent = ({text , photo}) => {

    const image = `/images/beauty.jpeg` ;

  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.3}
      glareColor="lightblue"
      glarePosition="all"
      transitionSpeed={800}
      tiltReverse = {true}
      tiltMaxAngleX = {5}
      tiltMaxAngleY={5}
      style={{
        width: 400,
        height: 300,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        borderRadius: 30,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover", // Adjust as needed
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div
        className=" text-white text-4xl w-full h-full flex flex-col justify-center items-center rounded-lg "
        style={{
          backdropFilter: "blur(4px)",
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", // Adjust the blur amount as needed
        }}
      >
        Super Market
      </div>
    </Tilt>
  );
};

export default MyComponent;
