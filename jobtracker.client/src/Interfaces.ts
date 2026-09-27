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

export enum WorkingModels {
	OnSite,
	Hybrid,
	FullRemote
}