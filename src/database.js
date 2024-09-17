import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from './amplifyconfiguration.json';
Amplify.configure(config);

import * as mutations from './graphql/mutations';
import * as queris from './graphql/queries';

const API = generateClient();

export async function createKamoku(kamoku) {
    const result = await API.graphql({
        query: mutations.createKamoku,
        variables: { input: kamoku }
    });
    console.log(result);
}

export async function getKamoku(id) {
    const result = await API.graphql({
        query: queris.getKamoku,
        variables: { id: id }
    });
    return result;
}

export async function getAll() {
    const result = await API.graphql({
        query: queris.listKamokus,
        variables: { limit: 1000 }
    });
    console.log("------------");
    console.log(result);

    return result;
}

export async function deleteAll() {
    let list = await getAll();
    for await (let data of list.data.listKamokus.items) {
        console.log(data);
        const target = {
            id: data.id,
        };
        await API.graphql({
            query: mutations.deleteKamoku,
            variables: { input: target }
        });
    }
    console.log("ALL DELETED");
    await getAll();
}
