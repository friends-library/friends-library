import React from 'react';
import { View, Switch, TouchableOpacity, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { t } from '@friends-library/locale';
import tw from '../lib/tailwind';
import { StackParamList } from '../types';
import { Sans } from '../components/Text';
import { useDispatch, useSelector } from '../state/';
import { toggleQuality } from '../state/preferences';
import { deleteAllAudios } from '../state/filesystem';
import { humansize } from '../lib/utils';
import { BUILD_SEMVER_STRING, APP_NAME } from '../env';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Settings'>;
  route: RouteProp<StackParamList, 'Settings'>;
}

const Home: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { quality, deletableBytes } = useSelector((state) => ({
    quality: state.preferences.audioQuality,
    deletableBytes: Object.keys(state.filesystem).reduce((acc, path) => {
      return path.endsWith(`.mp3`)
        ? acc + (state.filesystem[path] || { bytesOnDisk: 0 }).bytesOnDisk
        : acc;
    }, 0),
  }));
  const hqEnabled = quality === `HQ`;

  return (
    <View>
      <View
        style={tw(`flex-row justify-between p-4 border-b border-gray-400 items-center`)}
      >
        <Sans size={18}>{t`High quality audio`}</Sans>
        <Switch
          trackColor={{ true: `#3bc256`, false: Platform.OS === `ios` ? `#fff` : `#ccc` }}
          thumbColor={`white`}
          ios_backgroundColor="#eee"
          onValueChange={() => dispatch(toggleQuality())}
          value={hqEnabled}
        />
      </View>
      <View
        style={tw(`flex-row justify-between p-4 border-b border-gray-400 items-center`)}
      >
        <Sans size={18}>
          {t`Downloaded audio`}: {humansize(deletableBytes)}
        </Sans>
        <TouchableOpacity onPress={() => dispatch(deleteAllAudios())}>
          <Sans size={18} style={tw(`text-red-600`)}>
            {deletableBytes === 0 ? `` : t`Delete`}
          </Sans>
        </TouchableOpacity>
      </View>
      <Sans size={11} style={tw(`text-center text-black opacity-50 mt-6`)}>
        {APP_NAME} v{BUILD_SEMVER_STRING}
      </Sans>
    </View>
  );
};

export default Home;
