'use client'
import { faFileExcel, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import * as XLSX from "xlsx";

const fetchBitacora = async () => {
  const res = await fetch('/api/bitacora');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};


const ExcelButton = () => {

  const [loading, setLoading] = useState(false);
  const exportToExcel = async() => {
    setLoading(true);
    const data = await fetchBitacora()
    const result = data.result;
    //const data = await response.json();
    //console.log(response.result);
     const worksheet = XLSX.utils?.json_to_sheet(result);
      const workbook = XLSX.utils?.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, 'bitacora.xlsx'); 
      setLoading(false);
    }
  


  return (<>
  
  <button onClick={exportToExcel} disabled={loading}>
      <FontAwesomeIcon icon={faFileExcel} style={{ marginRight: '8px' }} />
      <span className="relative">
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />
            Loading...
          </>
        ) : (
          "Download"
        )}
      </span>
    </button>
  
     </>);
};

export default ExcelButton;


