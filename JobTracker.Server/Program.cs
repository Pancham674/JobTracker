using JobTracker.Server;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string cn = builder.Configuration.GetConnectionString("JobTrackerContext") 
	?? throw new Exception("Missing or wrong connection string.");
builder.Services.AddDbContext<JobItemDbContext>(op => op.UseSqlServer(cn));
// Enable CORS for development and for Swagger UI so browsers can send
// non-GET requests (POST/PUT/DELETE) from the UI without being blocked by preflight.
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowLocal", p => p
		.AllowAnyOrigin()
		.AllowAnyHeader()
		.AllowAnyMethod());
});

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
	app.UseSwagger();
	app.UseSwaggerUI();
}


app.UseRouting();

app.UseCors("AllowLocal");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
