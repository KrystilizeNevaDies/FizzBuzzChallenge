using System.Buffers;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
namespace FizzBuzzService.Utilities.Json;

public sealed class UnionConverter<T> : JsonConverter<T>
{
    private string TagPropertyName { get; }

    private Dictionary<string, Type> UnionTypes { get; }

    public UnionConverter()
    {
        var type = typeof(T);
        var unionTag = type.GetCustomAttribute<UnionTagAttribute>();
        if (unionTag is null) throw new InvalidOperationException("Union types must have a tag property.");

        var concreteTypeFactory = type.CreateConcreteTypeFactory();
        TagPropertyName = unionTag.JsonPropertyName;
        UnionTypes = type.GetCustomAttributes<UnionCaseAttribute>()
            .ToDictionary(k => k.TagPropertyValue, e => concreteTypeFactory(e.CaseType));
    }

    public override T? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using var document = JsonDocument.ParseValue(ref reader);
        var propertyName = options.PropertyNamingPolicy?.ConvertName(TagPropertyName) ?? TagPropertyName;
        var property = document.RootElement.GetProperty(propertyName);
        var type = UnionTypes[property.GetString() ?? throw new InvalidOperationException("Union tag property must be a string.")];
        return (T?) document.ToObject(type, options);
    }

    public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options) =>
        JsonSerializer.Serialize(writer, value, value!.GetType(), options);

    public sealed class Factory : JsonConverterFactory
    {
        public override bool CanConvert(Type typeToConvert) =>
            typeToConvert.GetCustomAttribute<UnionTagAttribute>(false) is not null;

        public override JsonConverter? CreateConverter(Type typeToConvert, JsonSerializerOptions options)
        {
            var converterType = typeof(UnionConverter<>).MakeGenericType(typeToConvert);
            return (JsonConverter?)Activator.CreateInstance(converterType);
        }
    }
}

public static class TypeExtensions
{
    public static Func<Type, Type> CreateConcreteTypeFactory(this Type type)
    {
        if (!type.IsGenericType)
        {
            return givenType => givenType;
        }

        var genericArgs = type.GetGenericArguments();
        return givenType => givenType.MakeGenericType(genericArgs);
    }
}

public static class JsonExtensions
{
    private static object? ToObject(this JsonElement element, Type type, JsonSerializerOptions options)
    {
        var bufferWriter = new ArrayBufferWriter<byte>();
        using (var writer = new Utf8JsonWriter(bufferWriter))
        {
            element.WriteTo(writer);
        }
        return JsonSerializer.Deserialize(bufferWriter.WrittenSpan, type, options);
    }

    public static object? ToObject(this JsonDocument document, Type type, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(document);
        return document.RootElement.ToObject(type, options);
    }
}