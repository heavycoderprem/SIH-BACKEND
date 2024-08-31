import {Router} from "express"
import { createSheet, DeleteSheet, getAllSheets, getSingleSheet, ShareSheet, UpdateSheet } from "../controllers/sheet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
router.use(verifyJWT);
router.route("/create-sheet").post(createSheet)
router.route("/user/:userId").get(getAllSheets)
router.route("/:sheetId").get(getSingleSheet)
router.route("/update-sheet/:sheetId").put(UpdateSheet)
router.route("/delete-sheet/:sheetId").delete(DeleteSheet)
router.route("/share/:sheetId").put(ShareSheet)

export default router