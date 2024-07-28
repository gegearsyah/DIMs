import {
  Alert,
  Linking,
  PermissionsAndroid,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {BottomSheet, ErrorText, TextInput} from '@components';
import Typography from '@styles/Typography';
import {Controller, useForm} from 'react-hook-form';
import {launchCamera} from 'react-native-image-picker';
import {LoadingService} from '@services';
import {postUploadMedia} from '@api/Media';
import Config from '@config';
import {PostCreateMarkerParams} from '@types';
import {throttle} from 'underscore';

type CreateFloodBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: PostCreateMarkerParams) => void;
};

const SwitchWithLabel: React.FC<{
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}> = ({label, value, onChange}) => (
  <TouchableOpacity
    style={styles.switchContainer}
    onPress={() => onChange(!value)}>
    <Text style={Typography.body}>{label}</Text>
    <Switch
      trackColor={{false: '#767577', true: '#90deea'}}
      thumbColor={value ? 'steelblue' : '#ebeef1'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onChange}
      value={(value as unknown as boolean) ?? false}
    />
  </TouchableOpacity>
);

const CreateFloodBottomSheet: React.FC<CreateFloodBottomSheetProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      electricOn: false,
      waterOn: false,
      isSanitation: false,
      Description: '',
      imageUrl: '',
    },
  });

  const handleUploadPress = throttle(async () => {
    const result = await PermissionsAndroid.request(
      'android.permission.CAMERA',
      {
        title: 'Camera Permission Required',
        message: 'This permission is needed to upload your image.',
        buttonPositive: 'OK',
      },
    );

    if (result !== 'granted') {
      Alert.alert(
        'Permission Needed',
        'Unable to upload image, please enable camera permission in your setting',
        [{onPress: Linking.openSettings}],
      );
      return;
    }

    const image = await launchCamera({mediaType: 'photo'});
    const source = image?.assets?.[0];

    if (!source) return;

    LoadingService.setLoading(true, 'Uploading...');
    try {
      const formData = new FormData();
      formData.append('files', {
        uri: source.uri,
        name: source.fileName,
        type: source.type,
      });

      const {filename} = await postUploadMedia(formData);
      setValue(
        'imageUrl',
        `${Config.api.server.baseUrl.replace('/api', '')}${filename}`,
      );
    } catch (err) {
      const error = err as Error;
      Alert.alert(
        error?.name ?? 'Upload Error',
        error?.message ?? JSON.stringify({...error}, null, 2),
      );
    } finally {
      LoadingService.setLoading(false);
    }
  }, 1000);

  return (
    <BottomSheet
      scrollable
      title="Create Flood Marker"
      snapPoints={['75%', '100%']}
      visible={visible}
      onClose={onClose}>
      <View style={styles.gap}>
        <Controller
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}}) => (
            <SwitchWithLabel
              label="Electricity"
              value={value}
              onChange={onChange}
            />
          )}
          name="electricOn"
        />

        <Controller
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}}) => (
            <SwitchWithLabel
              label="Clean water"
              value={value}
              onChange={onChange}
            />
          )}
          name="waterOn"
        />

        <Controller
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}}) => (
            <SwitchWithLabel
              label="Sanitation"
              value={value}
              onChange={onChange}
            />
          )}
          name="isSanitation"
        />

        <Controller
          control={control}
          rules={{required: true}}
          render={({field: {onChange, onBlur, value, ref}}) => (
            <TextInput
              multiline
              placeholder="Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{minHeight: 100, textAlignVertical: 'top'}}
              ref={ref}
              returnKeyType="done"
            />
          )}
          name="Description"
        />

        {errors.Description && (
          <ErrorText label="Description" error={errors.Description} />
        )}

        <TouchableOpacity
          onPress={handleUploadPress}
          style={[styles.button, styles.backgroundBlack]}>
          <Text
            style={[Typography.bodyBold, styles.textCenter, styles.textWhite]}>
            Upload Image
          </Text>
        </TouchableOpacity>
        {errors.imageUrl && <ErrorText label="Image" error={errors.imageUrl} />}

        <View style={styles.line} />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit as any)}
          style={styles.button}>
          <Text style={[Typography.bodyBold, styles.textCenter]}>Submit</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default CreateFloodBottomSheet;

const styles = StyleSheet.create({
  marginHorizontal: {marginHorizontal: 16},
  backgroundBlack: {backgroundColor: 'black'},
  backgroundGreen: {backgroundColor: 'palegreen'},
  backgroundRed: {backgroundColor: 'crimson'},
  backgroundBlue: {backgroundColor: '#90daee'},
  textWhite: {color: 'white'},
  textCenter: {textAlign: 'center'},
  flexRow: {flexDirection: 'row'},
  itemsCenter: {alignItems: 'center'},
  gap: {gap: 8},
  line: {
    height: 4,
    backgroundColor: 'black',
    borderRadius: 4,
    marginVertical: 8,
  },
  card: {
    borderRadius: 24,
    borderWidth: 4,
    padding: 12,
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cardItem: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  positive: {
    color: 'forestgreen',
  },
  negative: {
    color: 'crimson',
  },
  button: {
    borderWidth: 4,
    borderRadius: 24,
    padding: 16,
    marginVertical: 12,
  },
  icon: {width: 48, height: 48},
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
});
