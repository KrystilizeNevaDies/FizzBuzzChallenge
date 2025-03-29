using FizzBuzzService.Services;
using FizzBuzzService.Services.Database;
using Microsoft.AspNetCore.Mvc;

namespace FizzBuzzService.Controllers;

[ApiController]
[Route("[controller]")]
public class GameStorageController (ILogger<GameStorageController> logger, GameStorageService gameStorage) : ControllerBase
{

    [HttpGet]
    [Route("Get/{gameCode}")]
    [ProducesResponseType(typeof(GameStorage), 200)]
    [ProducesResponseType(typeof(void), 404)]
    public async Task<ActionResult> Get([FromRoute] string gameCode)
    {
        logger.LogInformation("Getting game {GameCode}", gameCode);

        try
        {
            var game = await gameStorage.GetGameByCode(gameCode);

            if (game == null)
            {
                return NotFound($"Game not found with code \"{gameCode}\"");
            }

            return Ok(game);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting game {GameCode}", gameCode);
            return Problem();
        }
    }

    [HttpGet]
    [Route("List")]
    [ProducesResponseType(typeof(List<GameStorage>), 200)]
    public async Task<ActionResult> List()
    {
        logger.LogInformation("Listing games");

        try
        {
            var games = await gameStorage.ListGames();
            return Ok(games);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting games list");
            return Problem();
        }
    }

    [HttpPut]
    [Route("Set/{gameCode}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(typeof(void), 400)]
    public async Task<ActionResult> Set([FromRoute] string gameCode, [FromBody] string game)
    {
        logger.LogInformation("Setting game {GameCode} to {Game}", gameCode, game);

        try
        {
            var error = await gameStorage.SetGame(gameCode, game);
            return error != null ? BadRequest(error) : Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error setting game {GameCode} to {Game}", gameCode, game);
            return Problem();
        }
    }

    [HttpDelete]
    [Route("Delete/{gameCode}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(typeof(void), 404)]
    public async Task<ActionResult> Delete([FromRoute] string gameCode)
    {
        logger.LogInformation("Deleting game {GameCode}", gameCode);

        try
        {
            return await gameStorage.DeleteGame(gameCode);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error deleting game {GameCode}", gameCode);
            return Problem();
        }
    }
}