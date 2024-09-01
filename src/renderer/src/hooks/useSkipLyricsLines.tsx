import { useCallback, useContext, useEffect } from 'react';
import { AppUpdateContext } from '../contexts/AppUpdateContext';

const useSkipLyricsLines = (lyrics?: SongLyrics | null) => {
  const { updateSongPosition } = useContext(AppUpdateContext);

  const skipLyricsLines = useCallback(
    (option: 'previous' | 'next' = 'next') => {
      if (lyrics?.lyrics.isSynced) {
        const { syncedLyrics } = lyrics.lyrics;

        if (syncedLyrics) {
          const lyricsLines: typeof syncedLyrics = [
            { start: 0, end: syncedLyrics[0].start, text: '...' },
            ...syncedLyrics
          ];
          document.addEventListener(
            'player/positionChange',
            (e) => {
              if ('detail' in e && !Number.isNaN(e.detail)) {
                const songPosition = e.detail as number;

                for (let i = 0; i < lyricsLines.length; i += 1) {
                  const { start, end } = lyricsLines[i];
                  const isInRange = songPosition > start && songPosition < end;
                  if (isInRange) {
                    if (option === 'next' && lyricsLines[i + 1])
                      updateSongPosition(lyricsLines[i + 1].start);
                    else if (option === 'previous' && lyricsLines[i - 1])
                      updateSongPosition(lyricsLines[i - 1].start);
                  }
                }
              }
            },
            { once: true }
          );
        }
      }
    },
    [lyrics?.lyrics, updateSongPosition]
  );

  const manageLyricsPageKeyboardShortcuts = useCallback(
    (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowUp') skipLyricsLines('previous');
      else if (e.altKey && e.key === 'ArrowDown') skipLyricsLines('next');
    },
    [skipLyricsLines]
  );

  useEffect(() => {
    window.addEventListener('keydown', manageLyricsPageKeyboardShortcuts);
    return () => {
      window.removeEventListener('keydown', manageLyricsPageKeyboardShortcuts);
    };
  }, [manageLyricsPageKeyboardShortcuts]);

  return { skipLyricsLines };
};

export default useSkipLyricsLines;