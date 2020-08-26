import express from "express";
import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import proxy from 'http-proxy-middleware';
import { routerAdmin } from "./routes/admin.routes";

dotenv.config();
const app = express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: process.env.DATABASE_URL
});

let db = admin.firestore();
export const collection = db.collection(process.env.APIS_COLLECTION);


app.listen(process.env.PORT || 3000, () => console.log('SERVER STARTED'));

app.use(bodyParser.json());

app.use('/config-admin', routerAdmin);

// app.use('*', proxy.createProxyMiddleware({target: API, changeOrigin: true}));