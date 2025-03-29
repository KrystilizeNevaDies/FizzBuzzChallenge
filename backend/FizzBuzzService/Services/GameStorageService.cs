using System.Data.Common;
using FizzBuzzService.Models;
using FizzBuzzService.Services.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SQLite;

namespace FizzBuzzService.Services;

public class GameStorageService(DatabaseService databaseService)
{

    /// <summary>
    /// Gets the game with the given code
    /// </summary>
    /// <param name="gameCode">The code of the game to get</param>
    public async Task<GameStorage?> GetGameByCode(string gameCode)
    {
        var db = await databaseService.UseConnection();
        db.CreateTable<GameStorage>();

        return db.Table<GameStorage>().FirstOrDefault(v => v.GameCode.Equals(gameCode));
    }

    /// <summary>
    /// Gets a list of all the games
    /// </summary>
    public async Task<List<GameStorage>> ListGames()
    {
        var db = await databaseService.UseConnection();
        db.CreateTable<GameStorage>();

        return db.Table<GameStorage>().ToList();
    }

    /// <summary>
    /// Sets the game with the given code
    /// </summary>
    /// <param name="gameCode">The code of the game to set</param>
    /// <param name="game">The game to set</param>
    /// <returns>An error, or null if successful</returns>
    public async Task<string?> SetGame(string gameCode, string game)
    {
        try
        {
            // Verify that the game is valid
            Game.Parse(game);
        }
        catch (Exception e)
        {
            return e.Message;
        }

        var db = await databaseService.UseConnection();
        db.CreateTable<GameStorage>();

        var existing = await GetGameByCode(gameCode);

        db.InsertOrReplace(new GameStorage
        {
            GameCode = gameCode,
            Game = game,
            Created = existing?.Created ?? DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
            Modified = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
        });

        return null;
    }

    /// <summary>
    /// Deletes the game with the given code
    /// </summary>
    /// <param name="gameCode">The code of the game to delete</param>
    /// <returns>An error, or null if successful</returns>
    public async Task<ActionResult> DeleteGame(string gameCode)
    {
        var db = await databaseService.UseConnection();
        db.CreateTable<GameStorage>();

        var existing = await GetGameByCode(gameCode);
        if (existing == null)
        {
            return new NotFoundResult();
        }

        db.Delete<GameStorage>(gameCode);

        return new OkResult();
    }
}
