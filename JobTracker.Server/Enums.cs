namespace JobTracker.Server
{
	public enum Status
	{
		Waiting,
		Declined,
		Interviewed,
		Offer
	}

	public enum WorkingModels
	{
		OnSite,
		Hybrid,
		FullRemote
	}

	public enum LinkType
	{
		Jobboard,				//Indeed, StepStone, LinkedIn, etc...
		CompanyWebsite,			//companies homepage or career endpoint.
		CompanyJobListing		//direct link to the job listing on the companies website
	}
}