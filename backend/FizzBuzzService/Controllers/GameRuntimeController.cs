using FizzBuzzService.Services;
using Microsoft.AspNetCore.Mvc;

namespace FizzBuzzService.Controllers;

[ApiController]
[Route("[controller]")]
public class GameRuntimeController (ILogger<GameRuntimeController> logger, GameRuntimeService gameRuntime) : ControllerBase
{

    [HttpGet]
    [Route("Run/{gameCode}")]
    [ProducesResponseType(typeof(bool), 200)]
    [ProducesResponseType(typeof(void), 404)]
    public async Task<ActionResult> Run([FromRoute] string gameCode, [FromQuery] double query, [FromQuery] string response)
    {
        try
        {
            return await gameRuntime.Run(gameCode, query, response) switch
            {
                GameRuntimeService.RunResult.Success success => Ok(success.Result),
                GameRuntimeService.RunResult.GameNotFound => NotFound($"Game not found with code \"{gameCode}\""),
                GameRuntimeService.RunResult.Error error => Problem(error.UserSafeError),
                _ => Problem()
            };
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
    public async Task<ActionResult> Query([FromRoute] string gameCode)
    {
        try
        {
            return await gameRuntime.Query(gameCode) switch
            {
                GameRuntimeService.QueryResult.Success success => Ok(success.Result),
                GameRuntimeService.QueryResult.GameNotFound => NotFound(),
                GameRuntimeService.QueryResult.Error error => Problem(error.UserSafeError),
                _ => Problem()
            };
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting query for game {GameCode}", gameCode);
            return Problem();
        }
    }
}