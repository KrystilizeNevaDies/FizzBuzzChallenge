using System.Text.Json;
using FizzBuzzService.Utilities;
using FizzBuzzService.Utilities.Json;
namespace FizzBuzzService.Models;

public record struct Game(string DisplayName, ICondition condition)
{
    public static Game Parse(string json)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Converters = {
                new UnionConverter<ICondition>.Factory(),
                new UnionConverter<IStrValue>.Factory(),
                new UnionConverter<INumValue>.Factory()
            }
        };
        return JsonSerializer.Deserialize<Game>(json, options);
    }
}

public record struct Context(double Query, string Response);

[UnionTag("type")]
[UnionCase(typeof(Literal), "literal")]
[UnionCase(typeof(NumEquals), "num-equals")]
[UnionCase(typeof(StrEquals), "str-equals")]
[UnionCase(typeof(All), "all")]
[UnionCase(typeof(First), "first")]
[UnionCase(typeof(Blank), "blank")]
public interface ICondition
{
    bool Evaluate(Context context);

    public record struct Literal(bool value) : ICondition
    {
        public bool Evaluate(Context context) => value;
    }

    public record struct NumEquals(List<INumValue> values) : ICondition
    {
        public bool Evaluate(Context context)
        {
            var doubles = values.Select(value => value.Evaluate(context)).ToList();
            return doubles.Count != 0 && doubles.All(value => Utils.EqualsTolerant(value, doubles[0]));
        }
    }

    public record struct StrEquals(List<IStrValue> values) : ICondition
    {
        public bool Evaluate(Context context)
        {
            var strings = values.Select(value => value.Evaluate(context)).ToList();
            return strings.Count != 0 && strings.All(value => value.Equals(strings[0]));
        }
    }

    public record struct All(List<ICondition> conditions) : ICondition
    {
        public bool Evaluate(Context context) => conditions.All(condition => condition.Evaluate(context));
    }

    public record struct First(List<First.Candidate> candidates) : ICondition
    {

        public bool Evaluate(Context context)
        {
            foreach (var candidate in candidates)
            {
                if (candidate.test.Evaluate(context))
                {
                    return candidate.value.Evaluate(context);
                }
            }
            return false;
        }

        public record struct Candidate(ICondition test, ICondition value);
    }

    public record struct Blank : ICondition
    {
        public bool Evaluate(Context context) => false;
    }
}

[UnionTag("type")]
[UnionCase(typeof(Literal), "literal")]
[UnionCase(typeof(Response), "response")]
[UnionCase(typeof(Blank), "blank")]
public interface IStrValue
{
    string Evaluate(Context context);

    public record struct Literal(string value) : IStrValue
    {
        public string Evaluate(Context context) => value;
    }

    public record struct Response : IStrValue
    {
        public string Evaluate(Context context) => context.Response;
    }

    public record struct Blank : IStrValue
    {
        public string Evaluate(Context context) => "";
    }
}

[UnionTag("type")]
[UnionCase(typeof(Literal), "literal")]
[UnionCase(typeof(Query), "query")]
[UnionCase(typeof(Mod), "mod")]
[UnionCase(typeof(FromString), "from-string")]
[UnionCase(typeof(Blank), "blank")]
public interface INumValue
{
    double Evaluate(Context context);

    public record struct Literal(double value) : INumValue
    {
        public double Evaluate(Context context) => value;
    }

    public record struct Query : INumValue
    {
        public double Evaluate(Context context) => context.Query;
    }

    public record struct Mod(INumValue a, INumValue N) : INumValue
    {
        public double Evaluate(Context context) => a.Evaluate(context) % N.Evaluate(context);
    }

    public record struct FromString(IStrValue str) : INumValue
    {
        public double Evaluate(Context context)
        {
            try
            {
                return double.Parse(str.Evaluate(context));
            }
            catch (FormatException)
            {
                return double.NaN;
            }
        }
    }

    public record struct Blank : INumValue
    {
        public double Evaluate(Context context) => double.NaN;
    }
}
