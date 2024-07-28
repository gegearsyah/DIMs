import React, {ComponentProps, useState} from 'react';
import {
  ImageBackground,
  Image,
  View,
  Dimensions,
  LayoutChangeEvent,
  ViewStyle,
  StyleProp,
} from 'react-native';

type FullWidthImageProps = {
  ratio?: number;
  source: string | {uri: string};
  style: StyleProp<ViewStyle>;
} & ComponentProps<typeof ImageBackground>;

const FullWidthImage: React.FC<FullWidthImageProps> = ({
  ratio,
  source,
  style,
  children,
  ...rest
}) => {
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [height, setHeight] = useState(Dimensions.get('window').height);

  const handleLayout = (event: LayoutChangeEvent) => {
    const containerWidth = event.nativeEvent.layout.width;

    if (ratio) {
      setWidth(containerWidth);
      setHeight(containerWidth * ratio);
    } else if (typeof source === 'number') {
      const asset = Image.resolveAssetSource(source);
      const {width, height} = asset;

      setWidth(containerWidth);
      setHeight((containerWidth * height) / width);
    } else {
      const uri =
        typeof source === 'string'
          ? source
          : typeof source === 'object' && typeof source.uri === 'string'
            ? source.uri
            : null;

      if (uri) {
        Image.getSize(uri, (width, height) => {
          setWidth(containerWidth);
          setHeight((containerWidth * height) / width);
        });
      }
    }
  };

  return (
    <View onLayout={handleLayout} style={style}>
      <ImageBackground
        source={source}
        style={[{width, height: height || 0}, style]}
        {...rest}>
        {children}
      </ImageBackground>
    </View>
  );
};

export default FullWidthImage;
