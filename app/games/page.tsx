import { getGames } from '@/app/lib/db';

export default async function GamePage() {
    const games = await getGames(); 

    return (
         <div>
      <h1>Pickup Games</h1>
      <ul>
        {games.map(g => (
          <li key={g.id}>
            {g.title} — {g.game_date} @ {g.game_time} — {g.location}
          </li>
        ))}
      </ul>
    </div>
  );
}