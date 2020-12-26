///<summary>
/// Use this file for inserting the default values to database
/// Author: Gautam Sharma
/// CreatedOn: 09/Dec/2020
/// </summary>

using Common.DbContext;
using DTO.Models.TeamMembers;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Common.DataContext
{
    public static class Seed //: MyDbContext
    {
        ///<summary>
        /// Adding Default Team Members
        /// </summary>
        /// 

        private static MyDbContext _dbContext = new MyDbContext();
         
        public static async Task AddTeamMembers()
        {
            List<TeamMembersModel> teamMembers = new List<TeamMembersModel>();
            teamMembers.Add(new TeamMembersModel
            {
                AddedOn = DateTime.Now,
                EmployeeCode = "SBN001",
                EmployeeName = "Gautam Sharma",
                UpdatedOn = DateTime.Now,
                AddedBy = "Gautam Sharma",
                Designation = "Developer"
            });
            teamMembers.Add(new TeamMembersModel
            {
                AddedOn = DateTime.Now,
                EmployeeCode = "SBN002", 
                EmployeeName = "Leela Bhallav Nepal",
                UpdatedOn = DateTime.Now,
                AddedBy = "Gautam Sharma",
                Designation = "Developer"
            });

            teamMembers.Add(new TeamMembersModel
            {
                AddedOn = DateTime.Now,
                EmployeeCode = "SBN003",
                EmployeeName = "Alina Bhutia",
                UpdatedOn = DateTime.Now,
                AddedBy = "Gautam Sharma",
                Designation = "Developer"
            });

            teamMembers.Add(new TeamMembersModel
            {
                AddedOn = DateTime.Now,
                EmployeeCode = "SBN004",
                EmployeeName = "Jaydeep Roy",
                UpdatedOn = DateTime.Now,
                AddedBy = "Gautam Sharma",
                Designation = "Developer"
            });

            teamMembers.Add(new TeamMembersModel
            {
                AddedOn = DateTime.Now,
                EmployeeCode = "SBN005",
                EmployeeName = "Abhishek Pradhan",
                UpdatedOn = DateTime.Now,
                AddedBy = "Gautam Sharma",
                Designation = "Developer"
            });

            teamMembers.Add(new TeamMembersModel
            {
                AddedOn = DateTime.Now,
                EmployeeCode = "SBN006",
                EmployeeName = "Sumitra Gupta",
                UpdatedOn = DateTime.Now,
                AddedBy = "Gautam Sharma",
                Designation = "Developer"
            });

            teamMembers.Add(new TeamMembersModel
            {
                AddedOn = DateTime.Now,
                EmployeeCode = "SBN007", 
                EmployeeName = "Bheem Sharma",
                UpdatedOn =  DateTime.Now,
                AddedBy = "Gautam Sharma",
                Designation = "Developer"
            });
            try
            {
                await Task.Run(() => _dbContext._MyCommand.AddOrEditWithStoredProcedure("insert_teamMembers", teamMembers, null, "par_"));

            }
            catch (Exception ex)
            {
                throw new System.Exception(
                Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bLocation", "SaveAllEntityValues"));
            }
            finally
            {
                _dbContext.Close_MyDbContext();
            }
        }


        //private async Task AddProjects()
        //{
        //    var listProjects = new Projects
        //    {

        //    }
        //}

    }
}
