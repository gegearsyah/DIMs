import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Typography from '@styles/Typography';
import ChevronUp from '@assets/icons/chevron-compact-up.svg';
import ChevronDown from '@assets/icons/chevron-compact-down.svg';

type ReviewCardProps = {
  item: any;
  onUpvote: (item: any) => void;
  onDownvote: (item: any) => void;
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  item,
  onUpvote,
  onDownvote,
}) => {
  const upvoteStyle = item?.upvoted
    ? {
        strokeWidth: 1,
        stroke: styles.positive.color,
        fill: styles.positive.color,
      }
    : {};
  const downvoteStyle = item?.downvoted
    ? {
        strokeWidth: 1,
        stroke: styles.negative.color,
        fill: styles.negative.color,
      }
    : {};

  return (
    <View style={styles.card}>
      <View style={styles.reviewCardContent}>
        <View style={styles.flexRow}>
          <Text style={Typography.body}>{item?.userName}:</Text>
        </View>
        <Image
          source={{
            uri: 'https://storage.nu.or.id/storage/post/16_9/big/1427277502.jpg',
          }}
          style={styles.reviewImage}
        />
        <Text style={Typography.body}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis
          placeat rerum non voluptates velit ipsa rem! Alias possimus optio
          adipisci ducimus, deleniti laboriosam esse, blanditiis at nostrum,
          magni officia repudiandae.
        </Text>
      </View>
      <View style={styles.itemsCenter}>
        <TouchableOpacity onPress={() => onUpvote(item)}>
          <ChevronUp width={24} height={24} fill="#000" {...upvoteStyle} />
        </TouchableOpacity>
        <Text
          style={[
            Typography.bodyBold,
            item?.upvoted && styles.positive,
            item?.downvoted && styles.negative,
          ]}>
          {item?.votes}
        </Text>
        <TouchableOpacity onPress={() => onDownvote(item)}>
          <ChevronDown width={24} height={24} fill="#000" {...downvoteStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReviewCard;

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
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    alignItems: 'flex-start',
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
  reviewImage: {
    height: 200,
    borderRadius: 32,
  },
  reviewCardContent: {flex: 1, marginRight: 8, gap: 8},
});
