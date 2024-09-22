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

export async function createSubject(subject) {
    const result = await API.graphql({
        query: mutations.createSubject,
        variables: { input: subject }
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

export async function getSubject(id) {
    const result = await API.graphql({
        query: queris.getSubject,
        variables: { id: id }
    });
    return result;
}

export async function getAllKamokus() {
    const result = await API.graphql({
        query: queris.listKamokus,
        variables: { limit: 1000 }
    });
    console.log("------------");
    console.log(result);

    return result;
}


export async function getAllSubejects() {
    const result = await API.graphql({
        query: queris.listSubjects,
        variables: { limit: 1000 }
    });
    console.log("------------");
    console.log(result);

    return result;
}

export async function deleteAllKamokus() {
    let list = await getAllKamokus();
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
    await getAllKamokus();
}


export async function deleteAllSubjects() {
    let list = await getAllSubejects();
    for await (let data of list.data.listSubjects.items) {
        console.log(data);
        const target = {
            id: data.id,
        };
        await API.graphql({
            query: mutations.deleteSubject,
            variables: { input: target }
        });
    }
    console.log("ALL DELETED");
    await getAllSubejects();
}

export async function getSubjectById1AndYear(id1, year) {
    // console.log(`id1: ${id1}`);
    
    const target = {
        id1: id1,
        year: { eq: year },
    };
    
    const result = await API.graphql({
        query: queris.getSubjectById1AndYear,
        variables: target,
    });
    // console.log("------------");
    console.log(result);

    return result;
}

