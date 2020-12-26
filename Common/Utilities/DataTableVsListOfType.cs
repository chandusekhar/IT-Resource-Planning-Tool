using System.Data;
using System.Collections.Generic;
using System.Reflection;
using System.Linq;
using System;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace Common.Utilities
{
    public static class DataTableVsListOfType
    {
        /// <summary>
        /// Cotablvert DataTable to List of target type
        /// </summary>
        /// <typeparam name="TTarget">Target type </typeparam>
        /// <param name="dataTable">DataTable to convert</param>
        /// <returns>List of target type</returns>
        public static List<TTarget> ConvertToTargetTypeList<TTarget>(this DataTable dataTable) where TTarget : new()
        {
            var result = new List<TTarget>();
            if (dataTable.Rows.Count > 0)
            {
                try
                {
                    BindingFlags flags = BindingFlags.Public | BindingFlags.Instance | BindingFlags.NonPublic;
                    var tSourceFieldNames = (from PropertyInfo prop in typeof(TTarget).GetProperties(flags)
                                             select new
                                             {
                                                 Name = prop.Name,
                                                 Type = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType
                                             }
                                            ).ToList();
                    var dataTableFieldNames = (from DataColumn header in dataTable.Columns
                                               select new
                                               {
                                                   Name = header.ColumnName,
                                                   Type = header.DataType
                                               }
                                             ).ToList();
                    var commonFields = tSourceFieldNames.Intersect(dataTableFieldNames).ToList();
                    //var commonFields = tSourceFieldNames.Intersect(dataTableFieldNames).ToList();
                    TTarget tSource;
                    foreach (DataRow row in dataTable.Rows.Cast<DataRow>())
                    {

                        tSource = new TTarget();
                        foreach (var field in dataTableFieldNames)
                        {
                            
                            PropertyInfo propertyInfo = tSource.GetType().GetProperty(field.Name);
                            //Checking for Dbnull value and assigning property value to null added by Joseph gurung
                            object propertyvalue = row[field.Name];
                            if (propertyvalue.Equals(DBNull.Value))
                            {
                                propertyvalue = null;
                            }
                            propertyInfo.SetValue(tSource, propertyvalue, null);
                            //propertyInfo.SetValue(tSource, row[field.Name], null);
                        }

                        result.Add(tSource);
                    }
                }
                catch 
                {

                    //return  result;
                }

            }
            return result;
        }

        /// <summary>
        /// Convert list of source type to DataTable
        /// </summary>
        /// <typeparam name="TSource">Source type</typeparam>
        /// <param name="data">List of source data type</param>
        /// <returns>Return DataTable</returns>
        public static DataTable ConvertToDataTable<TSource>(this IList<TSource> data)
        {
            DataTable dt = new DataTable(typeof(TSource).Name);
            BindingFlags flags = BindingFlags.Public | BindingFlags.Instance;
            PropertyInfo[] props = typeof(TSource).GetProperties(flags);
            foreach (var prop in props)
            {
                dt.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            }
            foreach (TSource item in data)
            {
                var values = new object[props.Length];
                for (int i = 0; i < props.Length; i++)
                {
                    values[i] = props[i].GetValue(item, null);
                }
                dt.Rows.Add(values);
            }
            return dt;
        }


        public static List<T> ConvertDataTableToList<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetRowItem<T>(row);
                data.Add(item);
            }
            return data;
        }

        private static T GetRowItem<T>(DataRow dr) 
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name == column.ColumnName)
                    {
                        var _val = dr[column.ColumnName];
                        if (dr[column.ColumnName] == DBNull.Value)
                        {
                            //_val = (_val == DBNull.Value)? (DateTime?) null : dr[column.ColumnName];
                            _val = null;
                        } 
                        pro.SetValue(obj, _val, null);
                    }                   
                       
                    else
                        continue;
                }
            }
            return obj;
        }

        /// <summary>
        /// Convert DataTable to Respective Model
        /// Author: Gautam Sharma
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dt"></param>
        /// <returns></returns>
        public static T ConvertDataTableToModel<T>(DataRow dr)
        {
            T item = GetRowItem<T>(dr);
            return item;
        }

    }
}
