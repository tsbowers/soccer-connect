import { sql } from '@vercel/postgres';

type GameInput = {
  title: string;
  description?: string;
  location: string;
  game_date: string;
  game_time: string;
  max_players: number;
  created_by: string;
};

//Get all games
export async function getGames() {
  const result = await sql`
    SELECT * FROM pickup_game
    ORDER BY game_date, game_time;
  `;
  return result.rows;
}

//add a game
export async function addGame(game: GameInput) {
  const { title, description, location, game_date, game_time, max_players, created_by } = game;

  await sql`
    INSERT INTO pickup_game (title, description, location, game_date, game_time, max_players, created_by)
    VALUES (${title}, ${description}, ${location}, ${game_date}, ${game_time}, ${max_players}, ${created_by});
  `;
}

    
