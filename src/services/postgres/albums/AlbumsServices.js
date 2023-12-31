const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapSongDBToModel } = require('../../../utils/songs');
const InvariantError = require('../../../exceptions/InvariantError');
const NotFoundError = require('../../../exceptions/NotFoundError');

class AlbumsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const albumId = `album-${id}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [albumId, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return result.rows[0];
  }

  async getSongByAlbumId(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapSongDBToModel);
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name=$1, year=$2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsServices;
