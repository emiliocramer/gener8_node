import {client} from "@gradio/client";
import {promises as fs} from 'fs';

export async function run(promptUsed) {
	global.window = {
		location: {}
	};

	const app = await client("https://emiliocramer-prototypeone.hf.space/");
	console.log("building result")

	const result = await app.predict(2, [
		"facebook/musicgen-melody", // string in 'Model' Radio component
		"", // string in 'Model Path (custom models)' Textbox component
		"Default", // string in 'Decoder' Radio component
		promptUsed, // string in 'Input Text' Textbox component
		null,
		60, // number (numeric value between 1 and 120) in 'Duration' Slider component
		5, // number in 'Top-k' Number component
		5, // number in 'Top-p' Number component
		5, // number in 'Temperature' Number component
		5, // number in 'Classifier Free Guidance' Number component
	]);

	const audioFilePath = result.data[1].name;
	console.log('Full audio file path:', audioFilePath);

	try {
		console.log('Attempting to read file...');
		const tempFilePath = '/app/tmp/generated_audio.wav';
		await fs.copyFile(audioFilePath, tempFilePath);
		return await fs.readFile(tempFilePath);
	} catch (error) {
		console.error('Error reading or copying file:', error);
		throw error;
	}
}
