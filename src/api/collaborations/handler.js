const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(
    collaborationsService,
    usersService,
    playlistsService,
    validator,
  ) {
    this._collaborationsService = collaborationsService;
    this._usersService = usersService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    console.log('masuk handler');
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    console.log('1');
    await this._usersService.getUserById(userId);
    console.log('2');
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(
      playlistId,
      userId,
    );

    return h
      .response({
        status: 'success',
        data: { collaborationId },
      })
      .code(201);
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return h
      .response({
        status: 'success',
        message: 'collaborator berhasil dihapus',
      })
      .code(200);
  }
}

module.exports = CollaborationsHandler;
