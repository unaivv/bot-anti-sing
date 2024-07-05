import child_process from 'child_process';
import { recognizeTextFromAudio } from './transcription';
import fs from 'fs';

export const convertFile = async (filename: string) => {
    const { exec } = child_process;
    const command = `ffmpeg -f s16le -ar 48k -ac 2 -i  ${filename} ${filename.replace('.pcm', '.wav')}`;

    exec(command, async (error: any, stdout: any, stderr: any) => {
        if (error) {
            console.error(`Error converting file with ffmpeg: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        //remove pcm file
        fs.unlink(filename, (err) => {
            if (err) {
                console.error(err)
                return
            }
            console.log('PCM file deleted!')
        })
        const result = await recognizeTextFromAudio(filename.replace('.pcm', '.wav'))
        if(result === "Error")
            return "Error"
    });
}