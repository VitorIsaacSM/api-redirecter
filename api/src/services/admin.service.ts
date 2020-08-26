import { collection } from "../server";
import { ApiDTO } from '../models/api.dto';

export const listApis = async(): Promise<ApiDTO[]> => {
    return (await collection.get()).docs.map(doc => doc.data()) as ApiDTO[];
}

export const insertApi = async(api: string) => {
    const newDoc = collection.doc();
    return await newDoc.set({ api, id: newDoc.id, active: false });
}

export const getActiveApi = async(): Promise<ApiDTO> => {
    const docs = (await collection.where('active', '==', true).get()).docs;
    return docs.length && docs[0] ? docs[0].data() as ApiDTO : null; 
}

export const setApiActivity = async(id: string, active: boolean) => {
    return await collection.doc(id).update({active});
}

export const deleteAllApis = async() => {
    const apis = await listApis();
    return Promise.all(apis.map(async(api) => await collection.doc(api.id).delete()));
}