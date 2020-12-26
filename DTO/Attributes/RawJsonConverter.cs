using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text; 

namespace DTO.Attributes
{
	public sealed class RawJsonConverter : JsonConverter
	{
		public override bool CanConvert(Type objectType)
		{
			return (objectType == typeof(string));
		}

		public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			// assumes string is already JSON
			writer.WriteRawValue((string)value); 
		}

		public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
		{
			return Newtonsoft.Json.Linq.JToken.Load(reader).ToString(Formatting.None);
		}
	}
}
