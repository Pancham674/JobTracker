import type { Filters, IJobItem } from "../Interfaces";

const BASE_URL = "http://localhost:5155/api/JobItem";

export async function getAllJobItems(pageFilters: Filters){
    const options: RequestInit = { method: 'GET'}
    const url = new URL(BASE_URL);

    if (pageFilters.pageSize) url.searchParams.set("myPageSize", pageFilters.pageSize.toString());
    if (pageFilters.lastId) url.searchParams.set("myLastShownId", pageFilters.lastId.toString());

    if (pageFilters.query) url.searchParams.set("myQuery", pageFilters.query);
    if (pageFilters.status) url.searchParams.set("myStatus", JSON.stringify(pageFilters.status));
    if (pageFilters.endDate) url.searchParams.set("myEndDate", pageFilters.endDate.toString());
    if (pageFilters.startDate) url.searchParams.set("myStartDate", pageFilters.startDate.toString());
    
    return await getData(url.toString(), options);
}

export async function getJobItem(id: number) {
    const options: RequestInit = { method: 'GET'}
    return await getData(`${BASE_URL}/${id}`, options);
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

export async function editJobItem(item: IJobItem) {
    const options: RequestInit = {
        method: 'PUT', 
        headers: {
          'Accept': 'application/json',  
          'Content-Type': 'application/json',  
        },
        body: JSON.stringify(item)
    }

    return await getData(BASE_URL, options);
}

export async function deleteJobItem(id: number){
    const options: RequestInit = { method: 'DELETE' }
    return await getData(`${BASE_URL}/${id}`, options);
}

async function getData(url: string, options: RequestInit) {
    let data;
    const response = await fetch(url, options);
    if (options.method == "GET") data = await response.json();

    if (!response.ok) {
        throw new Error(`The server response for ${url} with the method ${options.method} 
        resulted in a status of ${response.status}.`);
    }

    return data;
}