import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import serversRouter from "./servers";
import reviewsRouter from "./reviews";
import emailsRouter from "./emails";
import subscribersRouter from "./subscribers";
import plansRouter from "./plans";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(serversRouter);
router.use(reviewsRouter);
router.use(emailsRouter);
router.use(subscribersRouter);
router.use(plansRouter);

export default router;
