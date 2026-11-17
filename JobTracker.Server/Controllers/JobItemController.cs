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
        public record JobPageResult(List<JobItemDTO> MatchedRecords, bool HasNextPage, bool HasPrevPage, int AllRecordsCount);

        [HttpGet]
		public async Task<JobPageResult> Get(string? myStatus, DateOnly myStartDate, DateOnly myEndDate, int myLastShownId = 0, int myPageSize = 10, string myQuery = "")
		{
			int[] statusArr = String.IsNullOrEmpty(myStatus) ? new int[]{ 0, 1, 2, 3 } : JsonSerializer.Deserialize<int[]>(myStatus)!;
			Status[] statusEnums = statusArr.Cast<Status>().ToArray();
            myEndDate = myEndDate == default ? DateOnly.MaxValue : myEndDate;

			//get all records with only the needed attributes and filter them by...
			var allFilteredRecords = _context.JobItems.Select(j => new JobItemDTO
			{
				Id = j.Id,
				Title = j.Title,
				Company = j.Company,
				Status = j.Status,
				ApplyDate = j.ApplyDate
			})
			.Where(j => myStartDate <= j.ApplyDate && j.ApplyDate <= myEndDate &&   //date range
				(String.IsNullOrWhiteSpace(myQuery) || j.Title.Contains(myQuery) || j.Company.Contains(myQuery)) &&     //query for title or company name
				statusEnums.Contains(j.Status))    //status
			.OrderBy(j => j.Id);

			bool hasPrevPage = allFilteredRecords.Any(j => j.Id< myLastShownId);
            int allRecordsCount = allFilteredRecords.Count();
            bool hasNextPage = allRecordsCount > myPageSize;

            //go past the id of the last shown record and only contain the page size
            allFilteredRecords = (IOrderedQueryable<JobItemDTO>)allFilteredRecords.Where(j=>j.Id > myLastShownId).Take(myPageSize);
			var filteredRecordsList = await allFilteredRecords.Take(myPageSize).ToListAsync();

			return new JobPageResult(filteredRecordsList, hasNextPage, hasPrevPage, allRecordsCount);
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