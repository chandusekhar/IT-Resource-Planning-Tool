using DTO.Models.TeamMembers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace BAL.Interfaces.TeamMembers
{
    public interface bITeamMembers
    {
        /// <summary>
        /// Method for Adding and Editing the Team Member, 
        /// if EmployeeCode is given, update the record, else create new one 
        /// </summary>
        /// <param name="inputModel"></param>   
        /// <param name="EmployeeCode"></param>
        /// <returns></returns>
        Task EditAsync(TeamMembersModel inputModel, string EmployeeCode="");

        /// <summary>
        /// Method to get all the records of Team Members
        /// </summary>
        /// <returns></returns>
        Task<DataTable> GetAsync();

        /// <summary>
        /// Get the records of Employee by EmployeeCode
        /// </summary>
        /// <param name="EmployeeCode"></param>
        /// <returns></returns>
        Task<DataTable> GetAsync(string EmployeeCode);
        Task<int> TeamMembersCountAsync();

        /// <summary>
        /// Delete the specific record by EmployeeCode
        /// </summary>
        /// <param name="EmployeeCode"></param>
        /// <returns></returns>
        Task DeleteAsync(string EmployeeCode);

        /// <summary>
        /// Get all the project the Member is working on/allocated to
        /// </summary>
        /// <param name="EmployeeCode"></param>
        /// <returns></returns>
        Task<List<TeamMemberProjectsModel>> GetProjects(string EmployeeCode);
    }
}
