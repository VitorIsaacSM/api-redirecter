import { usersDB } from "../server";


export const insertUser = async (user: any) => {
    const newDoc = usersDB.doc();
    return await newDoc.set({ ...user, id: newDoc.id, active: true });
}

export const userAuth = async(email: string, senha: string) => {
    return await usersDB.where('email', '==', email).where('senha', '==', senha).get();
}
