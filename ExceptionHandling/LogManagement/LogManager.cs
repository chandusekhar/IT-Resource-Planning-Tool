using NLog;

namespace ExceptionHandling.LogManagement
{
    public class LogManager : ILogManager
    {
        private static ILogger _logger = NLog.LogManager.GetCurrentClassLogger();


        public void LogInfo(string message)
        {
            _logger.Debug(message);
        }
        public void LogWarn(string message)
        {
            _logger.Debug(message);
        }
        public void LogDebug(string message)
        {
            _logger.Debug(message);
        }
        public void LogError(string message)
        {
            _logger.Debug(message);
        }
    }
}
