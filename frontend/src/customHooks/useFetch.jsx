import { useEffect, useState } from 'react';
import axios from 'axios';

function useFetch(url,param) {
   const [results, setResults] = useState({});
   const [isLoading, setIsLoading] = useState(false);

   const handleResponse = async response => {
      if (response.status === 200) {
         const data = await response.json();
         setResults(data);
      }
      setIsLoading(false);
   };

   const fetchData = async () => {
      setIsLoading(true);
      try {
         const response = await fetch(`http://localhost:3001/api/movies/${url}?${param}`,{
            method: 'GET',
            headers: {
               Authorization: 'Bearer RYoOcWM4JW',
               'Content-Type': 'application/json'
            }
         });
        handleResponse(response);

      } catch (error) {
         console.log(error);
         setIsLoading(false);
      }
   };
  
   useEffect(() => {
      fetchData();
      // eslint-disable-next-line
   }, [url,param]);

   return { results, isLoading };
}

export default useFetch;
