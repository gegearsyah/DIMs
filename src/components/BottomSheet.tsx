import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChevronDown from '@assets/icons/chevron-down.svg';
import Typography from '@styles/Typography';

type BottomSheetProps = {
  visible: boolean;
  scrollable?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  onChange?: (index: number) => void;
  snapPoints?: string[];
  title?: string;
} & ComponentProps<typeof BottomSheetModal>;

const DEFAULT_SNAP_POINTS = Object.freeze(['30%', '50%', '100%'] as const);

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  scrollable,
  children,
  style,
  title,
  onClose,
  onChange,
  snapPoints = DEFAULT_SNAP_POINTS,
  ...props
}) => {
  const _modal = useRef<BottomSheetModal>(null);

  const {top: paddingTop, bottom: paddingBottom} = useSafeAreaInsets();
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!_modal.current) return;

    if (visible) _modal.current.present();
    else _modal.current.dismiss();
  }, [visible]);

  const Wrapper = useMemo(
    () => (scrollable ? BottomSheetScrollView : BottomSheetView),
    [scrollable],
  );

  const handleChange = (index: number) => {
    const snapAt = snapPoints[index];
    setIsFullScreen(snapAt === '100%');
    onChange?.(index);
  };

  const renderBackdrop = useCallback(
    ({style, ...props}: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{...(style as object), backgroundColor: 'transparent'}}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={onClose}
      />
    ),
    [onClose],
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        onDismiss={onClose}
        snapPoints={snapPoints}
        style={[styles.modal, style]}
        backgroundStyle={styles.modalContent}
        {...props}
        ref={_modal}
        onChange={handleChange}
        handleComponent={isFullScreen ? () => null : undefined}
        handleStyle={styles.handle}
        backdropComponent={renderBackdrop}>
        {isFullScreen && (
          <BottomSheetView style={[styles.header, {paddingTop}]}>
            {title && <Text style={[Typography.h2, styles.flex]}>{title}</Text>}
            <TouchableOpacity onPress={onClose}>
              <ChevronDown
                width={32}
                height={32}
                strokeWidth={0.5}
                stroke="#000"
                fill="#000"
              />
            </TouchableOpacity>
          </BottomSheetView>
        )}
        <Wrapper
          style={styles.container}
          contentContainerStyle={{paddingBottom: 40 + paddingBottom}}>
          {!isFullScreen && title && (
            <Text style={[Typography.h2, styles.marginBottom]}>{title}</Text>
          )}
          {children}
        </Wrapper>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderWidth: 4,
    borderRadius: 24,
    marginHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  modal: {
    borderRadius: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  modalContent: {
    borderWidth: 4,
    borderRadius: 24,
    backgroundColor: '#ebeef1',
  },
  handle: {
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  marginBottom: {marginBottom: 8},
  backdrop: {backgroundColor: '#00000080'},
});
