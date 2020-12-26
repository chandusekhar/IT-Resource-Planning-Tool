using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Xml.Linq;
using System.Linq;
using MySql.Data.MySqlClient;

namespace Common.Utilities
{
    public static class ErrorCodes
    {
        static string GetErrorCode(string ElementType, string CodeClass, string CodeMethod, string CustomMsg, Exception ex)
        {
            //var dd = Path.Combine(Directory.GetCurrentDirectory());
            XDocument document = XDocument.Load(Path.Combine(Directory.GetCurrentDirectory(), "ErrorCodes.xml"));
            var values = document.Descendants("Codes").Where(i => i.Element("Type").Value == ElementType.Trim() && i.Element("Class").Value == CodeClass.Trim() && i.Element("Method").Value == CodeMethod.Trim()).Select(i => i.Element("Value").Value).Distinct();

            if (CustomMsg != "")
                // return "Source#" + values.ToList()[0].ToString() + ": " + CustomMsg + ">" + ex.Message; 
                return   "Source#1001#" + CustomMsg + ">" + ex.Message;
            else
                return "Source#" + values.ToList()[0].ToString() + "#: We are experiencing server error while processing your request. Inconvenience is regretted." + ">" + ex.Message; 
        }

        internal static string MySqlExceptionMsg(MySqlException ex)
        {
            return ex.Message;
        }

        public static string ProcessException(Exception ex, string ElementType, string CodeClass, string CodeMethod, string CustomMsg = "")
        {
            //if (ex.Message.Contains("Source#1001("))
            //    return ex.Message;
           if (ex.Message.Contains("Source#1001#"))
                return ex.Message;
            else if (ex.Message.Contains("Source#1002#"))
                return ex.Message;
            else if (ex.Message.Contains("Source#1003#"))
                return ex.Message;
            else
                return GetErrorCode(ElementType, CodeClass, CodeMethod, CustomMsg, ex);
        }
        //public static string MySqlExceptionMsg(MySql.Data.MySqlClient.MySqlException ex)
        //{
        //    if (ex.Number == 0)
        //        return "Invalid User, Password or Database";
        //    else if (ex.Number == 1042)
        //        return "Unable to connect Database Server Host";
        //    else if (ex.Number == 1045)
        //        return "Database does not exist";
        //    else if (ex.Number == 1048)
        //        // error: "Column value can not be null";
        //        return "Please fill in the mandatory fields. Column value cannot be null";
        //    else if (ex.Number == 1054)
        //        // return "unknown column in sql query";
        //        return "The specified method for the request is invalid";
        //    else if (ex.Number == 1062)
        //        return "The value was already entered. All entries must be unique";
        //    else if (ex.Number == 1064)
        //        //return "unknown command in mysql query";
        //        return "The specified method for the request is invalid";
        //    else if (ex.Number == 1109)
        //        //return "unknown table in mysql query";
        //        return "Table does not exists.";
        //    else if (ex.Number == 1146)
        //        return "any table, column name does not exist";
        //    else if (ex.Number == 1215)
        //        //return "Cannot add foreign key constraints";
        //        return "The specified method for the request is invalid.Cannot add foreign key constraints";
        //    else if (ex.Number == 1241)
        //        return "operand should contain 1 column";
        //    else if (ex.Number == 1318)
        //        //  return "incorrect number of argument in store procedure";
        //        return "Please provide all the required fields.";
        //    else if (ex.Number == 1451)
        //        //return "Cannot delete or update a parent row: a foreign key constraint fails";
        //        return "Please provide all the required fields.";
        //    else if (ex.Number == 1452)
        //        //return "Cannot add or update a child row: a foreign key constraint fails";
        //        return "Please provide all the required fields.";
        //    else
        //        return "";
        //}
    }
}
