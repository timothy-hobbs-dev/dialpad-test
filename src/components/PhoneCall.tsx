import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PhoneCall: React.FC = () => {
  const [sourceNumbers, setSourceNumbers] = useState<string[]>([]);
  const [selectedSourceNumber, setSelectedSourceNumber] = useState<string>('');
  const [targetNumber, setTargetNumber] = useState('');

  useEffect(() => {
    const fetchSourceNumbers = async () => {
      try {
        const response = await axios.get(process.env.BASE_URL + '/users', {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        });

        setSourceNumbers(response.data.target.id); 
      } catch (error) {
        console.error('Error fetching source numbers:', error);
      }
    };

    fetchSourceNumbers();
  }, []); 

  const handleCall = async () => {
    try {
      const response = await axios.post(
        process.env.BASE_URL + `/users/${selectedSourceNumber}/initiate_call`,
        {
          target: targetNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      );

      console.log('Call initiated successfully:', response.data);
    } catch (error) {
      console.error('Error making call:', error);
    }
  };

  return (
    <div>
      <h2>Make a Phone Call</h2>
      <form>
        <label>
          Source Phone Number:
          <select value={selectedSourceNumber} onChange={(e) => setSelectedSourceNumber(e.target.value)}>
            <option value="">Select Source Number</option>
            {sourceNumbers.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Target Phone Number:
          <input
            type="text"
            value={targetNumber}
            onChange={(e) => setTargetNumber(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleCall} disabled={!selectedSourceNumber || !targetNumber}>
          Make Call
        </button>
      </form>
    </div>
  );
};

export default PhoneCall;
