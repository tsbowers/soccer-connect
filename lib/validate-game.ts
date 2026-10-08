export interface GameInput {
  title: string;
  description?: string;
  location: string;
  gameDate: string;
  gameTime: string;
  maxPlayers: number;
}

export interface GameErrors {
  title?: string;
  location?: string;
  gameDate?: string;
  gameTime?: string;
  maxPlayers?: string;
}

export function validateGame(input: GameInput): GameErrors {
  const errors: GameErrors = {};

  // Title
  if (!input.title || input.title.trim().length === 0) {
    errors.title = "Title is required.";
  }

  // Location
  if (!input.location || input.location.trim().length === 0) {
    errors.location = "Location is required.";
  }

  // Game Date
  if (!input.gameDate) {
    errors.gameDate = "Game date is required.";
  } else {
    const today = new Date();
    const date = new Date(input.gameDate);
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      errors.gameDate = "Game date must be today or later.";
    }
  }

  // Game Time
  if (!input.gameTime) {
    errors.gameTime = "Game time is required.";
  } else if (!/^\d{2}:\d{2}$/.test(input.gameTime)) {
    errors.gameTime = "Game time must be in HH:MM format.";
  }

  // Max Players
  if (!input.maxPlayers) {
    errors.maxPlayers = "Max players is required.";
  } else if (input.maxPlayers < 1 || input.maxPlayers > 30) {
    errors.maxPlayers = "Max players must be between 1 and 30.";
  }

  return errors;
}
