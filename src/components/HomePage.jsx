import './HomePage.css'

import React, { useState } from 'react';

import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';

function HomePage() {

  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (e) => {
      setFile(e.target.files[0]);
  };

  const handleUpload = () => {
      const formData = new FormData();
      formData.append('csvfile', file);

      axios.post('http://localhost:8080/upload', formData)
          .then(() => {
              alert('File uploaded successfully');
              fetchData();
              setIsUploaded(true);
          })
          .catch(err => {
              console.error(err);
              alert('File upload failed');
          });
  };

  const fetchData = () => {
      axios.get('http://localhost:8080/data')
          .then(response => {
              setData(response.data);
          })
          .catch(err => {
              console.error(err);
          });
  };

  const handleExport = () => {
      axios.get('http://localhost:8080/export')
          .then(response => {
              const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = 'data.json';
              link.click();
          })
          .catch(err => {
              console.error(err);
          });
  };

    return (
      <div className="container">
            <h1>Upload CSV File</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            {isUploaded && (
            <>
            <h1>Imported Data</h1>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Department</th>
                        <th>License</th>
                        <th>Installed</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Serial</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.username}</td>
                            <td>{row.department}</td>
                            <td>{row.license}</td>
                            <td>{row.installed}</td>
                            <td>{row.brand}</td>
                            <td>{row.model}</td>
                            <td>{row.serial}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            </>
            )}

            <button onClick={handleExport}>Export as JSON</button>
        </div>
    )
  }
  
  export default HomePage