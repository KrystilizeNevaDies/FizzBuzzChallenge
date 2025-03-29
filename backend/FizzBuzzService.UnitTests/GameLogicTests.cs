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
        AreEqual(true, new ICondition.Literal(true).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.Literal(false).Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestLiteralNumValue()
    {
        AreEqual(234, new INumValue.Literal(234).Evaluate(_defaultContext));
        AreEqual(5634, new INumValue.Literal(5634).Evaluate(_defaultContext));

        for (var i = 0.0; i < 1000.0; i += Math.PI)
        {
            AreEqual(new INumValue.Literal(i).Evaluate(_defaultContext), i);
        }
    }

    [TestMethod]
    public void TestLiteralStrValue()
    {
        AreEqual("Hello World", new IStrValue.Literal("Hello World").Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestResponseStrValue()
    {
        AreEqual("FizzBuzz", new IStrValue.Response().Evaluate(_defaultContext));
        AreEqual("MOAB", new IStrValue.Response().Evaluate(TestContext(0, "MOAB")));
    }

    [TestMethod]
    public void TestQueryNumValue()
    {
        AreEqual(123, new INumValue.Query().Evaluate(_defaultContext));
        AreEqual(623, new INumValue.Query().Evaluate(TestContext(623, "")));
    }

    [TestMethod]
    public void TestModNumValue()
    {
        AreEqual(58745.0 % 4.2364, new INumValue.Mod(new INumValue.Literal(58745.0), new INumValue.Literal(4.2364)).Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestFromStringNumValue()
    {
        AreEqual(4.2364, new INumValue.FromString(new IStrValue.Literal("4.2364")).Evaluate(_defaultContext));
        AreEqual(double.NaN, new INumValue.FromString(new IStrValue.Literal("John")).Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestNumEqualsCondition()
    {
        AreEqual(false, new ICondition.NumEquals([]).Evaluate(_defaultContext));
        AreEqual(true, new ICondition.NumEquals([new INumValue.Literal(438754)]).Evaluate(_defaultContext));
        AreEqual(true, new ICondition.NumEquals([new INumValue.Literal(438754), new INumValue.Literal(438754)]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.NumEquals([new INumValue.Literal(438754), new INumValue.Literal(4387542)]).Evaluate(_defaultContext));
        AreEqual(true, new ICondition.NumEquals([new INumValue.Literal(438754), new INumValue.Literal(438754), new INumValue.Literal(438754)]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.NumEquals([new INumValue.Literal(438714), new INumValue.Literal(438754), new INumValue.Literal(438754)]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.NumEquals([new INumValue.Literal(438714), new INumValue.Literal(43812354), new INumValue.Literal(438754)]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.NumEquals([new INumValue.Literal(438714), new INumValue.Literal(438754), new INumValue.Literal(423454)]).Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestStrEqualsCondition()
    {
        AreEqual(false, new ICondition.StrEquals([]).Evaluate(_defaultContext));
        AreEqual(true, new ICondition.StrEquals([new IStrValue.Literal("bob")]).Evaluate(_defaultContext));
        AreEqual(true, new ICondition.StrEquals([new IStrValue.Literal("john"), new IStrValue.Literal("john")]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.StrEquals([new IStrValue.Literal("john"), new IStrValue.Literal("John")]).Evaluate(_defaultContext));
        AreEqual(true, new ICondition.StrEquals([new IStrValue.Literal("john"), new IStrValue.Literal("john"), new IStrValue.Literal("john")]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.StrEquals([new IStrValue.Literal("john"), new IStrValue.Literal("johnny"), new IStrValue.Literal("john")]).Evaluate(_defaultContext));
    }

    [TestMethod]
    public void TestAllCondition()
    {
        AreEqual(true, new ICondition.All([]).Evaluate(_defaultContext));
        AreEqual(true, new ICondition.All([new ICondition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(true, new ICondition.All([new ICondition.Literal(true), new ICondition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.All([new ICondition.Literal(true), new ICondition.Literal(false)]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.All([new ICondition.Literal(false), new ICondition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(true, new ICondition.All([new ICondition.Literal(true), new ICondition.Literal(true), new ICondition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.All([new ICondition.Literal(false), new ICondition.Literal(true), new ICondition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.All([new ICondition.Literal(true), new ICondition.Literal(false), new ICondition.Literal(true)]).Evaluate(_defaultContext));
        AreEqual(false, new ICondition.All([new ICondition.Literal(true), new ICondition.Literal(true), new ICondition.Literal(false)]).Evaluate(_defaultContext));
    }
}
