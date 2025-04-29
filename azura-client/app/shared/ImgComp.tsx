import type { StaticImageData } from "next/image";
import Image from "next/image";

type imgCom = {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

export const ImgComp = ({ src, alt, className, width, height }: imgCom) => {
  if (!src) return null;
  return (
    <Image
      src={src}
      width={Number(width) || 400}
      height={Number(height) || 400}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
      alt={alt || "image"}
      className={className}
      loading="lazy"
    />
  );
};
