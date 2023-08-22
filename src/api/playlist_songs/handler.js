const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(service, PlaylistService, validator) {
    this._service = service;
    this._playlistService = PlaylistService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);

    await this._service.addPlaylistSongs(id, songId);

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan ke playlist',
    });
    response.code(201);

    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    const playlistData = await this._playlistService.getPlaylistDetailById(id);
    const playlistSongs = await this._service.getPlaylistSongs(id);

    const playlist = { ...playlistData, songs: [...playlistSongs] };
    const response = h.response({
      status: 'success',
      data: { playlist },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(id, credentialId);

    await this._service.deletePlaylistSongs(id, songId);

    const response = h.response({
      status: 'success',
      message: 'Song berhasil dihapus dari playlist',
    });
    response.code(200);

    return response;
  }
}

module.exports = PlaylistSongsHandler;
