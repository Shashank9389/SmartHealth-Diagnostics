import React from 'react'
import axios from 'axios';

const Testing = () => {
    const handleClick =  async ()=>{
        try {
            const response = await axios.get('http://127.0.0.1:5000/');
            console.log(response)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }
  return (
    <div>
      <h1>Data from API:</h1>
      <button onClick={handleClick}>CHECK API</button>
    </div>
  )
}

export default Testing
