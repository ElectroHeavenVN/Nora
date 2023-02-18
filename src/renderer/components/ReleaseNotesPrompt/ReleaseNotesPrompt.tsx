/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import React from 'react';
import { AppUpdateContext } from 'renderer/contexts/AppUpdateContext';
import { AppContext } from 'renderer/contexts/AppContext';
import useNetworkConnectivity from 'renderer/hooks/useNetworkConnectivity';

import isLatestVersion from 'renderer/utils/isLatestVersion';

import Version from './Version';
import Checkbox from '../Checkbox';
import Img from '../Img';

import packageFile from '../../../../package.json';
import localReleseNotes from '../../../../release-notes.json';
import WhatsNewImg from '../../../../assets/other/release artworks/whats-new-v0.8.0-alpha.png';

const ReleaseNotesAppUpdateInfo = (props: { state: AppUpdatesState }) => {
  const { state } = props;
  if (state === 'LATEST') {
    return (
      <>
        <br />
        <span className="text-sm text-font-color-highlight dark:text-dark-font-color-highlight">
          You have the latest version.
        </span>
      </>
    );
  }
  if (state === 'OLD') {
    return (
      <>
        <br />
        <span className="text-sm text-font-color-crimson">
          You do not have the latest version.
        </span>{' '}
        <span
          className="font-base text-sm text-font-color-highlight-2 underline dark:text-dark-font-color-highlight-2"
          onClick={() =>
            window.api.openInBrowser(`${packageFile.repository}/releases`)
          }
          onKeyDown={() =>
            window.api.openInBrowser(`${packageFile.repository}/releases`)
          }
          role="button"
          tabIndex={0}
        >
          Update Now
        </span>
      </>
    );
  }
  if (state === 'ERROR') {
    return (
      <>
        <br />
        <span className="text-sm text-font-color-crimson">
          Failed to check for new updates. Something is wrong in our end.
          <div>You may be viewing an outdated changelog.</div>
        </span>
      </>
    );
  }

  return (
    <>
      <br />
      <span className="text-sm text-font-color-crimson">
        We couldn't check for new updates. Check you network connection and try
        again.
        <div>You may be viewing an outdated changelog.</div>
      </span>
    </>
  );
};

const ReleaseNotesPrompt = () => {
  const { userData, appUpdatesState } = React.useContext(AppContext);
  const { updateUserData, updateAppUpdatesState } =
    React.useContext(AppUpdateContext);

  const { isOnline } = useNetworkConnectivity();
  const [releaseNotes, setReleaseNotes] =
    React.useState<Changelog>(localReleseNotes);
  const [noNewUpdateInform, setNoNewUpdateInform] = React.useState(
    userData?.preferences.noUpdateNotificationForNewUpdate ===
      releaseNotes.latestVersion.version
  );

  const updateNoNewUpdateInform = React.useCallback(
    (state: boolean) => {
      const result = state
        ? releaseNotes.latestVersion.version
        : packageFile.version;
      window.api
        .saveUserData('preferences.noUpdateNotificationForNewUpdate', result)
        .then(() => {
          updateUserData((prevUserData) => {
            return {
              ...prevUserData,
              preferences: {
                ...prevUserData.preferences,
                noUpdateNotificationForNewUpdate: result,
              },
            };
          });
          return setNoNewUpdateInform(state);
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.error(err));
    },
    [releaseNotes.latestVersion.version, updateUserData]
  );

  React.useEffect(() => {
    if (isOnline) {
      updateAppUpdatesState('CHECKING');

      fetch(packageFile.releaseNotes.json)
        .then((res) => {
          if (res.status === 200) return res.json();
          throw new Error('response status is not 200');
        })
        .then((res) => {
          // eslint-disable-next-line no-console
          console.log('fetched release notes from the server.', res);
          return setReleaseNotes(res);
        })
        // eslint-disable-next-line no-console
        .catch((err) => {
          updateAppUpdatesState('ERROR');
          console.error(err);
        });
    } else updateAppUpdatesState('NO_NETWORK_CONNECTION');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const isAppLatestVersion = React.useMemo(
    () =>
      isLatestVersion(releaseNotes.latestVersion.version, packageFile.version),
    [releaseNotes.latestVersion.version]
  );

  React.useEffect(() => {
    if (isOnline) updateAppUpdatesState(isAppLatestVersion ? 'LATEST' : 'OLD');
  }, [isAppLatestVersion, isOnline, updateAppUpdatesState]);

  const appVersionComponents = React.useMemo(
    () =>
      releaseNotes.versions.map((version) => (
        <Version
          key={version.version}
          version={version.version}
          releaseDate={version.releaseDate}
          notes={version.notes}
          isLatest={releaseNotes.latestVersion.version === version.version}
        />
      )),
    [releaseNotes]
  );

  const latestVersionImportantNotes = React.useMemo(() => {
    if (releaseNotes.latestVersion.importantNotes) {
      const notes = releaseNotes.latestVersion.importantNotes.map((note) => {
        return (
          <li className="latest-version-important-note max-w-[90%] font-medium">
            {note}
          </li>
        );
      });

      return (
        <ul className="my-8 flex list-disc items-center justify-center marker:text-font-color-highlight dark:marker:text-dark-font-color-highlight">
          {notes}
        </ul>
      );
    }
    return undefined;
  }, [releaseNotes.latestVersion.importantNotes]);

  return (
    <>
      <div className="h-full w-full">
        {releaseNotes && (
          <>
            <h2 className="title-container mb-2 text-center text-3xl font-medium">
              Changelog
              <ReleaseNotesAppUpdateInfo state={appUpdatesState} />
            </h2>
            {isOnline && !isAppLatestVersion && (
              <div className="mb-2 grid place-items-center">
                <Checkbox
                  id="noNewUpdateInformCheckbox"
                  className="text-sm"
                  isChecked={noNewUpdateInform}
                  labelContent="Do not remind me again about this version of the app."
                  checkedStateUpdateFunction={(state) =>
                    updateNoNewUpdateInform(state)
                  }
                />
              </div>
            )}
            {isOnline && releaseNotes.latestVersion.artwork && (
              <div className="version-artwork-container mb-4 p-4">
                <Img
                  src={`${packageFile.urls.raw_repository_url}master${releaseNotes.latestVersion.artwork}`}
                  fallbackSrc={WhatsNewImg}
                  className="rounded-lg"
                  alt=""
                />
              </div>
            )}
            {latestVersionImportantNotes}
            {appVersionComponents}
          </>
        )}
      </div>
    </>
  );
};

export default ReleaseNotesPrompt;