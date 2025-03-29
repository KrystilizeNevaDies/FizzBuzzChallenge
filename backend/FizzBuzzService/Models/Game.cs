using System.Text.Json;
using System.Text.Json.Serialization;
using FizzBuzzService.Utilities;
using FizzBuzzService.Utilities.Json;
namespace FizzBuzzService.Models;

public class Game(string DisplayName, Condition condition)
{
    [JsonRequired]
    public string DisplayName { get; init; } = DisplayName;

    [JsonRequired]
    public Condition condition { get; init; } = condition;

    public static Game Parse(string json)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Converters = {
                new UnionConverter<Condition>.Factory(),
                new UnionConverter<StrValue>.Factory(),
                new UnionConverter<NumValue>.Factory()
            }
        };
        return JsonSerializer.Deserialize<Game>(json, options)!;
    }
}

public record Context(double Query, string Response);

[UnionTag("type")]
[UnionCase(typeof(Literal), "literal")]
[UnionCase(typeof(NumEquals), "num-equals")]
[UnionCase(typeof(StrEquals), "str-equals")]
[UnionCase(typeof(All), "all")]
[UnionCase(typeof(First), "first")]
[UnionCase(typeof(Blank), "blank")]
public abstract class Condition
{
    public abstract string type { get; init; }

    public abstract bool Evaluate(Context context);

    public class Literal(bool value) : Condition
    {
        public override string type { get; init; } = "literal";
        public bool value { get; init; } = value;
        public override bool Evaluate(Context context) => value;
    }

    public class NumEquals(List<NumValue> values) : Condition
    {
        public override string type { get; init; } = "num-equals";
        public List<NumValue> values { get; init; } = values;
        public override bool Evaluate(Context context)
        {
            var doubles = values.Select(value => value.Evaluate(context)).ToList();
            return doubles.Count != 0 && doubles.All(value => Utils.EqualsTolerant(value, doubles[0]));
        }
    }

    public class StrEquals(List<StrValue> values) : Condition
    {
        public override string type { get; init; } = "str-equals";
        public List<StrValue> values { get; init; } = values;
        public override bool Evaluate(Context context)
        {
            var strings = values.Select(value => value.Evaluate(context)).ToList();
            return strings.Count != 0 && strings.All(value => value.Equals(strings[0]));
        }
    }

    public class All(List<Condition> conditions) : Condition
    {
        public override string type { get; init; } = "all";
        public List<Condition> conditions { get; init; } = conditions;
        public override bool Evaluate(Context context) => conditions.All(condition => condition.Evaluate(context));
    }

    public class First(List<First.Candidate> candidates) : Condition
    {
        public override string type { get; init; } = "first";
        public List<Candidate> candidates { get; init; } = candidates;

        public override bool Evaluate(Context context)
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

        public record Candidate(Condition test, Condition value);
    }

    public class Blank : Condition
    {
        public override string type { get; init; } = "blank";
        public override bool Evaluate(Context context) => false;
    }
}

[UnionTag("type")]
[UnionCase(typeof(Literal), "literal")]
[UnionCase(typeof(Response), "response")]
[UnionCase(typeof(Blank), "blank")]
public abstract class StrValue
{
    public abstract string type { get; init; }

    public abstract string Evaluate(Context context);

    public class Literal(string value) : StrValue
    {
        public override string type { get; init; } = "literal";
        public string value { get; init; } = value;
        public override string Evaluate(Context context) => value;
    }

    public class Response : StrValue
    {
        public override string type { get; init; } = "response";
        public override string Evaluate(Context context) => context.Response;
    }

    public class Blank : StrValue
    {
        public override string type { get; init; } = "blank";
        public override string Evaluate(Context context) => "";
    }
}

[UnionTag("type")]
[UnionCase(typeof(Literal), "literal")]
[UnionCase(typeof(Query), "query")]
[UnionCase(typeof(Mod), "mod")]
[UnionCase(typeof(FromString), "from-string")]
[UnionCase(typeof(Blank), "blank")]
public abstract class NumValue
{
    public abstract string type { get; init; }

    public abstract double Evaluate(Context context);

    public class Literal(double value) : NumValue
    {
        public override string type { get; init; } = "literal";
        public double value { get; init; } = value;
        public override double Evaluate(Context context) => value;
    }

    public class Query : NumValue
    {
        public override string type { get; init; } = "query";
        public override double Evaluate(Context context) => context.Query;
    }

    public class Mod(NumValue a, NumValue n) : NumValue
    {
        public override string type { get; init; } = "mod";
        public NumValue a { get; init; } = a;
        public NumValue n { get; init; } = n;
        public override double Evaluate(Context context) => a.Evaluate(context) % n.Evaluate(context);
    }

    public class FromString(StrValue str) : NumValue
    {
        public override string type { get; init; } = "from-string";
        public StrValue str { get; init; } = str;
        public override double Evaluate(Context context)
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

    public class Blank : NumValue
    {
        public override string type { get; init; } = "blank";
        public override double Evaluate(Context context) => double.NaN;
    }
}
