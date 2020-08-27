import express from 'express';
import * as proxy from 'http-proxy-middleware';
import { getActiveApi } from '../services/admin.service';

export const routerProxy = express.Router();

let activeApiUrl = 'no-url';
let host = 'no-host';

routerProxy.use((req, res, next) => {
    host = req.hostname + ':3000';
    getActiveApi()
        .then(apiDto => {
            activeApiUrl = apiDto.api;
            console.log('Update Active Api: ' + activeApiUrl);
            next();
        })
        .catch(err => res.status(500).send(err));
});

routerProxy.use('*', proxy.createProxyMiddleware({
    target: activeApiUrl,
    changeOrigin: true,
    router: () => activeApiUrl
}));