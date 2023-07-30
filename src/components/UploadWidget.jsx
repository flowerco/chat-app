import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdEdit } from 'react-icons/md';
import { authUpdateUserImage } from '../redux/authSlice';
import { updateCurrentUserProperty } from '../lib/api';

export default function UploadWidget() {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Running the useEffect in the uploadWidget...');
    // TODO: Check we are online here... trying to use the upload widget offline crashes everything!
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = navigator.onLine
      ? cloudinaryRef.current.createUploadWidget(
          {
            cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
            sources: [
              'local',
              'url',
              'facebook',
              'instagram',
              'dropbox',
              'google_drive',
            ],
            cropping: true,
            multiple: false,
            defaultSource: 'local',
            resourceType: 'image',
            maxFileSize: 2000000,
            thumbnailTransformation: [{ width: 100, height: 100, crop: 'fit' }],
            styles: {
              palette: {
                window: '#10173a',
                sourceBg: '#20304b',
                windowBorder: '#7171D0',
                tabIcon: '#79F7FF',
                inactiveTabIcon: '#8E9FBF',
                menuIcons: '#CCE8FF',
                link: '#72F1FF',
                action: '#5333FF',
                inProgress: '#00ffcc',
                complete: '#33ff00',
                error: '#cc3333',
                textDark: '#000000',
                textLight: '#ffffff',
              },
              fonts: {
                default: null,
                "'IBM Plex Sans', sans-serif": {
                  url: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans',
                  active: true,
                },
              },
            },
          },
          function (error, result) {
            if (!error && result.event === 'success') {
              const imageUrl = result.info.thumbnail_url;
              dispatch(authUpdateUserImage(imageUrl));
              updateCurrentUserProperty(
                authState.currentUser._id,
                'userImg',
                imageUrl
              );
            }
            if (error) {
              // TODO: popup in the browser to say image upload failed.
              console.log('Upload Error: ', error);
            }
          }
        )
      : undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigator.onLine]);

  return (
    <button
      type='button'
      onClick={(event) => {
        event.preventDefault();
        if (navigator.onLine) {
          widgetRef.current.open();
        } else {
          alert('Currently offline. Cannot upload a new photo.\nPlease go online to use this functionality.');
        }
      }}
      className='p-2 bg-emerald-400 text-white rounded-full group'
    >
      <MdEdit size={18} />
      <span className='edit-tooltip group-hover:scale-100'>Edit Profile</span>
    </button>
  );
}
