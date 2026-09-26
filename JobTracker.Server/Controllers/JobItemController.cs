using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace JobTracker.Server.Controllers
{
	[ApiController]
	[Route("api/[controller]/")]
	public class JobItemController(JobItemDbContext context) : ControllerBase
	{
		JobItemDbContext _context = context; 
		
		[HttpGet]
		public IActionResult Get()
		{
			return Ok(_context.JobItems.ToList());
		}

		[HttpGet("{id}")]
		public IActionResult Get(int id)
		{
			return Ok(_context.JobItems.Find(id));
		}

		[HttpPost]
		public IActionResult Post(JobItem jI)
		{
			if (String.IsNullOrWhiteSpace(jI.Title) || (jI.Hyperlinks.Length > 0 
				&& jI.Hyperlinks.All(link => String.IsNullOrWhiteSpace(link))))
			{
				return StatusCode((int)HttpStatusCode.Forbidden);
			}

			_context.JobItems.Add(jI);
			_context.SaveChangesAsync();
			return Ok();
		}

		[HttpPut]
		public IActionResult Put(JobItem jI)
		{
			if (String.IsNullOrWhiteSpace(jI.Title) || (jI.Hyperlinks.Length > 0
				&& jI.Hyperlinks.All(link => String.IsNullOrWhiteSpace(link))))
			{
				return StatusCode((int)HttpStatusCode.Forbidden);
			}

			_context.JobItems.Update(jI);
			_context.SaveChangesAsync();
			return Ok();
		}

		[HttpDelete("{id}")] 
		public IActionResult Delete(int id)
		{
			JobItem toRemove = _context.JobItems.Where(jI => jI.Id == id).First();
			_context.JobItems.Remove(toRemove);
			_context.SaveChangesAsync();
			return NoContent();
		}
	}
}