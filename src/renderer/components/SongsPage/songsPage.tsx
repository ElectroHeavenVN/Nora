/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable promise/always-return */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-else-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable import/prefer-default-export */
import React, { useContext } from 'react';
import { AppContext } from 'renderer/contexts/AppContext';
import sortSongs from 'renderer/utils/sortSongs';
import { Song } from './song';
import DefaultSongCover from '../../../../assets/images/song_cover_default.png';
// import { Artist } from '../ArtistPage/Artist';

interface SongPageReducer {
  songsData: AudioInfo[];
  sortingOrder: SongsPageSortTypes;
}

type SongPageReducerActionTypes = 'SONGS_DATA' | 'SORTING_ORDER';

const reducer = (
  state: SongPageReducer,
  action: { type: SongPageReducerActionTypes; data: any }
): SongPageReducer => {
  switch (action.type) {
    case 'SONGS_DATA':
      return {
        ...state,
        songsData: action.data,
      };
    case 'SORTING_ORDER':
      return {
        ...state,
        songsData: sortSongs(state.songsData, action.data),
        sortingOrder: action.data,
      };
    default:
      return state;
  }
};

export const SongsPage = () => {
  const {
    playSong,
    currentSongData,
    updateContextMenuData,
    currentlyActivePage,
    changeCurrentActivePage,
  } = useContext(AppContext);

  const [content, dispatch] = React.useReducer(reducer, {
    songsData: [],
    sortingOrder: 'aToZ',
  });

  React.useEffect(() => {
    window.api
      .checkForSongs()
      .then((audioInfoArray) => {
        if (audioInfoArray)
          return dispatch({
            type: 'SONGS_DATA',
            data: sortSongs(audioInfoArray, content.sortingOrder),
          });
      })
      .catch((err) => console.log(err));
  }, []);

  const songs = content.songsData.map((song) => {
    return (
      <Song
        key={song.songId}
        title={song.title}
        artworkPath={song.artworkPath || DefaultSongCover}
        duration={song.duration}
        songId={song.songId}
        artists={song.artists}
        playSong={playSong}
        currentSongData={currentSongData}
        updateContextMenuData={updateContextMenuData}
        changeCurrentActivePage={changeCurrentActivePage}
        currentlyActivePage={currentlyActivePage}
        // updateQueueData={updateQueueData}
        // queue={queue}
      />
    );
  });

  return (
    <div className="main-container songs-list-container">
      <div className="title-container">
        Songs
        <select
          name="sortingOrderDropdown"
          id="sortingOrderDropdown"
          value={content.sortingOrder}
          onChange={(e) =>
            dispatch({ type: 'SORTING_ORDER', data: e.currentTarget.value })
          }
        >
          <option value="aToZ">A to Z</option>
          <option value="zToA">Z to A</option>
          <option value="dateAddedAscending">Date added ( Ascending )</option>
          <option value="dateAddedDescending">Date added ( Descending )</option>
          <option value="artistNameAscending">Artist ( Ascending )</option>
          <option value="artistNameDescending">Artist ( Descending )</option>
          {/* <option value="albumNameAscending">Album ( Ascending )</option>
          <option value="albumNameDescending">Album ( Descending )</option> */}
        </select>
      </div>
      <div className="songs-container">{songs}</div>
    </div>
  );
};
