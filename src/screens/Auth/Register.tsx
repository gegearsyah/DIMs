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
import {useAuthContext} from '@contexts';
import {PostRegisterParams, RootStack} from '@types';
import {LoadingService} from '@services';
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
      role: '',
      full_name: '',
      password: '',
    },
  });

  const {register} = useAuthContext();

  const onSubmit = async (data: PostRegisterParams) => {
    LoadingService.setLoading(true, 'Submitting...');
    try {
      await register(data);
      navigation.navigate('Login');
    } catch (err) {
      const error = err as Error;
      Alert.alert(
        error.name ?? 'Register Error',
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
          <Text style={[Typography.h2, styles.textCenter]}>Register</Text>

          <Controller
            control={control}
            rules={{required: true, minLength: 10, maxLength: 13}}
            render={({field: {onChange, onBlur, value, ref}}) => (
              <TextInput
                placeholder="Phone number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={Typography.body}
                ref={ref}
                onSubmitEditing={() => setFocus('full_name')}
                returnKeyType="done"
              />
            )}
            name="phone_number"
          />
          {errors.phone_number && (
            <ErrorText label="Phone number" error={errors.phone_number} />
          )}

          <Controller
            control={control}
            rules={{required: true, maxLength: 100}}
            render={({field: {onChange, onBlur, value, ref}}) => (
              <TextInput
                placeholder="Full name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
                onSubmitEditing={() => setFocus('password')}
                returnKeyType="next"
              />
            )}
            name="full_name"
          />
          {errors.full_name && (
            <ErrorText label="Full name" error={errors.full_name} />
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

          {/* <Controller
          control={control}
          rules={{required: true}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="Verify password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="role"
        /> */}

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
  },
  container: {
    flex: 1,
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
