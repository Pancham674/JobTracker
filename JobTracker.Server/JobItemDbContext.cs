using Microsoft.EntityFrameworkCore;

namespace JobTracker.Server
{
	public class JobItemDbContext(DbContextOptions op) : DbContext(op)
	{
		public DbSet<JobItem> JobItems { get; set; }
	}
}
