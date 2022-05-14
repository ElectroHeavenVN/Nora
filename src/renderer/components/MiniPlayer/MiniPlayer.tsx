/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { AppContext } from 'renderer/contexts/AppContext';

interface MiniPlayerReducer {
  songData?: AudioData;
}

type MiniPlayerReducerActionTypes = 'UPDATE_SONG_DATA';

const reducer = (
  state: MiniPlayerReducer,
  action: { type: MiniPlayerReducerActionTypes; data?: any }
) => {
  return state;
};

export default function MiniPlayer() {
  const { isMiniPlayer, updateMiniPlayerStatus, currentSongData } =
    React.useContext(AppContext);
  const [content, dispatch] = React.useReducer(reducer, {
    songData: undefined,
  } as MiniPlayerReducer);
  return (
    <div className="mini-player">
      <div className="background-cover-img-container">
        <img
          src={`otomusic://localFiles/${currentSongData.artworkPath}`}
          alt=""
        />
      </div>
      <div className="container">
        <div className="title-bar">
          <div className="special-controls-container">
            <span className="change-theme-btn">
              <i
                className="material-icons-round"
                onClick={() => updateMiniPlayerStatus(!isMiniPlayer)}
              >
                launch
              </i>
            </span>
          </div>
          <div className="window-controls-container">
            <span
              className="minimize-btn"
              onClick={() => window.api.minimizeApp()}
            >
              <span className="material-icons-round">minimize</span>
            </span>
            <span className="close-btn" onClick={() => window.api.closeApp()}>
              <span className="material-icons-round">close</span>{' '}
            </span>
          </div>
        </div>
        <div className="song-info-container">
          <div className="song-title">{currentSongData.title}</div>
          <div className="song-artists">
            {currentSongData.artists.join(',')}
          </div>
        </div>
      </div>
    </div>
  );
}
