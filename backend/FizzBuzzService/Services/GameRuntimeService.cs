using FizzBuzzService.Models;

namespace FizzBuzzService.Services;

public class GameRuntimeService(GameStorageService gameStorage)
{

    public abstract record RunResult
    {
        public record Success(bool Result) : RunResult;
        public record GameNotFound : RunResult;
        public record Error(string UserSafeError) : RunResult;
    }

    /// <summary>
    /// Runs the given context through the game condition
    /// </summary>
    /// <param name="gameCode">The code of the game to validate the answer for</param>
    /// <param name="query">The query to validate the answer for</param>
    /// <param name="response">The response to validate</param>
    public async Task<RunResult> Run(string gameCode, double query, string response)
    {
        var gameData = await gameStorage.GetGameByCode(gameCode);

        if (gameData == null)
        {
            return new RunResult.GameNotFound();
        }

        try
        {
            var game = Game.Parse(gameData.Game);
            try
            {
                var context = new Context(query, response);
                var result = game.condition.Evaluate(context);

                return new RunResult.Success(result);
            } catch (Exception)
            {
                return new RunResult.Error("Error evaluating game condition");
            }
        } catch (Exception)
        {
            return new RunResult.Error("Error parsing game data");
        }
    }

    public record QueryResult
    {
        public record Success(double Result) : QueryResult;
        public record GameNotFound : QueryResult;
        public record Error(string UserSafeError) : QueryResult;
    }

    /// <summary>
    /// Generates a valid query for the given game.
    /// </summary>
    /// <param name="gameCode">The code of the game to generate the query for</param>
    /// <returns>The generated query</returns>
    public async Task<QueryResult> Query(string gameCode)
    {
        var gameData = await gameStorage.GetGameByCode(gameCode);

        if (gameData == null)
        {
            return new QueryResult.GameNotFound();
        }

        try
        {
            // we don't currently use the game object to generate the query, but in the future we will, so we need to validate the game object.
            Game.Parse(gameData.Game);

            try
            {
                var value = (double) Random.Shared.NextInt64(1000);
                return new QueryResult.Success(value);
            }
            catch (Exception)
            {
                return new QueryResult.Error("Error generating query data");
            }
        }
        catch (Exception)
        {
            return new QueryResult.Error("Error parsing game data");
        }
    }
}
