"use client";

import { useRef ,useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  ArrowRight,
  Stethoscope,
  Pill as Pills,
  TestTube,
  Heart,
  Brain,
  Eye,
  Bone,
  Bluetooth as Tooth,
  Baby,
} from "lucide-react";
import cardPage from "@/app/cardPage";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const carouselSlides = [
{
  video: "https://videos.pexels.com/video-files/5998353/5998353-sd_640_360_30fps.mp4 ",
  title: "Online Doctor Consultation",
  description: "Connect with experienced doctors from the comfort of your home",
  link: "/childrens checkup", 
}


,
  {
    video: "https://videos.pexels.com/video-files/3741660/3741660-sd_640_360_25fps.mp4",
    title: "Order Medicines Online",
    description: "Get medicines delivered to your doorstep",
    link: "/",
  },
  {
    image: "https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg",
    title: "Book Lab Tests",
    description: "Choose from a wide range of lab tests",
    link: "/",
  },
  {
    video: "https://www.w3schools.com/html/mov_bbb.mp4", // video URL
    title: "Watch Health Tips",
    description: "Learn useful health tips from experts",
    link: "/health-tips",
  },
  {
    image: "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg",
    title: "Online Doctor Consultation",
    description:
      "Connect with experienced doctors from the comfort of your home",
    link: "/find-doctors",
  },
  {
  video: "https://videos.pexels.com/video-files/6868234/6868234-sd_360_640_30fps.mp4",
  title: "Convenient Medicine Delivery",
  description: "Quick and reliable delivery of your prescriptions right to your home",
  link: "/"
},
];

const specialties = [
  {
    name: "General Physician",
    icon: <Stethoscope />,
    link: "/specialties/general-physician-internal-medicine",
  },
  { name: "Cardiology", icon: <Heart />, link: "/specialties/cardiology" },
  { name: "Neurology", icon: <Brain />, link: "/specialties/neurology" },
  { name: "Ophthalmology", icon: <Eye />, link: "/specialties/ophthalmology" },
  { name: "Orthopedics", icon: <Bone />, link: "/specialties/orthopedics" },
  { name: "Dentistry", icon: <Tooth />, link: "/specialties/dentistry" },
  { name: "Pediatrics", icon: <Baby />, link: "/specialties/pediatrics" },
];

const services = [
  {
    icon: <Stethoscope className="w-12 h-12 text-apollo-blue" />,
    title: "Doctor Consultation",
    description: "Book appointments with expert doctors",
    link: "/find-doctors",
  },
  {
    icon: <Pills className="w-12 h-12 text-apollo-blue" />,
    title: "Online Pharmacy",
    description: "Order medicines with prescription",
    link: "/",
  },
  {
    icon: <TestTube className="w-12 h-12 text-apollo-blue" />,
    title: "Lab Tests",
    description: "Book tests at nearby centers",
    link: "/",
  },
];

export default function Home() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // Example: check if "authToken" exists in localStorage (custom logic)
    const token = localStorage.getItem("authtoken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleServiceClick = (link: string) => {
    if (isAuthenticated) {
      window.location.href = link;
    } else {
      setShowLoginPrompt(true);
    }
  };
  return (
    <main>
      {/* Hero Carousel */}
      <section className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          className="h-[400px] md:h-[500px] lg:h-[600px]"
        >
          {carouselSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                {slide.video ? (
                  <video
                    src={slide.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover brightness-50"
                  />
                ) : slide.image ? (
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover brightness-50"
                  />
                ) : null}

                <div className="absolute inset-0 flex items-center">
                  <div className="apollo-container">
                    <div className="max-w-2xl text-white">
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl mb-6 text-white/90">
                        {slide.description}
                      </p>
                      <Link
                        href="#"
                        className="inline-flex items-center bg-apollo-orange text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Services Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="apollo-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.link}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  {service.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}
      <section className="py-16 bg-gray-50">
        <div className="apollo-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => handleServiceClick(service.link)}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow w-full text-left cursor-pointer"
                type="button"
              >
                <div className="flex flex-col items-center text-center">
                  {service.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

{/* Specialties Section */}
<section className="py-16">
  <div className="apollo-container">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
      Medical Specialties
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {specialties.map((specialty, index) => (
        <button
          key={index}
          onClick={() => {
            if (isAuthenticated) {
              window.location.href = specialty.link;
            } else {
              setShowLoginPrompt(true);
            }
          }}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center w-full cursor-pointer"
          type="button"
        >
          <div className="text-apollo-blue w-12 h-12">{specialty.icon}</div>
          <span className="mt-4 font-medium">{specialty.name}</span>
        </button>
      ))}
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-apollo-blue text-white py-12">
        <div className="apollo-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Apollo 247</h3>
              <p className="text-white/80">
                Apollo 247 is your trusted healthcare partner, providing 24/7
                online doctor consultations, medicine delivery, and lab tests.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-white/80 hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/80 hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-white/80 hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/find-doctors"
                    className="text-white/80 hover:text-white"
                  >
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-white/80 hover:text-white">
                    Order Medicines
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-white/80 hover:text-white">
                    Book Lab Tests
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-white/80 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-white/80 hover:text-white"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refund"
                    className="text-white/80 hover:text-white"
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/60">
            <p>© {new Date().getFullYear()} Apollo 247. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 text-lg font-medium">
              Please login to access this service.
            </p>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="bg-apollo-blue text-white px-4 py-2 rounded hover:bg-apollo-lightBlue transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
