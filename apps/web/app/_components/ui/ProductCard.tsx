import React from "react";
import Image from "next/image";

type ProductCardProps = React.ComponentProps<"div"> & {
  title: string;
  price?: string;
  description?: string;
  image?: string;
};

export default function ProductCard({
  title,
  description,
  price,
  image,
  className,
  ...divProps
}: ProductCardProps) {
  return (
    <div className={`p-10 ${className ?? ""}`} {...divProps}>
      <div className="rounded bg-white p-4 border-brown-primary border flex flex-col gap-2 items-center justify-center">
        {image && (
          <Image
            src={image}
            alt={title}
            width={80}
            height={80}
            className="w-20 h-20 object-contain"
          />
        )}
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm">{description}</p>}
        {price && <p className="text-sm">{price}</p>}
      </div>
    </div>
  );
}