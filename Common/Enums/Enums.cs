using System.ComponentModel.DataAnnotations;

namespace Common.Enums
{
    public static class Enums
    {
        public enum ProjectPriority
        {
            Low = 1,
            Normal = 2,
            High = 3,
            Critical = 4
        }

        public enum ProjectStatus
        {
            [Display(Name = "Project Status")]
            NotStarted = 0,
            [Display(Name = "In-progess")]
            InProgress = 1,
            [Display(Name = "On Hold")]
            OnHold = 2,
            [Display(Name = "Completed")]
            Completed = 3,
            [Display(Name = "Cancelled")]
            Cancelled = 4
        }

     
    }
}
