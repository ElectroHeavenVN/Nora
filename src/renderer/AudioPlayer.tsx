import React, { ReactElement, startTransition } from 'react';
import ErrorPrompt from './components/ErrorPrompt';
import { AppUpdateContext } from './contexts/AppUpdateContext';
import { AudioPlayerInfoContext } from './contexts/AudioPlayerInfoContext';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ReactElement<any, any>;
};

const player = new Audio();
player.preload = 'auto';

player.addEventListener('player/trackchange', (e) => {
  if ('detail' in e) {
    console.log(
      `player track changed to ${(e as DetailAvailableEvent<string>).detail}.`
    );
  }
});

const AudioPlayer = (props: Props) => {
  const { children } = props;
  const { changePromptMenuData } = React.useContext(AppUpdateContext);

  const [playerData, setPlayerData] = React.useState<Player>({
    isCurrentSongPlaying: false,
    volume: { isMuted: false, value: 50 },
    isRepeating: 'false',
    isShuffling: false,
    songPosition: 0,
    isMiniPlayer: false,
    isPlayerStalled: false,
  });

  const refStartPlay = React.useRef(false);

  const AUDIO_FADE_INTERVAL = 50;
  const AUDIO_FADE_DURATION = 250;
  const fadeOutIntervalId = React.useRef(undefined as NodeJS.Timer | undefined);
  const fadeInIntervalId = React.useRef(undefined as NodeJS.Timer | undefined);

  const fadeOutAudio = React.useCallback(() => {
    // console.log('volume on fade out', volumeData);
    if (fadeInIntervalId.current) clearInterval(fadeInIntervalId.current);
    if (fadeOutIntervalId.current) clearInterval(fadeOutIntervalId.current);
    fadeOutIntervalId.current = setInterval(() => {
      if (player.volume > 0) {
        const rate =
          playerData.volume.value /
          (100 * (AUDIO_FADE_DURATION / AUDIO_FADE_INTERVAL));
        if (player.volume - rate <= 0) player.volume = 0;
        else player.volume -= rate;
      } else {
        player.pause();
        if (fadeOutIntervalId.current) clearInterval(fadeOutIntervalId.current);
      }
    }, AUDIO_FADE_INTERVAL);
  }, [playerData.volume.value]);

  const fadeInAudio = React.useCallback(() => {
    // console.log('volume on fade in', volumeData);
    if (fadeInIntervalId.current) clearInterval(fadeInIntervalId.current);
    if (fadeOutIntervalId.current) clearInterval(fadeOutIntervalId.current);
    fadeInIntervalId.current = setInterval(() => {
      if (player.volume < playerData.volume.value / 100) {
        const rate =
          (playerData.volume.value / 100 / AUDIO_FADE_INTERVAL) *
          (AUDIO_FADE_DURATION / AUDIO_FADE_INTERVAL);
        if (player.volume + rate >= playerData.volume.value / 100)
          player.volume = playerData.volume.value / 100;
        else player.volume += rate;
      } else if (fadeInIntervalId.current) {
        clearInterval(fadeInIntervalId.current);
      }
    }, AUDIO_FADE_INTERVAL);
  }, [playerData.volume.value]);

  const handleBeforeQuitEvent = React.useCallback(async () => {
    window.api.sendSongPosition(player.currentTime);
    await window.api.saveUserData('isShuffling', playerData.isShuffling);
    await window.api.saveUserData('isRepeating', playerData.isRepeating);
  }, [playerData.isRepeating, playerData.isShuffling]);

  const managePlaybackErrors = React.useCallback(
    (err: unknown) => {
      console.error(err);
      changePromptMenuData(
        true,
        <ErrorPrompt
          reason="ERROR_IN_PLAYER"
          message={
            <>
              An error ocurred in the player.
              <br />
              This could be a result of trying to play a corrupted song.
            </>
          }
          showSendFeedbackBtn
        />
      );
    },
    [changePromptMenuData]
  );

  React.useEffect(() => {
    player.addEventListener('error', (err) => managePlaybackErrors(err));
    player.addEventListener('play', () => {
      window.api.songPlaybackStateChange(true);
    });
    player.addEventListener('pause', () => {
      window.api.songPlaybackStateChange(false);
    });
    window.api.beforeQuitEvent(handleBeforeQuitEvent);

    return () => {
      window.api.removeBeforeQuitEventListener(handleBeforeQuitEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const displayDefaultTitleBar = () => {
      document.title = `Nora`;
      window.api.saveUserData(
        'currentSong.stoppedPosition',
        player.currentTime
      );
    };
    const playSongIfPlayable = () => {
      //   if (refStartPlay.current) toggleSongPlayback(true);
    };
    const manageSongPositionUpdate = () => {
      playerData.songPosition = Math.floor(player.currentTime);
    };
    const managePlayerStalledStatus = () => {
      //   dispatch({ type: 'PLAYER_WAITING_STATUS', data: true });
    };
    const managePlayerNotStalledStatus = () => {
      //   dispatch({ type: 'PLAYER_WAITING_STATUS', data: false });
    };
    // player.addEventListener('seeking', managePlayerNotStalledStatus);
    player.addEventListener('canplay', managePlayerNotStalledStatus);
    player.addEventListener('canplaythrough', managePlayerNotStalledStatus);
    player.addEventListener('loadeddata', managePlayerNotStalledStatus);
    player.addEventListener('loadedmetadata', managePlayerNotStalledStatus);
    player.addEventListener('suspend', managePlayerStalledStatus);
    player.addEventListener('stalled', managePlayerStalledStatus);
    player.addEventListener('waiting', managePlayerStalledStatus);
    player.addEventListener('canplay', playSongIfPlayable);
    // player.addEventListener('ended', handleSkipForwardClick);
    // player.addEventListener('play', addSongTitleToTitleBar);
    player.addEventListener('pause', displayDefaultTitleBar);

    const intervalId = setInterval(() => {
      if (!player.paused) {
        const currentPosition = Math.floor(playerData.songPosition);

        const playerPositionChange = new CustomEvent('player/positionChange', {
          detail: currentPosition,
        });
        player.dispatchEvent(playerPositionChange);

        startTransition(() =>
          setPlayerData((prevData) => ({
            ...prevData,
            songPosition: currentPosition,
          }))
        );
      }
    }, 500);

    player.addEventListener('timeupdate', manageSongPositionUpdate);

    return () => {
      //   toggleSongPlayback(false);
      clearInterval(intervalId);
      // player.removeEventListener('seeking', managePlayerNotStalledStatus);
      player.removeEventListener('canplay', managePlayerNotStalledStatus);
      player.removeEventListener(
        'canplaythrough',
        managePlayerNotStalledStatus
      );
      player.removeEventListener('loadeddata', managePlayerNotStalledStatus);
      player.removeEventListener(
        'loadedmetadata',
        managePlayerNotStalledStatus
      );
      player.removeEventListener('suspend', managePlayerStalledStatus);
      player.removeEventListener('stalled', managePlayerStalledStatus);
      player.removeEventListener('waiting', managePlayerStalledStatus);
      player.removeEventListener('timeupdate', manageSongPositionUpdate);
      player.removeEventListener('canplay', playSongIfPlayable);
      //   player.removeEventListener('ended', handleSkipForwardClick);
      //   player.removeEventListener('play', addSongTitleToTitleBar);
      player.removeEventListener('pause', displayDefaultTitleBar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // VOLUME RELATED SETTINGS
  React.useEffect(() => {
    player.volume = playerData.volume.value / 100;
    player.muted = playerData.volume.isMuted;
  }, [playerData.volume.isMuted, playerData.volume.value]);

  return (
    <AudioPlayerInfoContext.Provider value={playerData}>
      {children}
    </AudioPlayerInfoContext.Provider>
  );
};

export default AudioPlayer;
