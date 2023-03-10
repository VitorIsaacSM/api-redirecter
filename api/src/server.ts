import express from "express";
import admin, { ServiceAccount } from 'firebase-admin';
import * as functions from 'firebase-functions';
import serviceAccount from './serviceAccountKey.json';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { routerAdmin } from "./routes/admin.routes";
import { routerProxy } from "./routes/proxy.route";
import { routerUser } from "./routes/user.routes";

dotenv.config();
const app = express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: 'https://burger-app-2ccdf.firebaseio.com'
});

let db = admin.firestore();
export const collection = db.collection('apis');
export const usersDB = db.collection('users')


app.listen(process.env.PORT || 3000, () => console.log('SERVER STARTED'));

app.use(bodyParser.json());

app.use('/config-admin', routerAdmin);
app.use('/usuario', routerUser);

app.use('*', routerProxy);

exports.app = functions.https.onRequest(app);