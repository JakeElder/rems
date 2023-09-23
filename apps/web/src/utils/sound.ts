import qs from "qs";

export const speak = async (text: string): Promise<void> => {
  const key = "AIzaSyDNhScVj-L5p-BWTtp1mMtnBLLn5mN1cGw";
  const q = qs.stringify({ alt: "json", key });
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?${q}`;

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      audioConfig: { audioEncoding: "MP3" },
      input: { text },
      voice: { languageCode: "th-TH" }
    })
  });

  if (res.ok) {
    const json = await res.json();

    const url = `data:audio/mp3;base64,${json.audioContent}`;
    const audio = new Audio(url);
    audio.play();
  }
};
