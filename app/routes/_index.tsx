import type { MetaFunction } from "@remix-run/node";
import {useState} from 'react';
import AudioRecorder from "~/components/AudioRecorder/audioLiveStream";
import InputBox from "~/components/InputBox/InputBox";
import StarRating from "~/components/StarComponent/Star";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [response, setResponse] = useState();
  const [loader, setLoader] = useState(false);
  const [audioUrl, setAudioUrl] = useState<URL>(null);

  const audioPrompt = async ({prompt = "extract details from the audio and print a json for this"}) => {
    setLoader(true);
    const session = await window.ai.languageModel.create();
const audio = await fetch(audioUrl);
const audioCtx = new AudioContext();
const arrayBuffer = await audio.arrayBuffer();
const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
const responseAudio = await session.prompt([`transcribe`, { type: "audio", content: audioBuffer}]);
const langv2Audio = await session.prompt(
  `translate to english if not english language for the following sentence. sentence: ${responseAudio}`,
);
console.log("responseAudio", responseAudio);
// const sessionTrans = await window.ai.translator.create({
//   sourceLanguage: 'hi',
//   targetLanguage: 'en'
// })
// await session.translate(responseAudio);
const transformedAudio = await session.prompt(`Analyze the sentiment of the following sentence and rate it on a scale from 1 to 5.

1 indicates very low sentiment (extremely negative),
2 indicates low sentiment (somewhat negative),
3 indicates neutral sentiment (neither positive nor negative),
4 indicates high sentiment (somewhat positive),
5 indicates very high sentiment (extremely positive).
The sentence to analyze is: ${langv2Audio}

Rating Guidelines:
Neutral Sentiment: If the sentence presents both positive and negative aspects equally or if the tone is mixed without strong leanings, rate it 3 (neutral).
Slight Positive Sentiment: If the sentence has a generally neutral tone but leans slightly positive (e.g., a negative statement with a positive counterpoint), rate it 4.
Slight Negative Sentiment: If the sentence has a generally neutral tone but leans slightly negative (e.g., a positive statement with a negative counterpoint), rate it 2.
Very Negative Sentiment: If the sentence is overwhelmingly negative with little or no positive aspect, rate it 1.
Very Positive Sentiment: If the sentence is overwhelmingly positive with no major negative aspects, rate it 5.
Please format the output as: RATE:x example where x is the rating score from 1 to 5, and example is a brief explanation of the sentiment.`)


setResponse(transformedAudio);
setLoader(false);
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <div className="h-[144px] w-[434px]">
            <img
              src="/logo-light.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="https://promos.makemytrip.com/Growth/Images/1x/mmt_dt_top_icon.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <AudioRecorder audioUrl={audioUrl} setAudioUrl={setAudioUrl}/>
          {/* {<span className="leading-6 text-gray-700 dark:text-gray-200" onClick={audioPrompt}>Audio Model Prompts</span>} */}
          {loader && <div role="status">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>}
          {/* {!!response && <span className="leading-normal text-blue-700 hover:underline dark:text-blue-500">{JSON.stringify(response)}</span>} */}
          {!!response && <StarRating ratingText={response}/>}
          <InputBox audioPrompt={audioPrompt} response={response}/>
        </nav>
      </div>
    </div>
  );
}
