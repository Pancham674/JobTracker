export interface IJobItem {
	hyperlinks: Record<LinkType, string>,
	estimatedDestination: Date,
	hyperlinksJSON: string,
	model: WorkingModels,
	applyDeadline: Date | string,
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
	const workingModels = ["OnSite", "Hybrid", "FullRemote"];
	return workingModels[value];
}

export type LinkType = "Jobboard" | "CompanyWebsite" | "CompanyJobListing";

export function convertToLinkTypeString(value: number) {
	const linkTypes = ["Jobboard", "CompanyWebsite", "CompanyJobListing"];
	return linkTypes[value];
}