/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/destructuring-assignment */
import React, { useContext } from 'react';
import { AppContext } from 'renderer/contexts/AppContext';
import { Song } from '../SongsPage/song';

interface AlbumContentReducer {
  albumData: Album;
  songsData: SongData[];
}

type AlbumContentReducerActions = 'ALBUM_DATA_UPDATE' | 'SONGS_DATA_UPDATE';

const reducer = (
  state: AlbumContentReducer,
  action: { type: AlbumContentReducerActions; data: any }
): AlbumContentReducer => {
  switch (action.type) {
    case 'ALBUM_DATA_UPDATE':
      return {
        ...state,
        albumData: action.data,
      } as AlbumContentReducer;
    case 'SONGS_DATA_UPDATE':
      return {
        ...state,
        songsData: action.data,
      } as AlbumContentReducer;
    default:
      return state;
  }
};

export default () => {
  const {
    currentlyActivePage,
    changeCurrentActivePage,
    playSong,
    updateContextMenuData,
    currentSongData,
  } = useContext(AppContext);

  const [albumContent, dispatch] = React.useReducer(reducer, {
    albumData: {} as Album,
    songsData: [] as SongData[],
  });

  React.useEffect(() => {
    if (currentlyActivePage.data.albumId) {
      window.api.getAlbumData(currentlyActivePage.data.albumId).then((res) => {
        if (res && !Array.isArray(res)) {
          dispatch({ type: 'ALBUM_DATA_UPDATE', data: res });
        }
      });
    }
  }, [currentlyActivePage.data]);

  React.useEffect(() => {
    if (
      albumContent.albumData.songs &&
      albumContent.albumData.songs.length > 0
    ) {
      const temp: Promise<SongData | undefined>[] = [];
      albumContent.albumData.songs.forEach((song) => {
        temp.push(window.api.getSongInfo(song.songId));
      });
      Promise.all(temp).then((res) => {
        const data = res.filter((x) => x !== undefined) as SongData[];
        dispatch({ type: 'SONGS_DATA_UPDATE', data });
      });
    }
  }, [albumContent.albumData.songs]);

  const songComponents =
    albumContent.songsData.length > 0
      ? albumContent.songsData.map((song) => {
          return (
            <Song
              key={song.songId}
              title={song.title}
              artists={song.artists}
              artworkPath={song.artworkPath}
              duration={song.duration}
              songId={song.songId}
              playSong={playSong}
              currentSongData={currentSongData}
              updateContextMenuData={updateContextMenuData}
              currentlyActivePage={currentlyActivePage}
              changeCurrentActivePage={changeCurrentActivePage}
            />
          );
        })
      : [];

  return (
    <div className="main-container album-info-page-container">
      <div className="album-img-and-info-container">
        <div className="album-cover-container">
          {albumContent.albumData.artworkPath && (
            <img
              src={`otomusic://localFiles/${albumContent.albumData.artworkPath}`}
              alt=""
            />
          )}{' '}
        </div>
        {albumContent.albumData.title &&
          albumContent.albumData.artists.length > 0 &&
          albumContent.albumData.songs.length > 0 && (
            <div className="album-info-container">
              <div className="album-title">{albumContent.albumData.title}</div>
              <div className="album-artists">
                {albumContent.albumData.artists.map((artist, index) => (
                  <span
                    className="artist"
                    title={artist}
                    onClick={() =>
                      currentlyActivePage.pageTitle === 'ArtistInfo' &&
                      currentlyActivePage.data.artistName === artist
                        ? changeCurrentActivePage('Home')
                        : changeCurrentActivePage('ArtistInfo', {
                            artistName: artist,
                          })
                    }
                  >
                    {artist}
                    {index === albumContent.albumData.artists.length - 1
                      ? ''
                      : ', '}
                  </span>
                ))}
              </div>
              <div className="album-no-of-songs">{`${
                albumContent.albumData.songs.length
              } song${
                albumContent.albumData.songs.length === 1 ? '' : 's'
              }`}</div>
              {albumContent.albumData.year && (
                <div className="album-year">{albumContent.albumData.year}</div>
              )}
            </div>
          )}
      </div>
      <div className="album-songs-container secondary-container songs-list-container">
        <div className="title-container">Songs</div>
        <div className="songs-container">{songComponents}</div>
      </div>
    </div>
  );
};
