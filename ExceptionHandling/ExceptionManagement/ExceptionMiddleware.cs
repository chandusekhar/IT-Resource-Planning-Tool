using ExceptionHandling.LogManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ExceptionHandling.ExceptionManagement
{
   public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogManager _logger;
        public ExceptionMiddleware(RequestDelegate next, ILogManager logger)
        {
            _next = next;
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext httpcontext)
        {
            try
            {
                await _next(httpcontext);
            }
            catch (Exception ex)
            {
                if (ex.Message.StartsWith("Source#"))
                {
                    string[] ErrMsg = ex.Message.Split(">");
                }
                _logger.LogError($"Error: {ex.Message}");
                await HandleExceptionAsync(httpcontext, ex);
            }
        }
        public static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
            string[] ErrMsg = exception.Message.Split(">");
            return context.Response.WriteAsync(new ExceptionModel()
            { StatusCode = context.Response.StatusCode, Message = ErrMsg[0] }.ToString());
        }
    }
}
