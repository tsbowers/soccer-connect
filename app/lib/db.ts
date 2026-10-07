import { sql } from '@vercel/postgres';

function mapGame(row: any): GameInput {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    location: row.location,
    game_date: row.game_date?.toString() ?? "",
    game_time: row.game_time?.toString() ?? "",
    max_players: Number(row.max_players),
    created_by: row.created_by,
  };
}

type GameInput = {
  id: string;
  title: string;
  description?: string;
  location: string;
  game_date: string;
  game_time: string;
  max_players: number;
  created_by: string;
};

//Get all games
export async function getGames(): Promise<GameInput[]> {
  const result = await sql`
    SELECT * FROM pickup_game
    ORDER BY game_date, game_time;
  `;

  return result.rows.map(mapGame);
}

export async function getGameById(id: string): Promise<GameInput | null> {
  const result = await sql`
    SELECT * FROM pickup_game
    WHERE id = ${id};
  `;

  if (result.rows.length === 0) return null;
  return mapGame(result.rows[0]);
}

//add a game
export async function addGame(game: GameInput): Promise<void> {
  const { title, description, location, game_date, game_time, max_players, created_by } = game;

  await sql`
    INSERT INTO pickup_game (title, description, location, game_date, game_time, max_players, created_by)
    VALUES (${title}, ${description}, ${location}, ${game_date}, ${game_time}, ${max_players}, ${created_by});
  `;
}

//update a game
export async function updateGame(id: string, data: Partial<GameInput>): Promise<GameInput | null> {
  const result = await sql`
    UPDATE pickup_game
    SET
      title = ${data.title},
      description = ${data.description},
      location = ${data.location},
      game_date = ${data.game_date},
      game_time = ${data.game_time},
      max_players = ${data.max_players},
      created_by = ${data.created_by}
    WHERE id = ${id}
    RETURNING *;
  `;

  if (result.rows.length === 0) return null;
  return mapGame(result.rows[0]);
}

//delete a game
export async function deleteGame(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM pickup_game
    WHERE id = ${id}
    RETURNING id;
  `;

  return result.rows.length > 0;
}

