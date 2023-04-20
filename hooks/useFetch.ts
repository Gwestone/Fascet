import { useState, useEffect } from "react";
import { MosaicAlgorithms } from "../utils/MosaicAlgoritms";

export default function useFetch(
  _base64Data: string,
  _algorithm: MosaicAlgorithms
) {
  const [responseData, setResponseData] = useState<string>();
  const [isLoading, setLoading] = useState(false);

  const [base64Data, setData] = useState<string>(_base64Data);
  const [algorithm, setAlgorithm] = useState<string>(_algorithm);

  const updateInputData = (
    algorithm: MosaicAlgorithms,
    base64String: string
  ) => {
    setData(base64String);
    setAlgorithm(algorithm);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (algorithm == "Initial") {
        setResponseData(base64Data);
      } else {
        const response = await fetch(
          "http://192.168.1.103:5000/mosaics/" + algorithm.toLowerCase(),
          {
            body: JSON.stringify({
              base64_image: base64Data,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          }
        );

        const responseData = await response.text();
        setResponseData(responseData);
        setLoading(false);
      }
      setLoading(false);
    }
    fetchData();
  }, [algorithm, base64Data]);

  return { responseData, isLoading, updateInputData };
}
