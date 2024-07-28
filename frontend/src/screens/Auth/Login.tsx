import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import Typography from '@styles/Typography';
import {ErrorText, TextInput} from '@components';
import {PostLoginParams, RootStack} from '@types';
import {LoadingService} from '@services';
import {useAuthContext} from '@contexts';
import {useNavigation} from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation<RootStack>();
  const {
    control,
    handleSubmit,
    formState: {errors},
    setFocus,
  } = useForm({
    defaultValues: {
      phone_number: '',
      password: '',
    },
  });

  const {login} = useAuthContext();

  const onSubmit = async (data: PostLoginParams) => {
    LoadingService.setLoading(true, 'Logging in...');
    try {
      await login(data);
      navigation.navigate('Home');
    } catch (err) {
      const error = err as Error;
      Alert.alert(
        error.name ?? 'Login Error',
        error.message ?? JSON.stringify({...error}, null, 2),
      );
    } finally {
      LoadingService.setLoading(false);
    }
  };

  return (
    <>
      <StatusBar
        translucent={false}
        backgroundColor="#ebeef1"
        barStyle="dark-content"
      />

      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={[Typography.h2, styles.textCenter]}>Login</Text>

          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value, ref}}) => (
              <TextInput
                placeholder="Phone number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={Typography.body}
                ref={ref}
                onSubmitEditing={() => setFocus('password')}
                returnKeyType="next"
              />
            )}
            name="phone_number"
          />
          {errors.phone_number && (
            <ErrorText label="Phone number" error={errors.phone_number} />
          )}

          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value, ref}}) => (
              <TextInput
                secureTextEntry
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
                onSubmitEditing={handleSubmit(onSubmit)}
                returnKeyType="done"
              />
            )}
            name="password"
          />
          {errors.password && (
            <ErrorText label="Password" error={errors.password} />
          )}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.button}>
            <Text style={[Typography.bodyBold, styles.textCenter]}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  textCenter: {textAlign: 'center'},
  wrapper: {
    flex: 1,
    backgroundColor: '#ebeef1',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
    gap: 12,
    borderRadius: 24,
    borderWidth: 4,
    margin: 16,
  },
  button: {
    borderRadius: 24,
    borderWidth: 4,
    padding: 16,
    backgroundColor: '#ebeef1',
  },
});
