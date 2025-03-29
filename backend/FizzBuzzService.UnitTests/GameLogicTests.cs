using FizzBuzzService.Models;
using static Microsoft.VisualStudio.TestTools.UnitTesting.Assert;
namespace FizzBuzzService.UnitTests;

[TestClass]
public sealed class GameLogicTests
{
    private static Context TestContext(double query, string response) => new (query, response);
    private readonly Context _defaultContext = TestContext(123, "FizzBuzz");

    [TestMethod]
    public void TestLiteralCondition()
    {
        AreEqual(true, new Condition.Literal(true).Evaluate(_defaultContext));
        AreEqual(false, new Condition.Literal(false).Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestLiteralNumValue()
    {
        AreEqual(234, new NumValue.Literal(234).Evaluate(_defaultContext));
        AreEqual(5634, new NumValue.Literal(5634).Evaluate(_defaultContext));

        for (var i = 0.0; i < 1000.0; i += Math.PI)
        {
            AreEqual(new NumValue.Literal(i).Evaluate(_defaultContext), i);
        }
    }

    [TestMethod]
    public void TestLiteralStrValue()
    {
        AreEqual("Hello World", new StrValue.Literal("Hello World").Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestResponseStrValue()
    {
        AreEqual("FizzBuzz", new StrValue.Response().Evaluate(_defaultContext));
        AreEqual("MOAB", new StrValue.Response().Evaluate(TestContext(0, "MOAB")));
    }

    [TestMethod]
    public void TestQueryNumValue()
    {
        AreEqual(123, new NumValue.Query().Evaluate(_defaultContext));
        AreEqual(623, new NumValue.Query().Evaluate(TestContext(623, "")));
    }

    [TestMethod]
    public void TestModNumValue()
    {
        AreEqual(58745.0 % 4.2364, new NumValue.Mod(new NumValue.Literal(58745.0), new NumValue.Literal(4.2364)).Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestFromStringNumValue()
    {
        AreEqual(4.2364, new NumValue.FromString(new StrValue.Literal("4.2364")).Evaluate(_defaultContext));
        AreEqual(double.NaN, new NumValue.FromString(new StrValue.Literal("John")).Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestNumEqualsCondition()
    {
        AreEqual(false, new Condition.NumEquals([]).Evaluate(_defaultContext));
        AreEqual(true, new Condition.NumEquals([new NumValue.Literal(438754)]).Evaluate(_defaultContext));
        AreEqual(true, new Condition.NumEquals([new NumValue.Literal(438754), new NumValue.Literal(438754)]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.NumEquals([new NumValue.Literal(438754), new NumValue.Literal(4387542)]).Evaluate(_defaultContext));
        AreEqual(true, new Condition.NumEquals([new NumValue.Literal(438754), new NumValue.Literal(438754), new NumValue.Literal(438754)]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.NumEquals([new NumValue.Literal(438714), new NumValue.Literal(438754), new NumValue.Literal(438754)]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.NumEquals([new NumValue.Literal(438714), new NumValue.Literal(43812354), new NumValue.Literal(438754)]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.NumEquals([new NumValue.Literal(438714), new NumValue.Literal(438754), new NumValue.Literal(423454)]).Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestStrEqualsCondition()
    {
        AreEqual(false, new Condition.StrEquals([]).Evaluate(_defaultContext));
        AreEqual(true, new Condition.StrEquals([new StrValue.Literal("bob")]).Evaluate(_defaultContext));
        AreEqual(true, new Condition.StrEquals([new StrValue.Literal("john"), new StrValue.Literal("john")]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.StrEquals([new StrValue.Literal("john"), new StrValue.Literal("John")]).Evaluate(_defaultContext));
        AreEqual(true, new Condition.StrEquals([new StrValue.Literal("john"), new StrValue.Literal("john"), new StrValue.Literal("john")]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.StrEquals([new StrValue.Literal("john"), new StrValue.Literal("johnny"), new StrValue.Literal("john")]).Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestAllCondition()
    {
        AreEqual(true, new Condition.All([]).Evaluate(_defaultContext));
        AreEqual(true, new Condition.All([new Condition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(true, new Condition.All([new Condition.Literal(true), new Condition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.All([new Condition.Literal(true), new Condition.Literal(false)]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.All([new Condition.Literal(false), new Condition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(true, new Condition.All([new Condition.Literal(true), new Condition.Literal(true), new Condition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.All([new Condition.Literal(false), new Condition.Literal(true), new Condition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.All([new Condition.Literal(true), new Condition.Literal(false), new Condition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(false, new Condition.All([new Condition.Literal(true), new Condition.Literal(true), new Condition.Literal(false)]).Evaluate(_defaultContext));
    }
}
