/* eslint-disable react/destructuring-assignment */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
/* eslint-disable import/prefer-default-export */
import React, { useContext } from 'react';
import { AppContext } from 'renderer/contexts/AppContext';
import { Playlist } from './Playlist';
import NewPlaylistPrompt from './NewPlaylistPrompt';

export const PlaylistsPage = () => {
  const {
    changePromptMenuData,
    updateDialogMenuData,
    currentlyActivePage,
    changeCurrentActivePage,
  } = useContext(AppContext);
  const [playlists, setPlaylists] = React.useState([] as Playlist[]);
  let playlistComponents;
  React.useEffect(() => {
    window.api.getPlaylistData('*').then((res) => {
      if (res && Array.isArray(res)) setPlaylists(res);
    });
  }, []);
  if (playlists.length > 1) {
    playlistComponents = playlists.map((playlist) => {
      return (
        <Playlist
          name={playlist.name}
          createdDate={playlist.createdDate}
          playlistId={playlist.playlistId}
          songs={playlist.songs}
          artworkPath={playlist.artworkPath}
          key={playlist.playlistId}
          changeCurrentActivePage={changeCurrentActivePage}
          currentlyActivePage={currentlyActivePage}
        />
      );
    });
  }

  const updatePlaylists = (newPlaylist: Playlist) => {
    setPlaylists((prevPlaylists) => {
      return [...prevPlaylists, newPlaylist];
    });
  };

  return (
    <div className="main-container playlists-list-container">
      <div className="title-container">Playlists</div>
      {playlists.length > 1 ? (
        <div className="playlists-container">{playlistComponents}</div>
      ) : (
        <div className="no-playlists-container">No playlists found.</div>
      )}
      <button
        className="add-new-playlist-btn"
        onClick={() =>
          changePromptMenuData(
            true,
            <NewPlaylistPrompt
              changePromptMenuData={changePromptMenuData}
              updatePlaylists={updatePlaylists}
              updateDialogMenuData={updateDialogMenuData}
            />,
            'add-new-playlist'
          )
        }
      >
        <i className="fas fa-add"></i> Add New Playlist
      </button>
    </div>
  );
};
