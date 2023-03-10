import express, { Request } from 'express';
import { Response } from 'firebase-functions';
import { listApis, insertApi, getActiveApi, setApiActivity, deleteAllApis } from '../services/admin.service';

export const routerAdmin = express.Router();

routerAdmin.get('/list-apis', (req, res) => {
    listApis()
        .then(apis => res.json(apis))
        .catch(err => res.status(500).send(err));
});

routerAdmin.get('/select-api/:id', (req: express.Request<{id: string}>, res) => {

    const newActiveApiId = req.params.id;

    getActiveApi()
        .then(apiConfig => apiConfig ? setApiActivity(apiConfig.id, false) : null)
        .then(() => setApiActivity(newActiveApiId, true))
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err))
}); 

routerAdmin.post('/create-api', (req: express.Request<{}, {}, {api: string}>, res, next) => {

    if (!req.body.api || !req.body.api.length) {
        res.status(400).send('Api inválida');
        return
    }

    insertApi(req.body.api)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});

routerAdmin.get('/delete-apis/:password', (req: Request<{password: string}>, res) => {
    if (req.params.password !== process.env.ERASE_PASSWORD) {
        res.status(400).send('Senha invalida');
        return
    }

    deleteAllApis()
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err))
});

routerAdmin.get('/mock-metadata', (req: Request, res: Response) => {

    const userAgent = req.headers['user-agent'];
    const lowercase = userAgent.toLowerCase();

    // verifica se o user-agent é um crawler do facebook ou linkedin
    if (lowercase.includes('facebook') || lowercase.includes('linkedin')) {
        res.send(`
            <html>
                <head>              
                    <meta property="og:locale" content="pt_BR">
                    <meta property="og:url" content="https://angular-analytics-6a8b7.web.app">
                    <meta property="og:title" content="Título da página ou artigo">
                    <meta property="og:site_name" content="Nome do meu site">
                    <meta property="og:description" content="Minha boa descrição para intrigar os usuários.">
                    <meta property="og:image" content="https://homologadatasetorial.sebrae-rs.com.br/Api/api/Dica/165/imagem">
                </head>
            </html>
        `);
        return;
    }

    res.redirect('https://angular-analytics-6a8b7.web.app/');
});