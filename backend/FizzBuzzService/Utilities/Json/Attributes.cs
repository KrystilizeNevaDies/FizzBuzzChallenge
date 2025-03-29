namespace FizzBuzzService.Utilities.Json;

[AttributeUsage(AttributeTargets.Class)]
public sealed class UnionTagAttribute (string jsonPropertyName) : Attribute
{
    public string JsonPropertyName { get; } = jsonPropertyName;

}

[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public sealed class UnionCaseAttribute (Type caseType, string tagPropertyValue) : Attribute
{
    public Type CaseType { get; } = caseType;
    public string TagPropertyValue { get; } = tagPropertyValue;

}
