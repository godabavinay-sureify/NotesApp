import mongoose from "mongoose";

import env from "../utils/validateEnvVariables";

const MONGO_CONNECTION_STRING = env.MONGO_CONNECTION_STRING;

mongoose
	.connect(MONGO_CONNECTION_STRING!)
	.then(() => {
		console.log("Connection Established to DB.");
	})
	.catch((error) => {
		console.error("Connection failed to DB.", error);
	});
