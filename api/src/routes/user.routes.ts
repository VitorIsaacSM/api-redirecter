import express, { Request } from 'express';
import { Response } from 'firebase-functions';
import { User } from '../models/user.dto';
import { insertUser, userAuth } from '../services/user.service';


export const routerUser = express.Router();

routerUser.post('/autenticacao', (req: express.Request<{ email: string, senha: string }>, res) => {

  userAuth(req.body.email, req.body.senha)
    .then((user) => {
      const fetchedUser = user.docs[0].data()
      delete fetchedUser.senha
      res.status(200).json({
        token: 'AAAAAAAAAAAAAAA_TOKEN_MOCKADO',
        ...fetchedUser
      })
      return
    })
    .catch(err => res.status(401).json({ message: 'Falha na autenticação', ...err }))
});

routerUser.post('/cadastro', (req: express.Request<{}, {}, User>, res, next) => {

  if (!req.body || !req.body) {
    res.status(400).send('Api inválida');
    return
  }

  insertUser(req.body)
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.log(err)
      res.status(400).json({ message: 'Usuário com esse email já cadastrado' })
    });
});