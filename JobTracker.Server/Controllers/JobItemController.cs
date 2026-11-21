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
        public record JobPageResult(List<JobItemDTO> FilteredRecords, bool HasNextPage, bool HasPrevPage, int FilteredRecordsCount, int LastIdOfPrevPage, int AllRecordsCount);

        [HttpGet]
		public async Task<JobPageResult> Get(string? myStatus, DateOnly myStartDate, DateOnly myEndDate, int myLastShownId = 0, int myPageSize = 10, string myQuery = "")
		{	//get defaults of status and endDate if not specified
			int[] statusArr = String.IsNullOrEmpty(myStatus) ? new int[]{ 0, 1, 2, 3 } : JsonSerializer.Deserialize<int[]>(myStatus)!;
			Status[] statusEnums = statusArr.Cast<Status>().ToArray();
            myEndDate = myEndDate == default ? DateOnly.MaxValue : myEndDate;

            //get all records with only the needed attributes and filter them by date range, query for title or company name, and status
            var allFilteredRecords = _context.JobItems.Select(j => new JobItemDTO
            {
                Id = j.Id,
                Title = j.Title,
                Company = j.Company,
                Status = j.Status,
                ApplyDate = j.ApplyDate
            })
            .Where(j => myStartDate <= j.ApplyDate && j.ApplyDate <= myEndDate &&
                (String.IsNullOrWhiteSpace(myQuery) || j.Title.Contains(myQuery) || j.Company.Contains(myQuery)) &&
                statusEnums.Contains(j.Status))
            .OrderBy(j => j.Id);

            //limit the records by id of the last shown record and page size
            var filteredRecordsList = await allFilteredRecords.Where(j => j.Id > myLastShownId)
                                                              .Take(myPageSize)
                                                              .ToListAsync();
            //take the last id of the previous page in case the user want to go back (will in exclude "missing"/deleted ids)
            int lastIdOfPrevPage = allFilteredRecords.OrderByDescending(j => j.Id)
                                                     .Where(j => j.Id < myLastShownId)
                                                     .Take(myPageSize)
                                                     .Select(j => j.Id)
                                                     .LastOrDefault() - 1;
            int minId = filteredRecordsList.Count == 0 ? 0 : filteredRecordsList.Min(j => j.Id);
            int maxId = filteredRecordsList.Count == 0 ? 0 : filteredRecordsList.Max(j => j.Id);

            bool hasPrevPage = allFilteredRecords.Any(j => j.Id < minId);	//smaller id exists in allFilteredRecords = prevPage exists
            bool hasNextPage = allFilteredRecords.Any(j => j.Id > maxId);	//bigger id exists in allFilteredRecords = nextPage exists

			return new JobPageResult(filteredRecordsList, hasNextPage, hasPrevPage, allFilteredRecords.Count(), lastIdOfPrevPage, _context.JobItems.Count());
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