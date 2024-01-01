import React, { useState } from 'react';

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const handleSubmit = async (event, multiFile = false) => {
    event.preventDefault();

    const uploadEnpoint = multiFile ? 'upload-multiple' : 'upload';

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('file', file);
    });

    // Example POST request to your server endpoint
    try {
      const response = await fetch(`http://localhost:8080/api/${uploadEnpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      alert('Files uploaded successfully!');
    } catch (error) {
      console.log(error)
      alert('Error uploading files: ' + error.message);
    }
  };

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e, false)}>
        <h1>Upload Single File</h1>
        <input type="file" name="file" id="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
        {selectedFiles.length === 1 && (
          <div>
            <h3>Selected Files:</h3>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </form>

      {/* example of multiple files being uploaded */}
      {/* <form onSubmit={(e) => handleSubmit(e, true)}>
      <h1>Upload Multiple Files</h1>
      <input type="file" name="file" id="file" multiple onChange={handleFileChange} />
      <button type="submit">Upload</button>
      {selectedFiles.length > 1 && (
        <div>
          <h3>Selected Files:</h3>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </form> */}
    </>
  );

};

export default App;
