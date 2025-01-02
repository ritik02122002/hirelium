import React, { useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { useSearchParams } from "react-router-dom";
const items = [
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", // Google
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", // Microsoft
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", // Amazon
  "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", // Apple
  "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg", // Tesla
  "https://www.citypng.com/public/uploads/preview/flipkart-logo-icon-hd-png-701751694706828v1habfry9b.png",
  "https://www.mzekiosmancik.com/wp-content/uploads/2018/09/accenture-probono-consulting-xs-marquee.png",
];

const Carousel = ({
  Element,
  elementProps,
  backgroundColor = "pink",
  width = "*:w-[500px]",
}) => {
  const [carouselItems, setCarouselItems] = useState(elementProps);
  const bgColor = {
    pink: "bg-pink-100",
    purple: "bg-purple-200",
  };
  console.log(carouselItems);
  const [movement, setMovement] = useState("still");
  return (
    <div
      className={
        "py-5 flex items-center m-auto overflow-hidden w-full px-10  " +
        bgColor[backgroundColor]
      }
    >
      <GrPrevious
        className="text-2xl cursor-pointer text-gray-700 rounded-md z-50 relative"
        onClick={() => {
          if (movement != "still") return;
          let a = [...carouselItems];
          a.push(a[0]);
          a.splice(0, 1);
          setMovement("left");
          setTimeout(() => {
            setCarouselItems(a);
            setMovement("still");
          }, 500);
        }}
      />

      <ul className={"flex m-auto justify-center w-5/6 "}>
        {carouselItems.map((item, index) => (
          <li
            className={
              width +
              " " +
              (movement == "left" &&
                "transition -translate-x-full duration-500 ease-in-out") +
              (movement == "right" &&
                "transition translate-x-full duration-500 ease-in-out")
            }
          >
            <Element {...item} />
          </li>
        ))}
      </ul>
      <GrNext
        className="text-2xl cursor-pointer text-gray-500  rounded-md z-50 disbled:bg-gray-100 relative"
        onClick={() => {
          if (movement != "still") return;
          let a = [...carouselItems];
          a.unshift(a[a.length - 1]);
          a.pop();

          setTimeout(() => {
            setCarouselItems(a);
            setMovement("still");
          }, 500);
          setMovement("right");
        }}
      />
    </div>
  );
};

export default Carousel;
