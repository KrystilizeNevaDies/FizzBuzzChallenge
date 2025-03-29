using FizzBuzzService.Services;
using FizzBuzzService.Services.Database;
using Moq;
using SQLite;
namespace FizzBuzzService.UnitTests;

[TestClass]
public sealed class GameStorageControllerTests
{

    public record Environment(SQLiteConnection db, GameStorageService GameStorageService);

    [TestMethod]
    [EnvTest]
    public async Task TestSetModifiesDatabase(Environment env)
    {
        // act
        const string code = "37564";
        const string game = """{ "displayName": "FizzBall", "condition": { "type": "blank" } }""";
        var error = await env.GameStorageService.SetGame(code, game);

        // assert
        Assert.IsNull(error, error);
        var saved = env.db.Get<GameStorage>(code);
        Assert.IsNotNull(saved);
        Assert.AreEqual(code, saved.GameCode);
        Assert.AreEqual(game, saved.Game);
    }

    [TestMethod]
    [EnvTest]
    public async Task TestSetWithInvalidGameDoesNotModifyDatabase(Environment env)
    {
        // act
        var error = await env.GameStorageService.SetGame("example", "{}");

        // assert
        Assert.IsNotNull(error);
        Assert.ThrowsException<SQLiteException>(() => env.db.Get<GameStorage>("example"));
    }

    [TestMethod]
    [EnvTest]
    public async Task TestSetOverridesExistingGame(Environment env)
    {
        {
            // act
            const string code = "1234231";
            const string game = """{ "displayName": "First", "condition": { "type": "blank" } }""";
            var error = await env.GameStorageService.SetGame(code, game);

            // assert
            Assert.IsNull(error, error);
            var saved = env.db.Get<GameStorage>(code);
            Assert.IsNotNull(saved);
            Assert.AreEqual(code, saved.GameCode);
            Assert.AreEqual(game, saved.Game);
        }

        {
            // act
            const string code = "9874";
            const string game = """{ "displayName": "Second", "condition": { "type": "blank" } }""";
            var error = await env.GameStorageService.SetGame(code, game);

            // assert
            Assert.IsNull(error, error);
            var saved = env.db.Get<GameStorage>(code);
            Assert.IsNotNull(saved);
            Assert.AreEqual(code, saved.GameCode);
            Assert.AreEqual(game, saved.Game);
        }
    }

    // TODO: SetGame tests for Created & Modified columns

    [TestMethod]
    [EnvTest]
    public async Task TestDeleteModifiesDatabase(Environment env)
    {
        // act
        const string code = "9067";
        const string game = """{ "displayName": "FizzBall", "condition": { "type": "blank" } }""";
        await env.GameStorageService.SetGame(code, game);
        var result = await env.GameStorageService.DeleteGame(code);

        // assert
        Assert.AreEqual(200, result.StatusCode);
        Assert.ThrowsException<InvalidOperationException>(() => env.db.Get<GameStorage>(code), "Should error when fetching deleted game");
    }

    [TestMethod]
    [EnvTest]
    public async Task TestDeleteFailsWhenNotPresent(Environment env)
    {
        // act
        const string code = "845769";
        var result = await env.GameStorageService.DeleteGame(code);

        // assert
        Assert.AreEqual(404, result.StatusCode);
    }

    [TestMethod]
    [EnvTest]
    public async Task TestDeleteErasesCreatedColumn(Environment env)
    {
        // act
        const string code = "12876";
        const string game = """{ "displayName": "FizzBall", "condition": { "type": "blank" } }""";
        await env.GameStorageService.SetGame(code, game);
        var oldCreated = env.db.Get<GameStorage>(code).Created;
        var result = await env.GameStorageService.DeleteGame(code);

        // wait 50 ms to ensure the Created column is different
        await Task.Delay(50);

        await env.GameStorageService.SetGame(code, game);
        var newCreated = env.db.Get<GameStorage>(code).Created;

        // assert
        Assert.AreEqual(200, result.StatusCode);
        Assert.AreNotEqual(oldCreated, newCreated);
    }

    // TODO: Tests for List and Get

    private static Environment Env()
    {
        var db = new SQLiteConnection("tests.db", SQLiteOpenFlags.ReadWrite | SQLiteOpenFlags.Create | SQLiteOpenFlags.Memory);
        Mock<DatabaseService> databaseService = new();
        GameStorageService gameStorageService = new(databaseService.Object);
        databaseService.Setup(mock => mock.UseConnection()).Returns(Task.FromResult<ISQLiteConnection>(db));
        return new Environment(db, gameStorageService);
    }

    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    private class EnvTest() : DataRowAttribute([Env()]);
}
