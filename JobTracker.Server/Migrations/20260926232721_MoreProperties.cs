using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class MoreProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Deadline",
                table: "JobItems",
                newName: "ApplyDeadline");

            migrationBuilder.AddColumn<DateOnly>(
                name: "ApplyDate",
                table: "JobItems",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "JobItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplyDate",
                table: "JobItems");

            migrationBuilder.DropColumn(
                name: "Company",
                table: "JobItems");

            migrationBuilder.RenameColumn(
                name: "ApplyDeadline",
                table: "JobItems",
                newName: "Deadline");
        }
    }
}
