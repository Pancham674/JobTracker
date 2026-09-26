namespace JobTracker.Server
{
	public class JobItem
	{
		public int Id { get; set; }
		public required string Title { get; set; }
		public Status Status { get; set; }
		public string? Notes { get; set; }
		public WorkingModels Model { get; set; }
		public string? Location { get; set; }				//May be undefined if it's full remote.
		public string? EstimatedDestination { get; set; }	//How long it'll take to arrive at the location.
		public DateOnly? Deadline { get; set; }				//How long till the job gets taken down. 
		public required string[] Hyperlinks { get; set; }	//Can contain links to the company website, jobboard, etc.
	}

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
}
