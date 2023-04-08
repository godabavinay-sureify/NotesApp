import "dotenv/config";

import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import morgan from "morgan";

import "./database/config";

import api from "./routes/api";
import env from "./utils/validateEnvVariables";

const app = express();

const PORT = env.PORT;

app.listen(PORT, () => {
	console.log(`App Listening on PORT: ${PORT}`);
});

app.use(morgan("dev"));

app.use(express.json());

app.use("/api", api);

app.use((_, __, next) => {
	next(createHttpError(404, "Endpoint does not exist"));
});

app.use((error: unknown, _: Request, res: Response, __: NextFunction) => {
	console.error(error);
	let errorMessage = "An unknown error occured.";
	let httpStatusCode = 500;

	if (error instanceof HttpError) {
		httpStatusCode = error.status;
		errorMessage = error.message;
	}

	res.status(httpStatusCode).json({ error: errorMessage });
});
