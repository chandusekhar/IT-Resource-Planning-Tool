using BAL.Interfaces.Projects;
using Common.DbContext;
using DTO.Models.Projects;
using DTO.Models.ProjectTypes;
using DTO.Models.TeamMembers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using static Common.Utilities.DataTableVsListOfType;

namespace BAL.Operations.Projects
{
    public class bProjects : MyDbContext, bIProjects
    {
        public async Task DeleteAsync(Guid ProjectId)
        {
            try
            {
                _MyCommand.Clear_CommandParameter();
                _MyCommand.Add_Parameter_WithValue("par_ProjectId", ProjectId.ToString());
                await Task.Run(() => _MyCommand.Select_Table($"delete_Project", CommandType.StoredProcedure));
            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bProjects", "DeleteAsync"));
            }
            finally
            {
                Close_MyDbContext();
            }
        }

        public async Task EditAsync(ProjectsModel projectsModel, Guid? ProjectId)
        {
            try
            {
                projectsModel.ProjectId = ProjectId ?? Guid.NewGuid();
                projectsModel.AddedBy = "Admin"; // TODO: Replace with logged in user
                projectsModel.AddedOn = projectsModel.AddedOn == null ? DateTime.Now : projectsModel.AddedOn;
                projectsModel.UpdatedOn = DateTime.Now;
                // Insert Projects First // TODO: look a simpler way to insert projects and childs using single SP

                if (ProjectId != null)
                {
                    // remove old Project and Team Members and update with new ones ! Can be easily done by comparing 2 list if using linq
                    _MyCommand.Clear_CommandParameter();
                    _MyCommand.Add_Parameter_WithValue("par_ProjectId", ProjectId.Value.ToString());
                    _MyCommand.Select_Table($"delete_Project", CommandType.StoredProcedure);

                }
                await _MyCommand.AddOrEditWithStoredProcedure("insert_Projects", null, projectsModel, "par_");

                if (projectsModel.ProjectTeamMembers.Count > 0)
                {
                    // Insert Team Memebers
                    projectsModel.ProjectTeamMembers.ForEach(a => { a.ProjectTeamMembersId = Guid.NewGuid(); a.ProjectId = projectsModel.ProjectId; });
                    await _MyCommand.AddOrEditWithStoredProcedure("insert_projectTeamMembers", projectsModel.ProjectTeamMembers, null, "par_");
                }
                return;
            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bProjects", "EditAsync"));
            }
            finally
            {
                Close_MyDbContext();
            }
        }

        public async Task<List<ProjectsModel>> GetAsync()
        {
            try
            {
                _MyCommand.Clear_CommandParameter();
                var _projects = await Task.Run(() => _MyCommand.Select_Table("select_Projects", CommandType.StoredProcedure));

                var modelData = await Task.Run(() => ConvertDataTableToList<ProjectsModel>(_projects));
                foreach (var item in modelData)
                    GetModelDatas(item);

                return modelData;
            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bProjects", "GetAsync"));
            }
            finally
            {
                Close_MyDbContext();
            }
        }

        private void GetModelDatas(ProjectsModel item)
        {
            if (!string.IsNullOrEmpty(item.ProjectTypeJson))
            {
                item.ProjectType = JsonConvert.DeserializeObject<ProjectType>(item.ProjectTypeJson);
                item.ProjectTypeJson = "";
            }
            if (!string.IsNullOrEmpty(item.ReleaseManagerJson))
            {
                item.ReleaseManager = JsonConvert.DeserializeObject<TeamMembersModel>(item.ReleaseManagerJson);
                item.ReleaseManagerJson = "";
            }

            try
            {
                // load the project history
                var tblObj = _MyCommand.Select_Table($"select * from projectdetails where projectdetails.ProjectId='{item.ProjectId}';", CommandType.Text);
                item.ProjectDetails = ConvertDataTableToList<ProjectDetailModel>(tblObj);

                // load the project Team Member
                _MyCommand.Clear_CommandParameter();
                _MyCommand.Add_Parameter_WithValue("par_ProjectId", item.ProjectId.ToString());
                var _projectTeamMembers = _MyCommand.Select_Table($"getProjectTeamMembers", CommandType.StoredProcedure);
                item.ProjectTeamMembers = ConvertDataTableToList<ProjectTeamMembers>(_projectTeamMembers);
                item.ProjectTeamMembers.ForEach(pt => GetTeamMembers(pt));

            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bProjects", "GetModelDatas(ProjectId)"));
            }
        }

        private void GetTeamMembers(ProjectTeamMembers pt)
        {
            pt.TeamMember = JsonConvert.DeserializeObject<TeamMembersModel>(pt.TeamMemberJson);
            pt.TeamMemberJson = "";
        }

        public async Task<ProjectsModel> GetAsync(Guid ProjectId)
        {
            try
            {
                _MyCommand.Clear_CommandParameter();
                _MyCommand.Add_Parameter_WithValue("par_ProjectId", ProjectId.ToString());
                var tblObj = await Task.Run(() => _MyCommand.Select_Table("select_ProjectsById", CommandType.StoredProcedure));
                var modelData = ConvertDataTableToModel<ProjectsModel>(tblObj.Rows[0]);
                GetModelDatas(modelData);
                return modelData;
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

        public async Task<int> ProjectCountAsync()
        {
            try
            {
                _MyCommand.Clear_CommandParameter();
                var _dbObj = await Task.Run(() => _MyCommand.Select_Table("select count(*) from projectsmaster;", CommandType.Text));
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

        public async Task<DataTable> GetProjectHistory(Guid ProjectId)
        {
            try
            {
                _MyCommand.Clear_CommandParameter();
                _MyCommand.Add_Parameter_WithValue("par_ProjectId", ProjectId.ToString());
                var tblObj = await Task.Run(() => _MyCommand.Select_Table("getProjectHistory", CommandType.StoredProcedure));
                return tblObj;
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

        public async Task<DataTable> GetProjectTypes()
        {

            try
            {
                var tblObj = await Task.Run(() => _MyCommand.Select_Table("select * from projecttypemaster", CommandType.Text));
                return tblObj;
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

        public async Task EditProjectTypesAsync(ProjectType model, Guid? id)
        {
            try
            {
                if (id == null)// insert 
                    await Task.Run(() => _MyCommand.Execute_Query($"insert into projecttypemaster values ('{Guid.NewGuid()}', '{model.Type}');", CommandType.Text));
                else
                    await Task.Run(() => _MyCommand.Execute_Query($"update projecttypemaster set Type = '{model.Type}' where ProjectTypeId = '{id.Value}';", CommandType.Text));
                return;
            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bProjects", "EditProjectTypesAsync(ProjectId)"));
            }
            finally
            {
                Close_MyDbContext();
            }
        }

        public async Task DeleteProjectTypesAsync(Guid id)
        {
            try
            {
                await Task.Run(() => _MyCommand.Execute_Query($"delete from projecttypemaster where ProjectTypeId = '{id}';", CommandType.Text));
                return;
            }
            catch (Exception ex)
            {
                throw new System.Exception(
                    Common.Utilities.ErrorCodes.ProcessException(ex, "BAL", "bProjects", "EditProjectTypesAsync(ProjectId)"));
            }
            finally
            {
                Close_MyDbContext();
            }
        }
    }
}
