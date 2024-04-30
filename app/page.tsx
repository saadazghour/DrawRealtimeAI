"use client";

import { useState } from "react";
import Image from "next/image";
import { DrawingCanvas } from "~@/components/DrawingCanvas";
import * as fal from "@fal-ai/serverless-client";


// ***** Setup the proxy

// The proxy will protect your API Key and prevent it from being exposed to the client.Usually app implementation have to handle that integration themselves, but in order to make the integration as smooth as possible, we provide a drop -in proxy implementation that can be integrated with the App Router.

// The proxy will also handle the request and response.
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
  const [input, setInput] = useState("Anthropomorphic cat dressed as a pilot");
  const [image, setImage] = useState(null); // Image will be updated as the Image come back from the fal API's

  const [canvasImageData, setCanvasImageData] = useState("");

  const { send } = fal.realtime.connect("110602490-sdxl-turbo-realtime", {
    connectionKey: "110602490-lora-realtime",
    onResult: (result: any) => {
      if (result.error) return;

      if (result.images && result.images[0]) {
        setImage(result.images[0].url);
      }
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  return (
    <main className="flex min-h-screen flex-col p-24">
      <p className="text-xl mb-2">FAL SDXL</p>
      <input
        type="text"
        className="border border-black rounded-md p-2 w-full mb-2"
        value={input}
        onChange={async (e) => {
          const { value } = e.target;
          setInput(value);

          // then send the update to the fal API
          send({
            ...baseArgs,
            prompt: value,
            image_url: canvasImageData,
          });
        }}
      />

      <div className="flex">
        <DrawingCanvas
          onCanvasChange={(canvasEvent) => {
            const { imageData } = canvasEvent;
            setCanvasImageData(imageData);

            send({
              ...baseArgs,
              prompt: input,
              image_url: imageData,
            });
          }}
        />

        {image && (
          <Image
            src={image}
            alt="Generated Fal Image"
            width={550}
            height={550}
          />
        )}
      </div>
    </main>
  );
}
