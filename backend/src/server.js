import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import {functions, inngest} from './config/inngest.js';
import { serve } from "inngest/express";

const app = express();
app.use(express.json());//access to req.body

import { inngest } from './config/inngest.js';
import { serve } from 'inngest/express';
import { functions } from './config/inngest.js';
app.use(clerkMiddleware());//req.auth will be available in the request object

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const startServer = async () => {
    try {
        await connectDB(); 
        if (ENV.NODE_ENV === 'development') {
            console.log('Connected to the port:', ENV.PORT );
        }     
    }
    catch (error) {
        console.error('Failed to connect to the server', error);
        process.exit(1);
    }
}

startServer();
export default app; 