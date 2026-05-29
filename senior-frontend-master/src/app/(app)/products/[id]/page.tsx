// frontend/app/products/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getImageSrc } from "@/lib/getImageSrc";
import { MdEmail } from "react-icons/md";

type Product = {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  owner: { _id: string; username: string; email: string };
  isAvailable: boolean;
  createdAt: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://dakesh-backend.onrender.com";

export default function ProductPage() {
  const { id: productId } = useParams() as { id: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<Product>(
          `${API_BASE}/api/products/${productId}`
        );
        setProduct(res.data);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleDakesh = () => {
    if (product) {
      router.push(`/dakesh?productIdToBarterFor=${product._id}`);
    }
  };

  const getContactOwnerMailto = () => {
    if (!product) return "#";
    const subject = encodeURIComponent(`Item Swap Request: ${product.title}`);
    const body = encodeURIComponent(
      `Hi ${product.owner?.username || "there"},\n\n` +
      `I'm interested in swapping for your item "${product.title}".\n\n` +
      `I'd love to discuss a potential exchange. Let me know if you're interested!\n\n` +
      `Best regards`
    );
    return `mailto:${product.owner?.email || ""}?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto h-screen">
        <p>Loading product...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="p-8 max-w-6xl mx-auto h-screen">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-[#522c5d] to-[#232323] flex items-center justify-center">
      <div
        className="flex flex-col md:flex-row gap-10 items-center max-w-5xl w-full 
                  bg-white/5 backdrop-blur-md rounded-2xl p-8 
                  border border-white/10 shadow-xl"
      >
        {/* IMAGE SECTION */}
        <div className="w-full md:w-1/3">
          <div
            className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg bg-black/10 
                      border border-white/10 hover:shadow-purple-600/30 hover:scale-[1.02] transition-all duration-300"
          >
            {product.images?.length ? (
              <Image
                src={getImageSrc(product.images[0])}
                alt={product.title}
                fill
                className="object-contain p-4 transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="w-full md:w-1/2 flex flex-col gap-4 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
            {product.title}
          </h1>

          <p className="text-sm text-purple-200 font-medium">
            By{" "}
            <span className="text-white">
              {product.owner?.username || "Unknown"}
            </span>
          </p>

          <p className="text-gray-300 text-base leading-relaxed">
            {product.description}
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDakesh}
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 
                    text-white px-8 py-3 rounded-xl font-semibold 
                    hover:opacity-90 hover:shadow-lg hover:-translate-y-[2px]
                    transition-all duration-300 shadow-purple-800/30"
            >
              yalla nbadel
            </button>
            <a
              href={getContactOwnerMailto()}
              className="inline-flex items-center justify-center gap-2 
                    bg-gradient-to-r from-blue-500 to-cyan-500 
                    text-white px-8 py-3 rounded-xl font-semibold 
                    hover:opacity-90 hover:shadow-lg hover:-translate-y-[2px]
                    transition-all duration-300 shadow-blue-800/30"
            >
              <MdEmail className="text-xl" />
              Contact Owner
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
