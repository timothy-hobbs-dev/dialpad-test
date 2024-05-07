import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PhoneNumber{
  id:number,
  phone:string
}
const PhoneCall: React.FC = () => {
  const [sourceNumbers, setSourceNumbers] = useState<PhoneNumber[]>([]);
  const [selectedSourceNumber, setSelectedSourceNumber] = useState<string>('');
  const [targetNumber, setTargetNumber] = useState('');
  const [responseMessage,setResponseMessage] = useState();

  useEffect(() => {
    const fetchSourceNumbers = async () => {
      try {
        const response:any = await axios.get(process.env.REACT_APP_BASE_URL + '/users', {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          },
        });
        const fetchedItems:PhoneNumber[] = response.data.items.map((item:any)=>(
          {id:item.id,phone:item.phone_numbers[0]}
        ));
        console.log(fetchedItems)
        setSourceNumbers(fetchedItems); 
      } catch (error) {
        console.error('Error fetching source numbers:', error);
      }
    };

    fetchSourceNumbers();
  }, []); 

  const handleCall = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + `/users/${selectedSourceNumber}/initiate_call`,
        {
          phone_number: targetNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          },
        }
      );
      if (response.status != 200){
        
      }
      

      console.log('Call initiated successfully:', response.data);
    } catch (error:any) {
      setResponseMessage(error.message)
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
              <option key={number.id} value={number.id}>
                {number.phone}
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
      <p id="response-message">{responseMessage}</p>
    </div>
  );
};

export default PhoneCall;
