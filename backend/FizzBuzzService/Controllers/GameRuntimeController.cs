using FizzBuzzService.Models;
using FizzBuzzService.Services;
using Microsoft.AspNetCore.Mvc;

namespace FizzBuzzService.Controllers;

[ApiController]
[Route("[controller]")]
public class GameRuntimeController (ILogger<GameRuntimeController> logger, GameStorageService gameStorage) : ControllerBase
{

    [HttpGet]
    [Route("Run/{gameCode}")]
    [ProducesResponseType(typeof(bool), 200)]
    [ProducesResponseType(typeof(void), 404)]
    public async Task<ActionResult> Run([FromRoute] string gameCode, [FromQuery] double query, [FromQuery] string response)
    {
        try
        {
            var gameData = await gameStorage.GetGameByCode(gameCode);

            if (gameData == null)
            {
                return NotFound($"Game not found with code \"{gameCode}\"");
            }

            var game = Game.Parse(gameData.Game);
            var context = new Context(query, response);
            var result = game.condition.Evaluate(context);

            return Ok(result);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting game {GameCode}", gameCode);
            return Problem();
        }
    }

    [HttpGet]
    [Route("Query/{gameCode}")]
    [ProducesResponseType(typeof(double), 200)]
    [ProducesResponseType(typeof(void), 404)]
    public async Task<ActionResult> Run([FromRoute] string gameCode)
    {
        try
        {
            var gameData = await gameStorage.GetGameByCode(gameCode);

            if (gameData == null)
            {
                return NotFound($"Game not found with code \"{gameCode}\"");
            }

            var query = (double) Random.Shared.NextInt64(1000);

            return Ok(query);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting query for game {GameCode}", gameCode);
            return Problem();
        }
    }
}