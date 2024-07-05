import { config } from "../config";
import fs from "fs";
import { createClient } from "@deepgram/sdk";

const removeFile = (filename: string) => {
    fs.unlink(filename, (err) => {
        if (err) {
            console.error(err)
            return
        }
        console.log('WAV file deleted!')
    })
}

export const recognizeTextFromAudio = async (filename: string) => {
    console.log(filename)
    const deepgram = createClient(config.DEEPGRAM_APIKEY);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        fs.readFileSync(filename),
        {
            model: "nova-2",
            smart_format: true,
            language: "es-ES",
        }
    );

    if (error) throw error;

    try{
        //@ts-ignore
        const transcription = result.results.channels[0].alternatives[0].transcript;
        console.log(result.results.channels[0].alternatives[0].transcript)
        return transcription
        removeFile(filename)
    }catch(e){
        console.log(e)
        removeFile(filename)
        return "Error"
    }
    
}