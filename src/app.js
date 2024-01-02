import React, { useState, useRef } from 'react';

const App = () => {
  const [filesProgress, setFilesProgress] = useState([]);
  const fileInputRef = useRef();

  /**
   * Start: Configuation Variables
   */
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed MIME types
  const apiUrl = 'http://localhost:8080/api/upload';
  const inputAccepts = '.jpg,.png,.gif' // comma-separated list of file extensions
  const maxFiles = 3; // Maximum number of files that can be uploaded at once
  const maxFileSize = 5 * 1024 * 1024;  // 5 MB
  /**
   * End: Configuation Variables
   */

  /**
   *
   * @param {*} event
   * @returns void
   *
   * This function is called when the user selects files.
   * It validates the files and sets the state.
   */
  const handleFileChange = (event) => {

    if (filesSelected.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at a time.`);
      fileInputRef.current.value = '';
      return;
    }

    let allFilesValid = true;

    const selectedFiles = Array.from(event.target.files).filter(file => {
      if (!allowedTypes.includes(file.type) || file.size > maxFileSize) {
        allFilesValid = false;
        return false;
      }
      return true;
    });

    if (!allFilesValid) {
      alert('Some files were rejected due to incorrect file type or size');
      fileInputRef.current.value = ''; // Reset file input
    }

    const filesWithProgress = selectedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));

    setFilesProgress(filesWithProgress);
  };

  /**
   *
   * @param {*} fileIndex
   * @returns void
   *
   * This function is called when the file upload progress changes.
   * It updates the state with the new progress.
   */
  const handleUploadProgress = (fileIndex) => (event) => {
    if (event.lengthComputable) {
      const progress = Math.round((event.loaded * 100) / event.total);
      setFilesProgress(prevFilesProgress => prevFilesProgress.map((fp, index) => {
        if (index === fileIndex) {
          return { ...fp, progress };
        }
        return fp;
      }));
    }
  };

  /**
   *
   * @param {*} event
   * @returns void
   *
   * This function is called when the user submits the form.
   * It uploads all files in the state.
   * It uses XMLHttpRequest to upload the files.
   * It uses Promise.all to wait for all files to upload.
   * It resets the state and file input after all files are uploaded.
   * It displays an alert when all files are uploaded.
   * It logs an error if any file upload fails.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const uploadPromises = filesProgress.map((fp, index) => {
      const formData = new FormData();
      formData.append('file', fp.file);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', apiUrl, true);

        xhr.upload.onprogress = handleUploadProgress(index);

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });
    });

    try {
      await Promise.all(uploadPromises);
      alert('All files uploaded successfully!');
      setFilesProgress([]); // Reset progress
      fileInputRef.current.value = ''; // Reset file input
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="file"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          accept={inputAccepts}
        />
        <button type="submit">Upload</button>
      </form>
      {filesProgress.map((fp, index) => (
        <div key={index}>
          <p>
            {fp.file.name} ({Math.round(fp.file.size / 1024)} KB)
          </p>
          <progress value={fp.progress} max="100"></progress>
          <span>{fp.progress}%</span>
        </div>
      ))}
    </div>
  );
};

export default App;
