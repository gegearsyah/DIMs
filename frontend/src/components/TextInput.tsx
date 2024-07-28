import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {forwardRef} from 'react';
import Typography from '@styles/Typography';

type TextInputProps = {
  containerStyle?: StyleProp<ViewStyle>;
} & React.ComponentProps<typeof RNTextInput>;

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({style, containerStyle, ...props}, ref) => {
    return (
      <View style={[styles.textInputContainer, containerStyle]}>
        <RNTextInput ref={ref} style={[Typography.body, style]} {...props} />
      </View>
    );
  },
);

export default TextInput;

const styles = StyleSheet.create({
  textInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 24,
  },
});
