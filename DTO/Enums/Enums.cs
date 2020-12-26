namespace DTO.Enums
{
    public static class Enums
    {
        public enum ProjectPriority
        {
            Low = 2,
            Normal = 4,
            High = 3,
            Critical = 1
        }

        public enum ProjectStatus
        {
            NotStarted = 3,
            InProgress = 1,
            OnHold = 2,
            Completed = 4,
            Cancelled = 5
        }
    }
}
