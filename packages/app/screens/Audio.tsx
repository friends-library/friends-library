import React, { useEffect } from 'react';
import { ScrollView, Dimensions, View, Alert } from 'react-native';
import { AudioResource, StackParamList } from '../types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { t } from '@friends-library/locale';
import { Serif, Sans } from '../components/Text';
import IconButton from '../components/IconButton';
import Artwork from '../components/Artwork';
import AudioControls from '../components/AudioControls';
import DownloadablePart from '../components/DownloadablePart';
import tw from '../lib/tailwind';
import { shortTitle, humansize } from '../lib/utils';
import { useSelector, useDispatch, PropSelector } from '../state';
import {
  isDownloading,
  isQueued,
  isDownloaded,
  downloadAllAudios,
  deleteAllAudioParts,
} from '../state/filesystem';
import * as select from '../state/selectors';
import { LANG } from '../env';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Listen'>;
  route: RouteProp<StackParamList, 'Listen'>;
}

const AudioScreen: React.FC<Props> = ({ route }) => {
  const dispatch = useDispatch();
  const selection = useSelector(selector({ audioId: route.params.audioId }, dispatch));
  const showNetworkFail = selection && selection.showNetworkFail === true;

  useEffect(() => {
    if (showNetworkFail) {
      Alert.alert(t`No internet`, `${t`Unable to download at this time`}.`, [
        { text: `OK` },
      ]);
    }
  }, [showNetworkFail]);

  if (!selection) return null;

  const {
    audio,
    downloaded,
    unDownloaded,
    showDownloadAll,
    activePartIndex,
    downloadingActivePart,
    notDownloading,
  } = selection;
  const isMultipart = audio.parts.length > 1;

  return (
    <ScrollView>
      <Artwork
        id={audio.id}
        size={ARTWORK_WIDTH}
        style={{
          marginTop: `8%`,
          alignSelf: `center`,
          elevation: 2,
          shadowColor: `#000`,
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
        }}
      />
      <View style={tw(`flex-grow py-4 px-8 justify-center`)}>
        <AudioControls audioId={audio.id} />
        {isMultipart && !downloadingActivePart && (
          <View style={tw(`flex-row justify-center -mt-4`)}>
            <Sans size={13} style={tw(`text-gray-600`)}>
              Part{LANG === `es` ? `e` : ``} {activePartIndex + 1}
              {` `}
              {LANG === `es` ? `de` : `of`} {audio.parts.length}
            </Sans>
          </View>
        )}
      </View>
      <Serif size={30} style={tw(`text-center py-4 px-8`)}>
        {shortTitle(audio.title)}
      </Serif>
      {!audio.title.includes(audio.friend) && !audio.friend.startsWith(`Compila`) && (
        <Serif size={22} style={tw(`text-center italic text-gray-700 mb-6 -mt-2`)}>
          by {audio.friend}
        </Serif>
      )}
      {showDownloadAll && (
        <IconButton
          onPress={() => dispatch(downloadAllAudios(audio.id))}
          icon="cloud-download"
          text={isMultipart ? t`Download all` : t`Download`}
          secondaryText={`(${humansize(unDownloaded)})`}
        />
      )}
      <Serif
        style={tw(`px-6 pt-2 pb-4 text-justify text-gray-800`, {
          lineHeight: 26,
        })}
        size={18}
      >
        {audio.shortDescription}
      </Serif>
      {isMultipart && (
        <View style={tw(`mb-16`)}>
          {audio.parts.map((part) => (
            <DownloadablePart
              key={`${audio.id}--${part.index}`}
              audioId={audio.id}
              partIndex={part.index}
            />
          ))}
        </View>
      )}
      {downloaded > 0 && notDownloading && (
        <IconButton
          onPress={() => dispatch(deleteAllAudioParts(audio.id))}
          icon="trash"
          text={isMultipart ? t`Delete all` : t`Delete`}
          secondaryText={`(${humansize(downloaded)})`}
          textTailwindClass="text-gray-700"
          bgTailwindClass="bg-red-200"
          style={isMultipart ? `mb-8 -mt-8` : `mb-8 mt-2`}
        />
      )}
    </ScrollView>
  );
};

export default AudioScreen;

const ARTWORK_WIDTH = Dimensions.get(`window`).width * 0.8;

const selector: PropSelector<
  { audioId: string },
  {
    audio: AudioResource;
    unDownloaded: number;
    downloaded: number;
    downloadingActivePart: boolean;
    activePartIndex: number;
    notDownloading: boolean;
    showDownloadAll: boolean;
    showNetworkFail: boolean;
  }
> = ({ audioId }) => (state) => {
  const quality = state.preferences.audioQuality;
  const audioPart = select.activeAudioPart(audioId, state);
  const files = select.audioFiles(audioId, state);
  if (!audioPart || !files) return null;
  const [part, audio] = audioPart;
  const activeFile = select.audioPartFile(audio.id, part.index, state);
  const size = quality === `HQ` ? `size` : `sizeLq`;
  return {
    audio,
    showNetworkFail: state.network.recentFailedAttempt,
    unDownloaded: audio.parts.reduce((acc, part, idx) => {
      const file = files[idx];
      if (file && !isDownloaded(file)) {
        return acc + part[size];
      }
      return acc;
    }, 0),
    downloaded: audio.parts.reduce((acc, part, idx) => {
      const file = files[idx];
      if (file && isDownloaded(file)) {
        return acc + part[size];
      }
      return acc;
    }, 0),
    downloadingActivePart: isDownloading(activeFile),
    activePartIndex: part.index,
    notDownloading: files.filter((p) => isDownloading(p) || isQueued(p)).length === 0,
    showDownloadAll:
      files.filter((p) => !isDownloading(p) && !isDownloaded(p) && !isQueued(p)).length >
      0,
  };
};
