import express from "express";
import { addPerson, getAllPeople } from "../controller/peopleController.js";
import upload from "../middleware/upload.js";

const router=express.Router();


router.post("/addperson", upload.single("photo"), addPerson);
router.get("/getpeople", getAllPeople);



export default router;