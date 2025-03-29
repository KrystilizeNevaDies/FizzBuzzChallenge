namespace FizzBuzzService.Utilities.Json;

[AttributeUsage(AttributeTargets.Interface)]
public sealed class UnionTagAttribute : Attribute
{
    public string JsonPropertyName { get; }

    public UnionTagAttribute(string jsonPropertyName) => JsonPropertyName = jsonPropertyName;
}

[AttributeUsage(AttributeTargets.Interface, AllowMultiple = true)]
public sealed class UnionCaseAttribute : Attribute
{
    public Type CaseType { get; }
    public string TagPropertyValue { get; }

    public UnionCaseAttribute(Type caseType, string tagPropertyValue)
    {
        CaseType = caseType;
        TagPropertyValue = tagPropertyValue;
    }
}
