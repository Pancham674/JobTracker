const BASE_URL = "http://localhost:5155/api/JobItem";
export function getAllJobItems() {
    const options: RequestInit = { method: 'GET'}
    return getData(BASE_URL, options);
}

async function getData(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return data;
}