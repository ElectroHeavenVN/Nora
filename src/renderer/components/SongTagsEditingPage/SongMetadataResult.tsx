/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import React from 'react';
import { AppUpdateContext } from 'renderer/contexts/AppUpdateContext';
import Button from '../Button';
import Img from '../Img';
import CustomizeSelectedMetadataPrompt from './CustomizeSelectedMetadataPrompt';
import DefaultSongImage from '../../../../assets/images/webp/song_cover_default.webp';

interface SongMetadataResultProp {
  title: string;
  artists: string[];
  genres?: string[];
  album?: string;
  releasedYear?: number;
  lyrics?: string;
  artworkPaths?: string[];
  updateSongInfo: (callback: (prevData: SongTags) => SongTags) => void;
}

export const manageAlbumData = (
  albumData: Album[],
  album?: string
):
  | {
      title: string;
      albumId?: string | undefined;
      noOfSongs?: number | undefined;
      artists?: string[] | undefined;
      artworkPath?: string | undefined;
    }
  | undefined => {
  if (albumData.length > 0)
    return {
      title: albumData[0].title,
      albumId: albumData[0].albumId,
      artists: albumData[0].artists?.map((x) => x.artistId),
      artworkPath: albumData[0].artworkPaths.artworkPath,
      noOfSongs: albumData[0].songs.length,
    };

  if (album) return { title: album };
  return undefined;
};

export const manageArtistsData = (
  artistData: Artist[],
  artists: string[]
):
  | {
      artistId?: string;
      name: string;
      artworkPath?: string;
      onlineArtworkPaths?: OnlineArtistArtworks;
    }[]
  | undefined => {
  const artistsInfo: ReturnType<typeof manageArtistsData> = artistData.map(
    (data) => ({
      name: data.name,
      artistId: data.artistId,
      artworkPath: data.artworkPaths.optimizedArtworkPath,
      onlineArtworkPaths: data.onlineArtworkPaths,
    })
  );

  for (const artistName of artists) {
    if (!artistsInfo.some((x) => x.name === artistName))
      artistsInfo.push({ name: artistName });
  }

  return artistsInfo;
};

export const manageGenresData = (
  genreData: Genre[],
  genres?: string[]
):
  | {
      genreId?: string | undefined;
      name: string;
      artworkPath?: string | undefined;
    }[]
  | undefined => {
  if (genres) {
    const genresInfo: ReturnType<typeof manageGenresData> = genreData.map(
      (data) => ({
        name: data.name,
        genreId: data.genreId,
        artworkPath: data.artworkPaths.optimizedArtworkPath,
      })
    );

    for (const genreName of genres) {
      if (!genresInfo.some((x) => x.name === genreName))
        genresInfo.push({ name: genreName });
    }

    return genresInfo;
  }
  return undefined;
};

export const manageArtworks = (prevData: SongTags, artworkPaths?: string[]) =>
  Array.isArray(artworkPaths) && artworkPaths.length > 0
    ? artworkPaths.at(-1) || artworkPaths[0]
    : prevData.artworkPath;

function SongMetadataResult(props: SongMetadataResultProp) {
  const { changePromptMenuData } = React.useContext(AppUpdateContext);
  const {
    title,
    artists,
    genres,
    artworkPaths,
    album,
    lyrics,
    releasedYear,
    updateSongInfo,
  } = props;

  const addToMetadata = React.useCallback(async () => {
    const albumData = album ? await window.api.getAlbumData([album]) : [];
    const artistData = await window.api.getArtistData(artists);
    const genreData = genres ? await window.api.getGenresData(genres) : [];

    updateSongInfo((prevData): SongTags => {
      changePromptMenuData(false, undefined, '');
      return {
        ...prevData,
        title: title || prevData.title,
        releasedYear: releasedYear || prevData.releasedYear,
        lyrics: lyrics || prevData.lyrics,
        artworkPath: manageArtworks(prevData, artworkPaths),
        album: manageAlbumData(albumData, album),
        artists: manageArtistsData(artistData, artists),
        genres: manageGenresData(genreData, genres),
      };
    });
    // updateMetadataKeywords({
    //   albumKeyword: album,
    //   artistKeyword: artists?.join(';'),
    //   genreKeyword: genres?.join(';'),
    // });
  }, [
    album,
    artists,
    artworkPaths,
    changePromptMenuData,
    genres,
    lyrics,
    releasedYear,
    title,
    updateSongInfo,
  ]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className="mb-2 flex h-32 min-h-[5rem] w-full cursor-pointer items-center justify-between rounded-md bg-background-color-2/70 p-1 backdrop-blur-md hover:bg-background-color-2 dark:bg-dark-background-color-2/70 dark:hover:bg-dark-background-color-2">
      <div className="flex h-full max-w-[70%]">
        <div className="img-container m-1 mr-4 overflow-hidden rounded-md">
          <Img
            src={artworkPaths?.at(-1)}
            fallbackSrc={DefaultSongImage}
            className="aspect-square h-full max-w-full object-cover"
            alt=""
          />
        </div>
        <div className="song-result-info-container flex max-w-[75%] flex-col justify-center text-font-color-black dark:text-font-color-white">
          <p className="song-result-title relative w-full overflow-hidden text-ellipsis whitespace-nowrap text-xl">
            {title}
          </p>
          <p className="song-result-artists font-light text-opacity-75">
            {artists.join(', ')}
          </p>
          {album && (
            <p className="song-result-album text-sm font-light text-opacity-75">
              {album}
            </p>
          )}
          <span className="song-result-album flex text-sm font-light text-opacity-75">
            {releasedYear && <span>{releasedYear}</span>}
            {releasedYear && <span className="mx-2">&bull;</span>}
            {lyrics && (
              <span className="flex items-center">
                <span className="material-icons-round-outlined mr-2 text-font-color-highlight dark:text-dark-font-color-highlight">
                  verified
                </span>{' '}
                {lyrics && 'lyrics included'}
              </span>
            )}
          </span>
        </div>
      </div>
      <div className="buttons-container flex items-center">
        <Button
          label="Add to Metadata"
          iconName="add"
          className="h-fit !bg-background-color-3 px-8 text-lg text-font-color-black hover:border-background-color-3 dark:!bg-dark-background-color-3 dark:!text-font-color-black dark:hover:border-background-color-3"
          clickHandler={addToMetadata}
        />
        <Button
          key={0}
          className="more-options-btn text-sm hover:!border-background-color-3 dark:!border-dark-background-color-1 dark:hover:!border-dark-background-color-3 md:text-lg md:[&>.button-label-text]:hidden md:[&>.icon]:mr-0"
          iconName="tune"
          clickHandler={() => {
            changePromptMenuData(
              true,
              <CustomizeSelectedMetadataPrompt
                title={title}
                artists={artists}
                album={album}
                artworkPaths={artworkPaths?.filter((x) => x.trim())}
                genres={genres}
                lyrics={lyrics}
                releasedYear={releasedYear}
                updateSongInfo={updateSongInfo}
              />
            );
          }}
          tooltipLabel="Customize Metadata"
        />
      </div>
    </div>
  );
}
export default SongMetadataResult;
