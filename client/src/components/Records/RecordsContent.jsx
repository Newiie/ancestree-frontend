

import React, { useState, useEffect } from 'react';
import { auth, db, storage } from "../../firebase";
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import './Records.css';



const RecordsContent = () => {
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileDetails, setFileDetails] = useState({});
  const [filter, setFilter] = useState('All');
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, fileId: null, fileURL: null });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUploadedFiles(user.uid);
      } else {
        setUser(null);
        setUploadedFiles([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUploadedFiles = async (uid) => {
    try {
      const q = query(collection(db, "Records"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const files = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUploadedFiles(files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleDetailChange = (e, index) => {
    const { name, value } = e.target;
    setFileDetails({
      ...fileDetails,
      [index]: {
        ...fileDetails[index],
        [name]: value,
      },
    });
  };

  const handleUpload = async () => {
    if (user) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const details = fileDetails[i] || {}; 
        const storageRef = ref(storage, `records/${user.uid}/${file.name}`);
        try {
          await uploadBytes(storageRef, file);
          const fileURL = await getDownloadURL(storageRef);
          await addDoc(collection(db, "Records"), {
            uid: user.uid,
            fileName: file.name,
            fileURL,
            uploadTime: new Date(),
            ...details,
          });
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
      setFiles([]);
      setFileDetails({});
      fetchUploadedFiles(user.uid);
    }
  };

  const confirmDelete = (fileId, fileURL) => {
    setDeleteConfirm({ show: true, fileId, fileURL });
  };

  const handleDelete = async (fileId, fileURL) => {
    if (user) {
      try {
        const fileRef = ref(storage, fileURL);
        await deleteObject(fileRef);
        await deleteDoc(doc(db, "Records", fileId));
        fetchUploadedFiles(user.uid);
      } catch (error) {
        console.error('Error deleting file:', error);
      } finally {
        setDeleteConfirm({ show: false, fileId: null, fileURL: null });
      }
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleUpdate = async (fileId, index) => {
    if (user) {
      try {
        const details = fileDetails[index] || {};
        await updateDoc(doc(db, "Records", fileId), {
          ...details,
        });
        setEditingIndex(null);
        fetchUploadedFiles(user.uid);
      } catch (error) {
        console.error('Error updating file:', error);
      }
    }
  };

  const filteredFiles = filter === 'All' ? uploadedFiles : uploadedFiles.filter(file => file.type === filter);

  return (
    <div className="records-content">
      <h2>Upload Records</h2>
      <input type="file" multiple onChange={handleFileChange} />
      {files.map((file, index) => (
        <div key={index} className="file-detail">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={fileDetails[index]?.title || ''}
            onChange={(e) => handleDetailChange(e, index)}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={fileDetails[index]?.description || ''}
            onChange={(e) => handleDetailChange(e, index)}
          />
          <select
            name="type"
            value={fileDetails[index]?.type || ''}
            onChange={(e) => handleDetailChange(e, index)}
          >
            <option value="">Select type</option>
            <option value="Image">Image</option>
            <option value="PDF">PDF</option>
            <option value="Document">Document</option>
            <option value="Other">Other</option>
          </select>
        </div>
      ))}
      <button onClick={handleUpload} disabled={!files.length}>Upload</button>
      <div className="filter">
        <label>Filter by type:</label>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="All">All</option>
          <option value="Image">Image</option>
          <option value="PDF">PDF</option>
          <option value="Document">Document</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="uploaded-files">
        <h2>Uploaded Files</h2>
        {filteredFiles.length > 0 ? (
          <div className="file-grid">
            {filteredFiles.map((file, index) => (
              <div key={index} className="file-preview">
                {file.type === "Image" ? (
                  <img src={file.fileURL} alt={file.fileName} />
                ) : (
                  <a href={file.fileURL} target="_blank" rel="noopener noreferrer">
                    {file.fileName}

                  </a>
                )}
                {editingIndex === index ? (
                <div className="file-edit">
                  <strong>Title: </strong>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={fileDetails[index]?.title || file.title}
                    onChange={(e) => handleDetailChange(e, index)}
                  />
                  <strong>Description: </strong>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={fileDetails[index]?.description || file.description}
                    onChange={(e) => handleDetailChange(e, index)}
                  />
                  <strong>Type: </strong>
                  <select
                    name="type"
                    value={fileDetails[index]?.type || file.type}
                    onChange={(e) => handleDetailChange(e, index)}
                  >
                    <option value="">Select type</option>
                    <option value="Image">Image</option>
                    <option value="PDF">PDF</option>
                    <option value="Document">Document</option>
                    <option value="Other">Other</option>
                  </select>
                  <button onClick={() => handleUpdate(file.id, index)}>Save</button>
                  <button onClick={() => setEditingIndex(null)}>Cancel</button>
                </div>
              ) : (
                  <div className="file-info">
                    <p><strong>Title:</strong> {file.title}</p>
                    <p><strong>Description:</strong> {file.description}</p>
                    <p><strong>Type:</strong> {file.type}</p>
                    <p><strong>Uploaded:</strong> {new Date(file.uploadTime.seconds * 1000).toLocaleDateString()}</p>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => confirmDelete(file.id, file.fileURL)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
      {deleteConfirm.show && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this file?</p>
          <button onClick={() => handleDelete(deleteConfirm.fileId, deleteConfirm.fileURL)}>Yes</button>
          <button onClick={() => setDeleteConfirm({ show: false, fileId: null, fileURL: null })}>No</button>
        </div>
      )}
    </div>
  );
};

export default RecordsContent;
