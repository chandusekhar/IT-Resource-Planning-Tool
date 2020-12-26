using DTO.Models.Projects;
using DTO.Models.ProjectTypes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace BAL.Interfaces.Projects
{
    public interface bIProjects
    {
        /// <summary>
        /// Method to return all the Projects from the database.
        /// </summary>
        /// <returns></returns>
        Task<List<ProjectsModel>> GetAsync();

        /// <summary>
        /// Get the details of the Project by ProjectId
        /// </summary>
        /// <param name="ProjectId"></param>
        /// <returns></returns>
        Task<ProjectsModel> GetAsync(Guid ProjectId);

        /// <summary>
        /// Return the total number of Projects in the database
        /// </summary>
        /// <returns></returns>
        Task<int> ProjectCountAsync();

        /// <summary>
        /// Gets the project's release history, matches the project by ProjectId
        /// </summary>
        /// <param name="ProjectId"></param>
        /// <returns></returns>
        Task<DataTable> GetProjectHistory(Guid ProjectId);

        /// <summary>
        /// Edit or Update the specific Project details by ProjectId
        /// </summary>
        /// <param name="projectsModel"></param>
        /// <param name="ProjectId"></param>
        /// <returns></returns>
        Task EditAsync(ProjectsModel projectsModel, Guid? ProjectId);

        /// <summary>
        /// Method to edit the Project by Project Id
        /// </summary>
        /// <param name="model"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        Task EditProjectTypesAsync(ProjectType model, Guid? id);

        /// <summary>
        /// Delete a Project by Project Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task DeleteProjectTypesAsync(Guid id);

        /// <summary>
        /// Delete specific Project by ProjectId
        /// </summary>
        /// <param name="ProjectId"></param>
        /// <returns></returns>
        Task DeleteAsync(Guid ProjectId);

        /// <summary>
        /// Returns all the Project Types saved
        /// </summary>
        /// <returns></returns>
        Task<DataTable> GetProjectTypes();
    }
}
