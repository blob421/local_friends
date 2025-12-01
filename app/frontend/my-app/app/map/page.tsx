"use client";
const Map = dynamic(() => import("./map"), {
  ssr: false
});

import dynamic from "next/dynamic";

export default function MapMain(){
  return <Map/>
}