import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { approveMentor, getMentors, rejectMentor } from "../controllers/user.controller.js";

const MentorRoute = express.Router();
MentorRoute.get("/", getMentors);
MentorRoute.put("/:id/approve", protect, admin, approveMentor);
MentorRoute.put("/:id/reject", protect, admin, rejectMentor);

export default MentorRoute;
