import { User } from "../models/user.dto";
import { usersDB } from "../server";


export const insertUser = async (user: User) => {

    const existente = await usersDB.where('email', '==', user.email).get()
    if (!existente.empty) {
        throw new Error('Usuário com esse email já cadastrado.')
    }

    const newDoc = usersDB.doc();
    return await newDoc.set({ ...user, id: newDoc.id, active: true });
}

export const userAuth = async(email: string, senha: string) => {
    return await usersDB.where('email', '==', email).where('senha', '==', senha).get();
}
