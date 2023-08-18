const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsServices {
  constructor(songsService, playlistsService) {
    this._pool = new Pool();

    this._songsService = songsService;
    this._playlistsService = playlistsService;
  }

  async addPlaylistSongs(playlistId, songId) {
    await this._playlistsService.verifyPlaylistId(playlistId);
    await this._songsService.getSongById(songId);
    const id = `playlistsongs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlists');
    }
    return result.rows[0].id;
  }

  async getPlaylistSongs(id) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistSongs(playlistId, songId) {
    await this._playlistsService.verifyPlaylistId(playlistId);
    await this._songsService.getSongById(songId);
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }
}

module.exports = PlaylistSongsServices;
