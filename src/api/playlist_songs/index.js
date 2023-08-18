const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist_songs',
  version: '1.0.0',
  register: async (server, { service, PlaylistService, validator }) => {
    const playlistsSongsHandler = new PlaylistSongsHandler(service, PlaylistService, validator);
    server.route(routes(playlistsSongsHandler));
  },
};
