"use client";

import Image from "next/image";
import {
  Excalidraw,
  exportToBlob, // Export our canvas to an image
  serializeAsJSON, // Serialize our canvas to JSON. To only update when canvas it's change
} from "@excalidraw/excalidraw";

import { useState } from "react";
import * as fal from "@fal-ai/serverless-client";

fal.config({
  proxyUrl: "/api/fal/proxy",
});

const seed = Math.floor(Math.random() * 100000); // Generate a random seed for numbers.
const baseArgs = {
  sync_mode: true,
  strength: 0.99,
  seed,
};

export default function Home() {
  const [input, setInput] = useState(
    "Photo of a european medieval 40 year old queen, silver hair, highly detailed face, detailed eyes, head shot, intricate crown, age spots, wrinkles"
  );
  const [image, setImage] = useState(null); // Image will be updated as the Image come back from the fal API's

  const [syncData, setSyncData] = useState<any>(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [_appState, setAppState] = useState<any>(null);

  const { send } = fal.realtime.connect("110602490-sdxl-turbo-realtime", {
    connectionKey: "110602490-lora-realtime",
    onResult: (result) => {
      console.log("result send!", result);
      if (result.error) return;
      setImage(result.images[0].url);
    },
  });

  async function getDataURL(appState = _appState) {
    const elements = excalidrawAPI.getSceneElements();

    if (!elements || !elements.length) return;

    const blob = await exportToBlob({
      elements,
      exportPadding: 10,
      appState,
      quality: 1,
      files: excalidrawAPI.getFiles(),
      getDimensions: (width, height) => ({ width, height }),
      mimeType: "image/png",
    });

    return dataURL;
  }

  // const result = await fal.subscribe("110602490-lora", {
  //   input: {
  //     prompt,
  //     model_name: "stabilityai/stable-diffusion-xl-base-1.0",
  //     image_size: "square_hd",
  //   },
  //   pollInterval: 5000,
  //   logs: true,
  //   onQueueUpdate(update) {
  //     console.log("queue update", update);
  //   },
  // });

  // const imageUrl = result.images[0].url;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
