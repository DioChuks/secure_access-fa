import React, { useState } from "react";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  placeholderShape?: string;
  imgClassName?: string;
}

const LazyLoadImage: React.FC<ImageWithLoaderProps> = ({
  src,
  alt,
  className,
  placeholderShape,
  imgClassName
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className} ${isLoading ? "blur-lg" : "blur-0"}`}>
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center ${placeholderShape} bg-gray-600`}
        >
          <div className="w-5/6 h-5/6 bg-gray-400 animate-pulse"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${imgClassName} transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default LazyLoadImage;
