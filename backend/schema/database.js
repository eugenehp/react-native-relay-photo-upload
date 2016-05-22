import Promise        from 'bluebird';
import DataURI        from 'datauri';
import path           from 'path';

function Image(id, title, url) {
  this.id = id.toString()
  this.title = title;
  this.url = url;

}
var images = [];

var image = new Image(images.length,'reactive-native','reactive-native.png');
images.push(image);

function getAnonymousImage(){
  return images[0];
}

function uploadImage(title, file){
  console.log('uploadImage',title, file);


  return new Promise(function(resolve, reject) {
    
    if(file){
      var img = new Image(images.length, title, file.path);
      images.push(img);
      resolve(img);
      
    }else{
      reject('failed to store image')
    }
    
  });
}

module.exports = {
  Image: Image,
  uploadImage: uploadImage,
  getAnonymousImage: getAnonymousImage,
  getImage: function(id) { return images.filter(function(i) { return i.id == id })[0] }
}
