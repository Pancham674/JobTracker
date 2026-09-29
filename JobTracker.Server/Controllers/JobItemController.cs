using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Net;

namespace JobTracker.Server.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class JobItemController(JobItemDbContext context) : ControllerBase
	{
		readonly JobItemDbContext _context = context; 

		[HttpGet]
		public IActionResult Get()
		{
			return Ok(_context.JobItems.ToList());
		}

		[HttpGet("{id}")]
		public IActionResult Get(int id)
		{
			JobItem? item = _context.JobItems.Find(id);
			if (item == null) return NotFound();

			item.Hyperlinks = JsonSerializer.Deserialize<Dictionary<LinkType, string>>(item.HyperlinksJSON!)!;
			return Ok(item);
		}

		[HttpPost]
		public async Task<IActionResult> Post([FromBody] JobItem jI)
		{
			if (String.IsNullOrWhiteSpace(jI?.Title)
				|| (jI.Hyperlinks.Count <= 0 && jI.Hyperlinks.All(entry => String.IsNullOrWhiteSpace(entry.Value)))
				)
			{
				return StatusCode((int)HttpStatusCode.Forbidden);
			}

			jI.HyperlinksJSON = JsonSerializer.Serialize(jI.Hyperlinks);

			await _context.JobItems.AddAsync(jI);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(Get), new { id = jI.Id }, jI);
		}

		[HttpPut]
		public async Task<IActionResult> Put([FromBody] JobItem jI)
		{
			if (jI == null || !await _context.JobItems.AnyAsync(i => i.Id == jI.Id)) return BadRequest();

			if (String.IsNullOrWhiteSpace(jI.Title)
				|| (jI.Hyperlinks.Count <= 0 && jI.Hyperlinks.All(entry => String.IsNullOrWhiteSpace(entry.Value)))
				)
			{
				return StatusCode((int)HttpStatusCode.Forbidden);
			}

			jI.HyperlinksJSON = JsonSerializer.Serialize(jI.Hyperlinks);

			_context.JobItems.Update(jI);
			await _context.SaveChangesAsync();
			return Ok();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			JobItem? jI = _context.JobItems.FirstOrDefault(jI => jI.Id == id);
			if (jI == null) return NotFound();

			_context.JobItems.Remove(jI);
			await _context.SaveChangesAsync();
			return NoContent();
		}
	}
}