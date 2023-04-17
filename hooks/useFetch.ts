import { MosaicAlgorithms } from "../utils/MosaicAlgoritms";
import { useEffect, useState } from "react";

export function useFetch(imageString: string, algorithm: MosaicAlgorithms) {
  const baseUrl = "http://192.168.1.103:5000";
  const [imageData, setImageData] = useState<string>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(baseUrl + "/mosaics/voronoi", {
          body: JSON.stringify({
            base64: imageString,
          }),
        });
        const data = await response.json();
        setImageData(data);
      } catch (error: unknown) {
        setError(error);
      }
    };
    fetchData();
  }, [imageString]);
  return { imageData, error };
}
