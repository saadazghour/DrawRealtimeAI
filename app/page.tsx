"use client";

import Image from "next/image";
import {
  Excalidraw,
  exportToBlob, // Export our canvas to an image
  serializeAsJSON, // Serialize our canvas to JSON. To only update when canvas it's change
} from "@excalidraw/excalidraw";

import { useState } from "react";
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

  const [syncData, setSyncData] = useState<any>(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [_appState, setAppState] = useState<any>(null);

  const { send } = fal.realtime.connect("110602490-sdxl-turbo-realtime", {
    connectionKey: "110602490-lora-realtime",
    onResult: (result) => {
      if (result.error) return;
      setImage(result.images[0].url);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  async function getDataURL(appState = _appState) {
    const elements = excalidrawAPI.getSceneElements();

    if (!elements || !elements.length) return;

    // The Blob object represents a blob, which is a file-like object of immutable, raw data; they can be read as text or binary data, or converted into a ReadableStream so its methods can be used for processing the data.
    // *******
    // Blobs can represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system.

    const blob = await exportToBlob({
      elements,
      exportPadding: 10,
      appState,
      quality: 1,
      files: excalidrawAPI.getFiles(),
      getDimensions: () => {
        return { width: 450, height: 450 };
      },
      mimeType: "image/png",
    });

    return await new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = resolve;

      reader.readAsDataURL(blob);
    }).then((e: any) => e.target.result);
  }

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
          // fetch the new Data
          let dataUrl = await getDataURL();
          // then send the update to the fal API
          send({
            ...baseArgs,
            prompt: value,
            image_url: dataUrl,
          });
        }}
      />

      <div className="flex">
        <div className="w-[636px] h-[570px]">
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            // This callback is triggered whenever the component updates due to any change. This callback will receive the excalidraw elements and the current app state.
            onChange={async (elements, appState) => {
              const newSyncData = serializeAsJSON(
                elements,
                appState,
                excalidrawAPI.getFiles(),
                "local"
              );

              if (newSyncData !== syncData) {
                setAppState(appState);
                setSyncData(newSyncData);
                let dataURL = await getDataURL(appState);

                send({
                  ...baseArgs,
                  prompt: input,
                  image_url: dataURL,
                });
              }
            }}
          />
        </div>
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
