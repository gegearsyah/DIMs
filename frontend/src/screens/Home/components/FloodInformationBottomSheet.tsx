import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {BottomSheet} from '@components';
import Typography from '@styles/Typography';
import {LOCATION_CONDITION} from '@enums';
import ReviewCard from './ReviewCard';

type FloodInformationBottomSheetProps = {
  visible: boolean;
  onUpvote: (item: any) => void;
  onDownvote: (item: any) => void;
  onClose: () => void;
  data?: Record<string, any>;
};

const FloodInformationBottomSheet: React.FC<
  FloodInformationBottomSheetProps
> = ({visible, onUpvote, onDownvote, onClose, data}) => {
  return (
    <BottomSheet
      scrollable
      visible={visible}
      onClose={onClose}
      title="Flood Information">
      <Text style={Typography.body}>Location Condition</Text>
      <View style={styles.card}>
        {LOCATION_CONDITION.map(item => (
          <View key={item.field} style={styles.cardItem}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={Typography.caption}>{item.label}</Text>
            <Text
              style={[
                Typography.body,
                data?.[item.field] ? styles.positive : styles.negative,
              ]}>
              {data?.[item.field] ? item.good : item.bad}
            </Text>
          </View>
        ))}
      </View>

      {/* <Text style={Typography.body}>Weather Forecast</Text>
      <View style={styles.card}>
      // TODO
      </View> */}

      {data?.safeHouse && (
        <TouchableOpacity style={styles.button}>
          <Text style={Typography.h3}>Go to Nearest Safe House</Text>
        </TouchableOpacity>
      )}

      <Text style={[Typography.h3, styles.textCenter]}>Community Chat</Text>
      <View style={styles.line} />

      <FlatList
        scrollEnabled={false}
        data={data?.review}
        keyExtractor={(item, index) => item?.id ?? index}
        renderItem={item => (
          <ReviewCard item={item} onUpvote={onUpvote} onDownvote={onDownvote} />
        )}
      />
    </BottomSheet>
  );
};

export default FloodInformationBottomSheet;

const styles = StyleSheet.create({
  textCenter: {textAlign: 'center'},
  flexRow: {flexDirection: 'row'},
  itemsCenter: {alignItems: 'center'},
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
    alignSelf: 'center',
    borderWidth: 4,
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'palegreen',
    marginVertical: 12,
  },
  icon: {width: 48, height: 48},
});
