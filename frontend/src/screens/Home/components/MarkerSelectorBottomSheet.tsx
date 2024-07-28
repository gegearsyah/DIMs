import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {BottomSheet} from '@components';
import Typography from '@styles/Typography';

type MarkerSelectorBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onCreateFlood: () => void;
  onCreateFoods: () => void;
  onCreateMedicine: () => void;
  onCreateSafeHouse: () => void;
};

const MarkerSelectorBottomSheet: React.FC<MarkerSelectorBottomSheetProps> = ({
  visible,
  onCreateFlood,
  onCreateFoods,
  onCreateMedicine,
  onCreateSafeHouse,
  onClose,
}) => {
  return (
    <BottomSheet
      detached
      snapPoints={['52%']}
      bottomInset={16}
      visible={visible}
      onClose={onClose}
      style={styles.marginHorizontal}>
      <View style={styles.gap}>
        <TouchableOpacity
          style={[styles.button, styles.backgroundBlue]}
          onPress={onCreateFlood}>
          <Text style={[Typography.h3, styles.textCenter]}>Flood Marker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backgroundRed]}
          onPress={onCreateMedicine}>
          <Text style={[Typography.h3, styles.textCenter, styles.textWhite]}>
            Medicine Marker
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onCreateFoods}>
          <Text style={[Typography.h3, styles.textCenter]}>Foods Marker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backgroundGreen]}
          onPress={onCreateSafeHouse}>
          <Text style={[Typography.h3, styles.textCenter]}>
            Safe House Marker
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default MarkerSelectorBottomSheet;

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
});
