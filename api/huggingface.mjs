import {client} from "@gradio/client";

export async function run(promptUsed) {
	global.window = {
		location: {}
	};

	const app = await client("https://emiliocramer-prototypeone.hf.space/");
	const fs = require("fs");
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
	return await fs.readFile(audioFilePath);
}
