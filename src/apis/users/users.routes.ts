import express from "express";

const router = express.Router();

import { signup, signin, getUsers } from "./users.controllers";
import { Authorize } from "../../middlewares/Authorize";

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/", Authorize, getUsers);

export default router;
