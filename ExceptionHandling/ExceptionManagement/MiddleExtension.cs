using Microsoft.AspNetCore.Builder;

namespace ExceptionHandling.ExceptionManagement
{
    public static class MiddleExtension
    {
        public static void ConfigureExceptionMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionMiddleware>();
        }
    }
}
