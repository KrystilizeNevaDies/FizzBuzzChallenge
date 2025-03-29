# FizzBuzzChallenge Frontend

This is the backend component of the FizzBuzzChallenge webapp.

### Setup
1. Ensure you have all requirements
    - DotNet 8.0
2. run `dotnet restore` to install all dependencies

### Run
To run via cli, run `dotnet run --project FizzBuzzService --profile http`

To run via Visual Studio, set the `FizzBuzzService` project as the startup project and run.

Note that the service will run on `http://localhost:5108` by default.

### Build
To build for production, run `dotnet publish FizzBuzzService` in the root directory.

This builds to `FizzBuzzService/bin/Release/net8.0`.

The production builds run on http port `5000` by default.

### Test
To run the test suite, run `dotnet test` in the root directory.


### More info

- `FizzBuzzService` is the main project, and contains the game validation logic + the endpoints.
- `FizzBuzzService.UnitTests` tests the game validation logic, and the endpoints' services.
- `FizzBuzzService.Generation` is used to generate C# classes and Typescript classes from a json schema. Currently, the
schema library doesn't currently support union types, so it's unused, but worth sticking around for future use.