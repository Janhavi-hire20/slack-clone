import "../instrument.mjs";//sentry instrumentation must be the first import
import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import { functions, inngest } from './config/inngest.js';
import { serve } from "inngest/express";
import chatRoutes from './routes/chat.route.js';
import * as Sentry from "@sentry/node";
import cors from 'cors';

const app = express();
app.use(express.json());//access to req.body
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));//enable CORS for all routes


app.use(clerkMiddleware());//req.auth will be available in the request object

app.get("/debug-sentry", (req, res) => {
    throw new Error("Sentry debug error!");
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

Sentry.setupExpressErrorHandler(app);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            if (ENV.NODE_ENV === 'development') {
                console.log('Connected to the port:', ENV.PORT);
            }
        });
    }
    catch (error) {
        console.error('Failed to connect to the server', error);
        process.exit(1);
    }
}

startServer();
export default app; 