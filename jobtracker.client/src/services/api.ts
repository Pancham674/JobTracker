import type { IJobItem } from "../Interfaces";

const BASE_URL = "http://localhost:5155/api/JobItem";
export async function getAllJobItems() {
    const options: RequestInit = { method: 'GET'}
    return await getData(BASE_URL, options);
}

export async function postJobItem(item: IJobItem) {
    const options: RequestInit = {
        method: 'POST', 
        headers: {
          'Accept': 'application/json',  
          'Content-Type': 'application/json',  
        },
        body: JSON.stringify(item)
    }

    return await getData(BASE_URL, options);
}

export async function getJobItem(id: number) {
    const options: RequestInit = { method: 'GET'}
    return await getData(`${BASE_URL}/${id}`, options);
}

async function getData(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(`The server response for ${url} with the method ${options.method} 
        resulted in a status of ${response.status}. ${data.errors.map(e => e)}`);
    }

    return data;
}