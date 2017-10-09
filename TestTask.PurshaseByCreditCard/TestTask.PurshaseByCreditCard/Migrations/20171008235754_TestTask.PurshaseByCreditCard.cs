using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TestTask.PurshaseByCreditCard.Migrations
{
    public partial class TestTaskPurshaseByCreditCard : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CreditCard",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Cardholder = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Cvv = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    ExpDateMonth = table.Column<byte>(type: "tinyint", nullable: false),
                    ExpDateYear = table.Column<short>(type: "smallint", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CreditCard", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Purshase",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreateTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreditCardId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Currency = table.Column<int>(type: "int", nullable: false),
                    Number = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18, 2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Purshase", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Purshase_CreditCard_CreditCardId",
                        column: x => x.CreditCardId,
                        principalTable: "CreditCard",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Purshase_CreateTime",
                table: "Purshase",
                column: "CreateTime");

            migrationBuilder.CreateIndex(
                name: "IX_Purshase_CreditCardId",
                table: "Purshase",
                column: "CreditCardId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Purshase");

            migrationBuilder.DropTable(
                name: "CreditCard");
        }
    }
}
