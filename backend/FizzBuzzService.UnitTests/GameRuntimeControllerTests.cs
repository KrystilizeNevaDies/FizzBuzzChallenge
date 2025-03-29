using System.Globalization;
using FizzBuzzService.Services;
using FizzBuzzService.Services.Database;
using Moq;
using SQLite;
namespace FizzBuzzService.UnitTests;

[TestClass]
public sealed class GameRuntimeControllerTests
{

    public record Environment(SQLiteConnection db, GameStorageService GameStorageService, GameRuntimeService GameRuntimeService);

    [TestMethod]
    [EnvTest]
    public async Task TestRunValidatesResponse(Environment env)
    {
        /*
         * This test is only testing that the results match up with a simple example. Any additional testing should be done in the GameLogicTests
         * When the query is 0, the response should be "Zero", otherwise it should be "Else".
         */

        // arrange
        const string gameCode = "test";
        const string gameJson = """
                                {
                                  "displayName":"Zero Or Else",
                                  "condition":{
                                    "type":"first",
                                    "candidates":[
                                      {
                                        "test":{
                                          "type":"num-equals",
                                          "values":[{"type":"query"},{"type":"literal","value":0}]
                                        },
                                        "value":{
                                          "type":"str-equals",
                                          "values":[{"type":"response"},{"type":"literal","value":"Zero"}]
                                        }
                                      },
                                      {
                                        "test":{"type":"literal","value":true},
                                        "value":{
                                          "type":"str-equals",
                                          "values":[{"type":"response"},{"type":"literal","value":"Else"}]
                                        }
                                      }
                                    ]
                                  }
                                }
                                """;
        await env.GameStorageService.SetGame(gameCode, gameJson);

        // act/assert
        Assert.AreEqual(new GameRuntimeService.RunResult.Success(true), await env.GameRuntimeService.Run(gameCode, 0.0, "Zero"));
        Assert.AreEqual(new GameRuntimeService.RunResult.Success(false), await env.GameRuntimeService.Run(gameCode, 23465.0, "Zero"));
        Assert.AreEqual(new GameRuntimeService.RunResult.Success(true), await env.GameRuntimeService.Run(gameCode, 1.0, "Else"));
        Assert.AreEqual(new GameRuntimeService.RunResult.Success(false), await env.GameRuntimeService.Run(gameCode, 0.0, "Else"));
    }

    [TestMethod]
    [EnvTest]
    public async Task TestQueryIsValid(Environment env)
    {

        // arrange
        const string gameCode = "test";

        const string gameJson = """
                                {
                                  "displayName":"Passthrough",
                                  "condition":{
                                    "type":"num-equals",
                                    "values":[
                                      {"type":"query"},
                                      {"type":"from-string","str":{"type":"response"}}
                                    ]
                                  }
                                }
                                """;
        await env.GameStorageService.SetGame(gameCode, gameJson);

        // act/assert
        for (int i = 0; i < 100; i++)
        {
          var result = await env.GameRuntimeService.Query(gameCode);
          switch (result)
          {
            case GameRuntimeService.QueryResult.Error error:
              Assert.Fail(error.UserSafeError);
              break;
            case GameRuntimeService.QueryResult.GameNotFound:
              Assert.Fail("Game not found");
              break;
            case GameRuntimeService.QueryResult.Success success:
              var query = success.Result;
              var runResult = await env.GameRuntimeService.Run(gameCode, query, query.ToString(CultureInfo.InvariantCulture));

              Assert.IsInstanceOfType<GameRuntimeService.RunResult.Success>(runResult);
              Assert.IsTrue(((GameRuntimeService.RunResult.Success)runResult).Result);

              break;
          }
        }
    }

    private static Environment Env()
    {
        var db = new SQLiteConnection("tests.db", SQLiteOpenFlags.ReadWrite | SQLiteOpenFlags.Create | SQLiteOpenFlags.Memory);
        Mock<DatabaseService> databaseService = new();
        GameStorageService gameStorageService = new(databaseService.Object);
        GameRuntimeService gameRuntimeService = new(gameStorageService);
        databaseService.Setup(mock => mock.UseConnection()).Returns(Task.FromResult<ISQLiteConnection>(db));
        return new Environment(db, gameStorageService, gameRuntimeService);
    }

    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    private class EnvTest() : DataRowAttribute([Env()]);
}
