/*
 * Copyright (c) 2012, Intel Corporation. All rights reserved.
 * File revision: 04 October 2012
 * Please see http://software.intel.com/html5/license/samples 
 * and the included README.md file for license terms and conditions.
 */

// Selects photo from the Photo Album
function selectPhoto(e) {
    
    navigator.camera.getPicture(onCaptureSuccess, 
                                onCaptureError, 
                                { quality : 50, 
                                  destinationType : Camera.DestinationType.FILE_URI, 
                                  sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
                                  allowEdit : false, 
                                  encodingType : Camera.EncodingType.JPEG,
                                  targetWidth : 100,
                                  targetHeight : 100,
                                  mediaType: Camera.MediaType.PICTURE,
                                  saveToPhotoAlbum : false,
                                  correctOrientation: true
                                });
    
    // Sets contact photo URL
    function onCaptureSuccess(imageData) {
        
        getElement("photo_loc_input").src = imageData;
        getElement("photo_loc_input").style.display = "block";
    }

    function onCaptureError(message) { }
}