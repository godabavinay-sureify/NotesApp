import express from "express";
import notesRoute from "./notes";

const router = express.Router();

router.use("/notes", notesRoute);

export default router;
