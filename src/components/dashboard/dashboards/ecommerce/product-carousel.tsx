
'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const slideData = [
  {
    title: 'A laptop on a desk with minimal desk ',
    image: '/images/backgrounds/shop-product.webp',
    link: '/apps/ecommerce/shop',
  },
  {
    title: 'A laptop on a desk with minimal desk ',
    image: '/images/backgrounds/shop-product.webp',
    link: '/apps/ecommerce/shop',
  },
  {
    title: 'A laptop on a desk with minimal desk ',
    image: '/images/backgrounds/shop-product.webp',
    link: '/apps/ecommerce/shop',
  },
];

export default function ProductCarousel() {
  return (
    <Swiper
      spaceBetween={30}
      loop={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}

      style={
        {
          '--swiper-pagination-color': '#189674',
          '--swiper-navigation-size': '0px',
          '--swiper-pagination-bullet-inactive-color': '#ffffff99',
        } as React.CSSProperties
      }
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="mySwiper product-carousel h-full rounded-lg"
    >
      {slideData.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative rounded-xl overflow-hidden laptop-desk max-h-[357px] h-full">
            <img src={slide.image} alt={`slide_${index}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="w-full flex justify-start absolute bottom-5 start-5 z-20">
              <div className="lg:w-10/12 w-full">
                <div className="flex flex-col gap-3">
                  <h4 className="text-lg font-semibold text-white leading-tight">{slide.title}</h4>
                  <Button variant="secondary" className="w-fit cursor-pointer text-primary">
                    <Link href={slide.link}>Get Premium</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
