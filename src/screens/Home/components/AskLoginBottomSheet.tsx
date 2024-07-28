import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {BottomSheet} from '@components';
import Typography from '@styles/Typography';

type AskLoginBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
};

const AskLoginBottomSheet: React.FC<AskLoginBottomSheetProps> = ({
  visible,
  onLogin,
  onRegister,
  onClose,
}) => {
  return (
    <BottomSheet
      detached
      snapPoints={['40%']}
      bottomInset={16}
      visible={visible}
      onClose={onClose}
      style={styles.marginHorizontal}>
      <View style={styles.gap}>
        <Text style={[Typography.h2, styles.textCenter]}>
          Not Authenticated.
        </Text>
        <Text style={[Typography.body, styles.textCenter]}>
          You need to login first to access this feature.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={[Typography.h3, styles.textCenter]}>Login</Text>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity
        style={[styles.button, styles.backgroundBlack]}
        onPress={onRegister}>
        <Text style={[Typography.h3, styles.textCenter, styles.textWhite]}>
          Register
        </Text>
      </TouchableOpacity>
    </BottomSheet>
  );
};

export default AskLoginBottomSheet;

const styles = StyleSheet.create({
  marginHorizontal: {marginHorizontal: 16},
  backgroundBlack: {backgroundColor: 'black'},
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
});
