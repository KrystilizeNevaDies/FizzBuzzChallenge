import { Center, Paper, Text } from '@mantine/core';

// eslint-disable-next-line import/prefer-default-export
export function LandingPage() {
  return (
    <>
      <Text size="xl" style={{ weight: 700 }}>FizzBuzzChallenge - Customizable & Engaging Web Game</Text>

      <Text mt="md">
        Welcome to the <strong>FizzBuzzChallenge</strong> — a fun and interactive way to challenge your number skills, with customizable rules and easy-to-follow gameplay.
      </Text>

      <Center style={{ textAlign: 'left' }}>
        <Paper withBorder w="40vw" p="lg">
          <Text size="lg" style={{ weight: 500, textAlign: 'center' }}>Game Overview</Text>
          <Text>
            The iconic FizzBuzz test challenges programmers to replace numbers with &quot;Fizz,&quot; &quot;Buzz,&quot; or &quot;FizzBuzz&quot; based on divisibility. Imagine taking it further by allowing dynamic, customizable rules for a unique and evolving gameplay experience!
          </Text>
          <Text mt="xs" ml="md">- <strong>Fizz</strong> for numbers divisible by 3</Text>
          <Text mt="xs" ml="md">- <strong>Buzz</strong> for numbers divisible by 5</Text>
          <Text mt="xs" ml="md">- <strong>FizzBuzz</strong> for numbers divisible by both 3 and 5</Text>

          <Text mt="md">
            But that&apos;s not all! The game is designed for full customization. The <strong>game master</strong> (admin) has the power to modify the rules, add new ones, update existing ones, or disable rules entirely — creating a unique gameplay experience every time.
          </Text>
        </Paper>
      </Center>

      <Center style={{ textAlign: 'left' }}>
        <Paper withBorder w="40vw" p="lg">
          <Text size="lg" style={{ weight: 500, textAlign: 'center' }}>Features</Text>
          <Text mt="sm">
            <strong>Customizable Game Rules:</strong> The game master can easily modify the existing rules through an intuitive admin portal, including:
          </Text>
          <Text mt="xs" ml="md">- Adding new rules, such as replacing numbers divisible by 7 with “Boo.”</Text>
          <Text mt="xs" ml="md">- Updating the divisors and associated text.</Text>
          <Text mt="xs" ml="md">- Enabling or disabling rules for flexibility.</Text>
          <Text mt="xs" ml="md">- Deleting unwanted rules.</Text>

          <Text mt="md">
            <strong>Randomized Gameplay:</strong> At the start of each game, the server sends a random number to the UI. The player must input the correct response (Fizz, Buzz, or FizzBuzz) and submit it. The server will verify the answer and continue with the next random number until the player decides to stop.
          </Text>

          <Text mt="md">
            <strong>Game Session Summary:</strong> After the game concludes, players are presented with a summary of their session, highlighting their accuracy and overall performance.
          </Text>

          <Text mt="md">
            <strong>Clean and Simple UI:</strong> The game features a sleek, minimalistic interface built with ReactJS (v18) and TypeScript, ensuring a smooth and responsive experience. The backend is powered by .NET 8 with an in-memory database for quick, real-time interaction.
          </Text>
        </Paper>
      </Center>

      <Center style={{ textAlign: 'left' }}>
        <Paper withBorder w="40vw" p="lg">
          <Text size="lg" style={{ weight: 500, textAlign: 'center' }}>Admin Portal</Text>
          <Text>
            The admin portal is where the real magic happens. Game masters can:
          </Text>
          <Text mt="xs" ml="md">- View and edit existing rules.</Text>
          <Text mt="xs" ml="md">- Control the difficulty and style of the game by modifying rules as needed.</Text>
          <Text mt="xs" ml="md">- Easily manage game configurations without requiring any coding knowledge.</Text>
        </Paper>
      </Center>

      <Center>
        <Paper w="40vw">
          <Text mt="md">
            <strong>Challenge Your Friends & Improve:</strong> Keep track of your performance, challenge your friends, and improve your skills as you play through different levels of difficulty with customized game rules. Whether you&apos;re playing solo or with others, there&apos;s always a new way to play!
          </Text>

          <Text mt="xl" size="lg">
            <strong>Get Started Now and See How Fast You Can Think!</strong>
          </Text>
        </Paper>
      </Center>
    </>
  );
}
