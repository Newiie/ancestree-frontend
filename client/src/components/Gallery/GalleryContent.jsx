
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from "../../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { FaTrash } from 'react-icons/fa'; // Import FontAwesome trash icon
import Modal from 'react-modal';
import './Gallery.css';

Modal.setAppElement('#root');

const GalleryContent = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchAlbums(user.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchAlbums = async (userId) => {
    const userAlbumsCollection = collection(db, 'Users', userId, 'albums');
    const albumSnapshot = await getDocs(userAlbumsCollection);
    const albumList = albumSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAlbums(albumList);
  };

  const fetchPhotos = async (albumId) => {
    const photosCollection = collection(db, 'Users', user.uid, 'albums', albumId, 'photos');
    const photoSnapshot = await getDocs(photosCollection);
    const photoList = photoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPhotos(photoList);
  };

  const createAlbum = async () => {
    const albumName = prompt("Enter album name:");
    if (albumName && user) {
      const newAlbum = { name: albumName, userId: user.uid };
      await addDoc(collection(db, 'Users', user.uid, 'albums'), newAlbum);
      fetchAlbums(user.uid);
    }
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    fetchPhotos(album.id);
  };

  const handleDeleteAlbum = async (albumId) => {
    if (user) {
      const confirmed = window.confirm("Are you sure you want to delete this album and all its photos?");
      if (confirmed) {
        const albumRef = doc(db, 'Users', user.uid, 'albums', albumId);

        // Delete all photos in the album from storage
        const photosFolderRef = ref(storage, `Users/${user.uid}/albums/${albumId}/photos`);
        const photosList = await listAll(photosFolderRef);
        const deletePromises = photosList.items.map(item => deleteObject(item));
        await Promise.all(deletePromises);

        // Delete album document
        await deleteDoc(albumRef);
        fetchAlbums(user.uid);
      }
    }
  };

  const handlePhotoUpload = async (event) => {
    const files = event.target.files;
    if (files.length > 0 && selectedAlbum && user) {
      const uploadPromises = Array.from(files).map(async (file) => {
        const storageRef = ref(storage, `Users/${user.uid}/albums/${selectedAlbum.id}/photos/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        const newPhoto = { name: file.name, albumId: selectedAlbum.id, userId: user.uid, photoURL: downloadURL };
        return addDoc(collection(db, 'Users', user.uid, 'albums', selectedAlbum.id, 'photos'), newPhoto);
      });
      await Promise.all(uploadPromises);
      fetchPhotos(selectedAlbum.id);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (selectedAlbum && user) {
      await deleteDoc(doc(db, 'Users', user.uid, 'albums', selectedAlbum.id, 'photos', photoId));
      fetchPhotos(selectedAlbum.id);
      setModalIsOpen(false);
    }
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setCaption(photo.caption || '');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPhoto(null);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSaveCaption = async () => {
    if (selectedPhoto && selectedAlbum && user) {
      const photoRef = doc(db, 'Users', user.uid, 'albums', selectedAlbum.id, 'photos', selectedPhoto.id);
      await updateDoc(photoRef, { caption });
      fetchPhotos(selectedAlbum.id);
      setModalIsOpen(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Albums</h1>
      <button onClick={createAlbum}>Add Album</button>
      <div className="album-container">
        {albums.map(album => (
          <div key={album.id} className="album">
            <div className="album-name" onClick={() => handleAlbumClick(album)}>{album.name}</div>
            <FaTrash className="delete-icon" onClick={() => handleDeleteAlbum(album.id)} />
          </div>
        ))}
      </div>
      <h1>Photos</h1>
      <h3>Click on an album to view photos. :3</h3>
      {selectedAlbum && (
        <div className="photo-preview">
          <h2>{selectedAlbum.name}</h2>
          <input type="file" multiple onChange={handlePhotoUpload} />
          <div className="photos-container">
            {photos.length === 0 ? (
              <div>No photos in this album.</div>
            ) : (
              photos.map(photo => (
                <div key={photo.id} className="photo" onClick={() => openModal(photo)}>
                  <img src={photo.photoURL} alt={photo.name} className="photo-thumbnail" />
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {selectedPhoto && (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Photo Modal">
          <h2>Edit Photo</h2>
          <img src={selectedPhoto.photoURL} alt={selectedPhoto.name} className="photo-full" />
          <input
            type="text"
            value={caption}
            onChange={handleCaptionChange}
            placeholder="Add a caption"
          />
          <button onClick={handleSaveCaption}>Save Caption</button>
          <button onClick={() => handleDeletePhoto(selectedPhoto.id)}>Delete Photo</button>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default GalleryContent;
