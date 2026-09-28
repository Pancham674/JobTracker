using System.ComponentModel.DataAnnotations;

namespace JobTracker.Server
{
	public class JobItem
	{
		public int Id { get; set; }
		public required string Title { get; set; }
		public required string Company { get; set; }
		public required Status Status { get; set; }
		[MaxLength(500)] public string? Notes { get; set; }
		public required WorkingModels Model { get; set; }
		public string? Location { get; set; }					//May be undefined if it's full remote.
		public TimeSpan? EstimatedDestination { get; set; }		//How long it'll take to arrive at the location.
		public required DateOnly ApplyDate { get; set; } 
		public DateOnly? ApplyDeadline { get; set; }	        //How long till the job gets taken down. 
		public required Dictionary<string, string>[] Hyperlinks { get; set;	}		//Can contain links to the company website, jobboard, etc.
	}
}