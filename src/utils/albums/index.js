const mapAlbumDBToModel = ({
  id,
  name,
  year,
  added_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  addedAt: added_at,
  updatedAt: updated_at,
});

module.exports = { mapAlbumDBToModel };
