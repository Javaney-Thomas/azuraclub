"use client";
import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export default function UserLocation() {
  const [location, setLocation] = useState<string>("Fetching...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation(
              data.address?.state || data.address?.country || "Unknown"
            );
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation("Location Unavailable");
          }
        },
        () => setLocation("Location Permission Denied")
      );
    } else {
      setLocation("Geolocation Not Supported");
    }
  }, []);

  return (
    <div className="hidden md:flex items-center mr-4 text-sm">
      <MapPin size={18} className="mr-1" />
      <div className="flex flex-col text-white">
        <span className="text- text-xs">Deliver to</span>
        <span className="font-bold">{location}</span>
      </div>
    </div>
  );
}
