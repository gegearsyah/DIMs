import {StyleSheet, Text} from 'react-native';
import React, {useMemo} from 'react';
import {FieldError} from 'react-hook-form';
import Typography from '@styles/Typography';

const ErrorText: React.FC<{label: string; error: FieldError}> = ({
  label,
  error,
}) => {
  const message = useMemo(
    () =>
      error.type === 'required'
        ? `${label} is required.`
        : error.type === 'minLength'
          ? `${label} is too short.`
          : error.type === 'maxLength'
            ? `${label} is too long.`
            : `${label} has error.`,
    [error.type, label],
  );

  return <Text style={[Typography.caption, styles.textRed]}>• {message}</Text>;
};

export default ErrorText;

const styles = StyleSheet.create({textRed: {color: 'crimson'}});
