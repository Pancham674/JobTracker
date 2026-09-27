export interface IJobItem {
	id: number,
	title: string,
	company: string,
	status: Status,
	notes: string,
	workingModels: WorkingModels,
	location: string,
	estimatedDestination: Date,
	applyDate: Date,
	applyDeadline: Date,
	hyperlinks: string[]
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

export function convertToWorkingModelsString(value: number) {
	const workingModels = ["OnSite", "Hybrid", "FullRemote"];
	return workingModels[value];
}