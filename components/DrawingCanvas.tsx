import React, { useEffect, useState } from "react";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";

import { type Excalidraw } from "@excalidraw/excalidraw";

import {
  serializeAsJSON, // Serialize our canvas to JSON. To only update when canvas it's change
} from "@excalidraw/excalidraw";

// Object Literal Type
export type CanvasChangeEvent = {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  imageData: string;
};

export type DrawingCanvasProps = {
  onCanvasChange: (event: CanvasChangeEvent) => void;
};

// Ensure they're only called in a browser environment.
const isBrowser = typeof window !== "undefined";

export async function blobToBase64(blob: Blob): Promise<string> {
  return await new Promise((resolve) => {
    let reader = new FileReader();
    reader.onload = resolve;

    reader.readAsDataURL(blob);
  }).then((e: any) => e.target.result);
}

export function DrawingCanvas({ onCanvasChange }: DrawingCanvasProps) {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const [ExcalidrawComponent, setExcalidrawComponent] = useState<
    typeof Excalidraw | null
  >(null);

  const [syncData, setSyncData] = useState<any>(null);

  useEffect(() => {
    if (isBrowser) {
      import("@excalidraw/excalidraw").then((comp) =>
        setExcalidrawComponent(comp.Excalidraw)
      );

      const onResize = () => {
        if (excalidrawAPI) {
          excalidrawAPI.refresh();
        }
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }
  }, []);

  async function handleCanvasChanges(
    elements: readonly ExcalidrawElement[],
    appState: AppState
  ) {
    if (!excalidrawAPI || !elements || !elements.length) return;

    // Export our canvas to an image
    const { exportToBlob } = await import("@excalidraw/excalidraw");

    const newSyncData = serializeAsJSON(
      elements,
      appState,
      excalidrawAPI.getFiles(),
      "local"
    );

    if (newSyncData !== syncData) {
      setSyncData(newSyncData);
      // The Blob object represents a blob, which is a file-like object of immutable, raw data; they can be read as text or binary data, or converted into a ReadableStream so its methods can be used for processing the data.
      // *******
      // Blobs can represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system.

      const blob = await exportToBlob({
        elements,
        exportPadding: 10,
        appState,
        quality: 1,
        mimeType: "image/webp",
        files: excalidrawAPI.getFiles(),
        getDimensions: () => {
          return { width: 450, height: 450 };
        },
      });

      const imageData = await blobToBase64(blob);

      return onCanvasChange({
        elements,
        appState,
        imageData,
      });
    }
  }

  return (
    <div className="w-[636px] h-[570px]">
      {ExcalidrawComponent && (
        <ExcalidrawComponent
          autoFocus={true}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          // This callback is triggered whenever the component updates due to any change. This callback will receive the excalidraw elements and the current app state.
          onChange={handleCanvasChanges}
        />
      )}
    </div>
  );
}
