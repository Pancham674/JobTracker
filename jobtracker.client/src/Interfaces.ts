export interface IJobItem {
	workingModels: WorkingModels,
	hyperlinks: [string, string],
	estimatedDestination: Date,
	applyDeadline: Date,
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