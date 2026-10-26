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

export function convertToLinkTypeString(value: number) {
	const linkTypes = ["Job Board", "Company Website", "Company Job Listing"];
	return linkTypes[value];
}