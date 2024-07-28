import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BottomSheet} from '@components';
import Typography from '@styles/Typography';
import ReviewCard from './ReviewCard';
import {FOOD_TIPS} from '@enums';

type FoodDetailBottomSheetProps = {
  visible: boolean;
  onUpvote: (item: any) => void;
  onDownvote: (item: any) => void;
  onClose: () => void;
  data?: Record<string, any>;
};

const FoodDetailBottomSheet: React.FC<FoodDetailBottomSheetProps> = ({
  visible,
  onUpvote,
  onDownvote,
  onClose,
  data,
}) => {
  const renderEmptyComponent = () => (
    <Text style={Typography.body}>No one has started chatting yet.</Text>
  );

  return (
    <BottomSheet
      scrollable
      visible={visible}
      onClose={onClose}
      title="Food Aids">
      <View style={styles.gap}>
        <Text style={[Typography.h2, styles.textCenter]}>Total Foods</Text>
        <Text style={[Typography.h2, styles.textCenter]}>
          {data?.totalFood ?? 100}
        </Text>
      </View>

      <View style={styles.line} />

      <Text style={Typography.h3}>Tips:</Text>
      {FOOD_TIPS.map(tip => (
        <View key={tip} style={styles.flexRow}>
          <Text style={Typography.body}>• </Text>
          <Text style={Typography.body}>{tip}</Text>
        </View>
      ))}

      <View style={styles.line} />

      <Text style={[Typography.h3, styles.textCenter]}>Community Chat</Text>
      <View style={styles.line} />

      <FlatList
        scrollEnabled={false}
        data={data?.review}
        keyExtractor={(item, index) => item?.id ?? index}
        renderItem={item => (
          <ReviewCard item={item} onUpvote={onUpvote} onDownvote={onDownvote} />
        )}
        ListEmptyComponent={renderEmptyComponent}
      />
    </BottomSheet>
  );
};

export default FoodDetailBottomSheet;

const styles = StyleSheet.create({
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
    alignSelf: 'center',
    borderWidth: 4,
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'palegreen',
    marginVertical: 12,
  },
  icon: {width: 48, height: 48},
});
