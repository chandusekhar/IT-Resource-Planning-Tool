using BAL.Interfaces.TeamMembers;
using Common.DbContext;
using DTO.Models.TeamMembers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using static Common.Utilities.DataTableVsListOfType;

namespace BAL.Operations.TeamMembers
{
    public class bTeamMembers : MyDbContext, bITeamMembers
    {
        public async Task EditAsync(TeamMembersModel inputModel, string EmployeeCode = "")
        {
            try
            {
                if (EmployeeCode == "")
                {
                    // Create new Record
                    inputModel.AddedBy = "Admin";
                    inputModel.AddedOn = DateTime.Now;
                    inputModel.UpdatedOn = DateTime.Now;
                    inputModel.TeamMembersId = Guid.NewGuid();
                    await _MyCommand.AddOrEditWithStoredProcedure("insert_teamMembers", null, inputModel, "par_");

                    return;
                }
                // Edit record with specified EmployeeCode
                _MyCommand.Add_Parameter_WithValue("par_EmployeeCode", EmployeeCode);
                inputModel.EmployeeCode = EmployeeCode;
                var employee = await Task.Run(() => _MyCommand.Select_Table("select_teamMembers", CommandType.StoredProcedure));
                if (employee == null)
                {
                    throw new Exception("Employee not found with provided Employee Code");
                }
                await _MyCommand.AddOrEditWithStoredProcedure("update_teamMembers", null, inputModel, "par_");
            }
            catch (Exception ex)
            {
                throw new System.Exception(
                Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bTeamMembers", "EditAsync"));
            }
            finally
            {
                Close_MyDbContext();
            }

        }

        public async Task<DataTable> GetAsync()
        {
            try
            {
                _MyCommand.Clear_CommandParameter();
                _MyCommand.Add_Parameter_WithValue("par_EmployeeCode", null);
                var tblObj = await Task.Run(() => _MyCommand.Select_Table("select_teamMembers", CommandType.StoredProcedure));
                if (tblObj.Rows.Count > 0)
                    return tblObj;
                return null;

            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bTeamMembers", "GetAsync"));
            }
            finally
            {
                Close_MyDbContext();
            }
        }

        public async Task<DataTable> GetAsync(string EmployeeCode)
        {
            try
            {
                _MyCommand.Clear_CommandParameter();
                _MyCommand.Add_Parameter_WithValue("par_EmployeeCode", EmployeeCode);
                var tblObj = await Task.Run(() => _MyCommand.Select_Table("select_teamMembers", CommandType.StoredProcedure));
                if (tblObj.Rows.Count > 0)
                {
                    return tblObj;
                }


                return null;

            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bTeamMembers", "GetAsync(EmployeeCode)"));
            }
            finally
            {
                Close_MyDbContext();
            }
        }

        public async Task DeleteAsync(string EmployeeCode)
        {
            try
            {
                _MyCommand.Clear_CommandParameter();
                _MyCommand.Add_Parameter_WithValue("@par_EmployeeCode", EmployeeCode);

                await Task.Run(() => _MyCommand.Execute_Query("delete_teamMembers", CommandType.StoredProcedure));
            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bTeamMembers", "GetAsync(EmployeeCode)"));
            }
            finally
            {
                Close_MyDbContext();
            }
        }

        public async Task<List<TeamMemberProjectsModel>> GetProjects(string EmployeeCode)
        {
            try
            {
                _MyCommand.Clear_CommandParameter();
                _MyCommand.Add_Parameter_WithValue("@par_EmployeeCode", EmployeeCode);
                var tableObj = await Task.Run(() => _MyCommand.Select_Table("list_projectsByMember", CommandType.StoredProcedure));
                return ConvertDataTableToList<TeamMemberProjectsModel>(tableObj);
            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bTeamMembers", "GetProjects(EmployeeCode)"));
            }
            finally
            {
                Close_MyDbContext();
            }
        }

        public async Task<int> TeamMembersCountAsync()
        {
            try
            {
                _MyCommand.Clear_CommandParameter();
                var _dbObj = await Task.Run(() => _MyCommand.Select_Table("select count(*) from teammembersmaster", CommandType.Text));
                if (_dbObj.Rows.Count <= 0)
                {
                    throw new Exception("Could not get count value");
                    //return 0;
                }
                return Convert.ToInt32(_dbObj.Rows[0].ItemArray[0].ToString());
            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bProjects", "GetAsync(ProjectId)"));
            }
            finally
            {
                Close_MyDbContext();
            }
        }
    }
}
