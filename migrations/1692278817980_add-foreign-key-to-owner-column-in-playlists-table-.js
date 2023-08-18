/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    "INSERT INTO users(id, username, password, fullname) VALUES('old_playlist', 'old_playlist', 'old_playlist', 'old_playlist')",
  );

  pgm.sql("UPDATE playlists SET owner = 'old_playlist' WHERE owner = NULL");

  pgm.addConstraint(
    'playlists',
    'fk_playlists.owner_user.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlists.owner_user.id');

  pgm.sql('UPDATE playlists SET owner = NULL WHERE owner = "old_playlist"');

  pgm.sql('DELETE FROM users WHERE id = "old_playlist"');
};
