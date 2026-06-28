// "use client";
// import { useState, useEffect, useRef, useContext } from "react";
// // Carousel slider for product
// import Slider from "react-slick";

// // Carousel slider data
// import SliderData from "./slider-data";

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// import { ProductContext } from "@/app/context/ecommerce-context/index";
// import { useParams } from "next/navigation";

// import Image from "next/image";

// const ProductCarousel = () => {
//   const [nav1, setNav1] = useState(null);
//   const [nav2, setNav2] = useState(null);

//   const sliderRef1 = useRef(null);
//   const sliderRef2 = useRef(null);

//   useEffect(() => {
//     setNav1(sliderRef1.current);
//     setNav2(sliderRef2.current);
//   }, []);

//   const { id } = useParams();
//   const { products } = useContext(ProductContext);
//   // Find the product by Id
//   const product = products.find((p) => p.id === Number(id));
//   // const getProductImage = product ? product.photo : "";
//   const getProductImage = product?.photo ?? null;

//   const settings = {
//     focusOnSelect: true,
//     infinite: true,
//     slidesToShow: 6,
//     arrows: false,
//     swipeToSlide: true,
//     slidesToScroll: 1,
//     centerMode: false,
//     className: "centerThumb",
//     speed: 500,
//   };

//   return (
//     <>
//       <div>
//         <Slider asNavFor={nav2 || undefined} ref={sliderRef1} arrows={false}>
//           {getProductImage && (
//             <div className="cursor-pointer p-2">
//               <Image
//                 src={getProductImage}
//                 alt="Main Product"
//                 width={200}
//                 height={200}
//                 className="w-full  object-cover rounded-md"
//               />
//             </div>
//           )}

//           {SliderData.map((items, index) => (
//             <div key={index}>
//               <Image
//                 src={items.imgPath}
//                 width={200}
//                 height={200}
//                 alt="carousel"
//                 className="w-full  object-cover rounded-md"
//               />
//             </div>
//           ))}
//         </Slider>
//         <Slider
//           asNavFor={nav1 || undefined}
//           ref={sliderRef2}
//           {...settings}
//           className="mt-2 "
//         >
//           {getProductImage && (
//             <div className="cursor-pointer p-2">
//               <Image
//                 src={getProductImage}
//                 alt="Thumbnail"
//                 width={72}
//                 height={72}
//                 className="rounded-md"
//               />
//             </div>
//           )}
//           {SliderData.map((items, index) => (
//             <div key={index} className="cursor-pointer p-2">
//               <Image
//                 src={items.imgPath}
//                 alt={`Thumbnail ${items.id}`}
//                 width={72}
//                 height={72}
//                 className="rounded-md"
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </>
//   );
// };

// export default ProductCarousel;




"use client";

import { useRef, useContext } from "react";
import Slider from "react-slick";
import SliderData from "./slider-data";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ProductContext } from "@/app/context/ecommerce-context";
import { useParams } from "next/navigation";
import Image from "next/image";

const ProductCarousel = () => {
  const sliderRef1 = useRef<Slider | null>(null);
  const sliderRef2 = useRef<Slider | null>(null);

  const { id } = useParams();
  const { products } = useContext(ProductContext);

  const product = products?.find((p) => p.id === Number(id));
  const getProductImage = product?.photo || "";

  const thumbSettings = {
    focusOnSelect: true,
    swipeToSlide: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    infinite: true,
    arrows: false,
  };

  const allImages = [
    ...(getProductImage ? [{ imgPath: getProductImage }] : []),
    ...SliderData,
  ];

  return (
    <div className="product px-5">
      {/* MAIN SLIDER */}
      <Slider
        asNavFor={sliderRef2.current ?? undefined}
        ref={(s) => {
          sliderRef1.current = s;
        }}
        arrows={false}
      >
        {allImages.map((item, index) => (
          <div key={index} className="w-full h-full">
            <Image
              src={item.imgPath}
              alt={`Product ${index}`}
              width={500}
              height={500}
              className="w-full rounded-xl max-h-[550px]"
            />
          </div>
        ))}
      </Slider>

      {/* THUMBNAIL SLIDER */}
      <Slider
        asNavFor={sliderRef1.current ?? undefined}
        ref={(s) => {
          sliderRef2.current = s;
        }}
        {...thumbSettings}
        className="mt-3 product-thumb "
      >
        {allImages.map((item, index) => (
          <div key={index} className="cursor-pointer p-2 w-full ">
            <Image
              src={item.imgPath}
              alt={`Thumbnail ${index}`}
              width={72}
              height={72}
              className="rounded-md w-full "
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
