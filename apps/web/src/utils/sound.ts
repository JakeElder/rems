import qs from "qs";
import { toWords } from "number-to-words";

const numbersToWords = (input: string): string => {
  return input.replace(/\b\d+(,\d+)*(\.\d+)?\b/g, (match) => {
    const number = match.includes(".")
      ? parseFloat(match.replace(/,/g, ""))
      : parseInt(match.replace(/,/g, ""));

    if (match.includes(".")) {
      const [_, fractionalPart] = match.split(".");
      return (
        toWords(number) +
        " point " +
        fractionalPart
          .split("")
          .map((digit) => toWords(parseInt(digit)))
          .join(" ")
      );
    } else {
      return toWords(number);
    }
  });
};

const tidy = (input: string): string => input.replace(/[#_\|\*]/g, "");

export const speak = async (text: string): Promise<void> => {
  const key = "AIzaSyDNhScVj-L5p-BWTtp1mMtnBLLn5mN1cGw";
  const q = qs.stringify({ alt: "json", key });
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?${q}`;

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      audioConfig: { audioEncoding: "MP3" },
      input: { text: tidy(numbersToWords(text)) },
      voice: { languageCode: "th-TH" }
    })
  });

  if (res.ok) {
    const json = await res.json();
    return new Promise((resolve, reject) => {
      var audio = new Audio();
      audio.preload = "auto";
      audio.autoplay = true;
      audio.onerror = () => reject;
      audio.onended = () => resolve();
      audio.src = `data:audio/mp3;base64,${json.audioContent}`;
    });
  }

  return Promise.reject();
};
