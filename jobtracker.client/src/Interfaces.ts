export interface IJobItem {
	hyperlinks: Record<LinkType, string>,
	applyDeadline: Date | string,
	hyperlinksJSON: string,
	model: WorkingModels,
	travelTime: Date,
	location: string,
	applyDate: Date,
	company: string,
	status: Status,
	title: string,
	notes: string,
	id: number,
}

export interface IPageInfo {
	filteredRecords: IJobItem[],
	filteredRecordsCount: number,
	hasNextPage: boolean,
	hasPrevPage: boolean,
	lastIdOfPrevPage: number, 
	allRecordsCount: number
}

export interface Filters {
	startDate: string | undefined,
	status: number[] | undefined,
	pageSize: number | undefined,
    lastId: number | undefined,
	endDate: string| undefined,
	query: string | undefined
}

export enum Status {
	Waiting,
	Declined,
	Interviewed,
	Offer
}

export function convertToStatusString(value: number) {
	const status = ["Waiting", "Declined", "Interviewed", "Offer"];
	return status[value];
}

export enum WorkingModels {
	OnSite,
	Hybrid,
	FullRemote
}

export function convertToWorkingModelString(value: number) {
	const workingModels = ["On Site", "Hybrid", "Full Remote"];
	return workingModels[value];
}

export type LinkType = "Jobboard" | "CompanyWebsite" | "CompanyJobListing";

export type PageActions = "Previous" | "Next";

export type ToggleActions = "Hide" | "Show";

export function convertToLinkTypeString(value: number) {
	const linkTypes = ["Job Board", "Company Website", "Company Job Listing"];
	return linkTypes[value];
}

export function getTodaysDate() {
	const date = new Date();
	const day = date.getDate().toString();
	const month = (date.getMonth() +1).toString();
	const todaysDate = `${date.getFullYear()}-${month.length == 1 ? 0 + month: month}-${day.length == 1 ? 0 + day: day}`;	
	return todaysDate;
}