import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import Relay from 'react-relay';
import { ImagePickerManager } from 'NativeModules';

import Mutation from './mutation';

let sandbox = "http://localhost:8080/graphql";
Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer(sandbox));

export default class App extends Component {

  state = {
    avatarSource: null,
    urlSource:    null
  };

  constructor(props) {
    super(props);
  }

  selectPhotoTapped() {
    const options = {
      title: 'Photo Picker',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      quality: 0.5,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: true
      },
      allowsEditing: true
    };

    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either:
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        var source;
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  uploadPhoto(){
    if(!this.state.avatarSource) return false;
    this.setState({uploading: true});

    let file = {
      uri: this.state.avatarSource.uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };

    let image = { 
      file:file,
      title: Date.now().toString(),
      clientMutationId: guid()
    };

    var transaction = Relay.Store.applyUpdate(new Mutation({image:image}), {
      onFailure:(_transaction)=>{
        var error = _transaction.getError() || new Error('Mutation failed.');
        console.error(error);
        this.setState({uploading: false});
      },
      onSuccess:(e)=>{
        var path = e.image.image.url;
        console.log('onSuccess',path);
        this.setState({
          uploading: false,
          urlSource: {uri:'http://localhost:8080/'+path}
        });
      }
    });
    transaction.commit();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
          { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
            <Image style={styles.avatar} source={this.state.avatarSource} />
          }
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.uploadPhoto.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer]}>
          { this.state.urlSource === null ? <Text>Upload a Photo</Text> :
            <Image style={styles.avatar} source={this.state.urlSource} />
          }
          </View>
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

AppRegistry.registerComponent('App', () => App);
