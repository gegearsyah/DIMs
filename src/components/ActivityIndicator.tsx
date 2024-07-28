import {
  StyleSheet,
  ActivityIndicator as RNActivityIndicator,
  View,
  Text,
} from 'react-native';
import React from 'react';
import Typography from '@styles/Typography';

const ActivityIndicator = ({
  isLoading,
  message,
}: {
  isLoading: boolean;
  message?: string;
}) => {
  if (!isLoading) return;
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <RNActivityIndicator size="large" animating={isLoading} />
        {(message?.length ?? 0) > 0 && (
          <Text style={[Typography.caption, styles.textCenter]}>{message}</Text>
        )}
      </View>
    </View>
  );
};

export default ActivityIndicator;

const styles = StyleSheet.create({
  textCenter: {textAlign: 'center'},
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000030',
  },
  container: {
    padding: 24,
    minWidth: 128,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ebeef1',
    borderWidth: 4,
    borderRadius: 24,
    gap: 8,
  },
});
