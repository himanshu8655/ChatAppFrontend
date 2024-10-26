import React from 'react';
import { View, Image, StyleSheet, Text, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Message {
  from: string;
  message: string;
  fileUri?: string;
}

const isValidImageUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

const getExtension = (url: string | undefined): string => {
  if (!url) return '';
  const uriArray = url.split(".");
  return uriArray.length > 1 ? uriArray[uriArray.length - 1] : '';
};

const FilePreview = (props: Message) => {

  const preview = async () => {
    if (props.fileUri) {
      await Linking.openURL(props.fileUri);
    }
  };

  const isImage = isValidImageUrl(props.fileUri);

  return (
    <TouchableOpacity onPress={preview} activeOpacity={0.7}>
      <View style={styles.container}>
        {isImage && props.fileUri ? (
          <Image source={{ uri: props.fileUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.image}>
            <Text style={styles.extensionText}>.{getExtension(props.fileUri).toUpperCase()}</Text>
            <Text style={styles.linkText}>Click here to Preview</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extensionText: {
    fontSize: 20, 
    fontWeight: 'bold', 
  },
  linkText: {
    fontSize: 14, 
    color: 'blue',
  },
});

export default FilePreview;
