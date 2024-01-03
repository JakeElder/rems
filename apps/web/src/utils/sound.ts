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

const tidy = (input: string): string => {
  return input.replace(
    /[*#\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}]/gu,
    ""
  );
};

export const speak = async (text: string): Promise<void> => {
  const key = "AIzaSyDNhScVj-L5p-BWTtp1mMtnBLLn5mN1cGw";
  const q = qs.stringify({ alt: "json", key });
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?${q}`;

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      input: { text: tidy(numbersToWords(text)) },
      audioConfig: {
        audioEncoding: "MP3",
        effectsProfileId: ["small-bluetooth-speaker-class-device"],
        pitch: 0,
        speakingRate: 1.15
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
