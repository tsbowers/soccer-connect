ALTER TABLE game_player
    ADD CONSTRAINT game_player_unique_game_user UNIQUE (game_id, user_id);