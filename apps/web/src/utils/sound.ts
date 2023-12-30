import qs from "qs";
import { toWords } from "number-to-words";

// "voice": {
//   "languageCode": "cmn-CN",
//   "name": "cmn-CN-Standard-A"
// }

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

const tidy = (input: string): string => input.replace(/[^\w\s.,;!?()-]/g, "");

export const speak = async (text: string): Promise<void> => {
  const key = "AIzaSyDNhScVj-L5p-BWTtp1mMtnBLLn5mN1cGw";
  const q = qs.stringify({ alt: "json", key });
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?${q}`;

  console.log(tidy(numbersToWords(text)));

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      input: { text: tidy(numbersToWords(text)) },
      audioConfig: {
        audioEncoding: "MP3",
        effectsProfileId: ["small-bluetooth-speaker-class-device"],
        pitch: 0,
        speakingRate: 1.2
      },
      voice: { languageCode: "th-TH" }
    })
  });

  if (res.ok) {
    const json = await res.json();
    return new Promise((resolve, reject) => {
      var audio = new Audio();
      audio.onerror = () => reject;
      audio.onended = () => resolve();
      audio.src = `data:audio/mp3;base64,${json.audioContent}`;
      audio.play();
    });
  }

  return Promise.reject();
};
