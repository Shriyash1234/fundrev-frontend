import { useEffect, useState } from 'react'
import React from 'react'
import Plot from 'react-plotly.js'
import { useLocation } from 'react-router-dom'

const InvestorStartupSales = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { startupName, investorName} = location.state;
  const [permission, setPermission] = useState();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const hasPermission = () => {
    setLoading(true);
  
    fetch('https://fundrev-backend-q8xm.onrender.com/incomingRequests/' + startupName)
      .then((response) => response.json())
      .then((data) => {
        const matchingRequests = data.requests.filter(
          (request) => request.status === 'accepted' && request.investorName === investorName
        );
        if (matchingRequests.length > 0) {
          setPermission(true);
        } else {
          setPermission(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching requests:', error);
        setLoading(false);
      });
  };
  const fetchSalesData = () => {
    setLoading(true);
  
    fetch('https://fundrev-backend-q8xm.onrender.com/startup/' + startupName)
      .then((response) => response.json())
      .then((data) => {
        const salesDataArray = Object.entries(data.startup.salesData).map(([year, salesObj]) => ({
          year: parseInt(year) + 2019,
          sales: salesObj.sales,
        }));
        setSalesData(salesDataArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      });
    };
   const filteredSalesData = salesData.filter((item) => {
    const year = item.year;
    return selectedYear === null || year === selectedYear;
    });
  useEffect(()=>{
    hasPermission();
    fetchSalesData();
  },[])  
  return (
    <div className='Dashboard'>
      {permission === true?
      <div>
        <p className='sentence'>Hi {investorName}</p>
        <p className='sentence'>Here is the sales data of {startupName}</p>
        <Plot
        className='sales-plot'
        data={filteredSalesData.map(({ year, sales }) => ({
            type: 'bar',
            x: months, 
            y: sales,
            name: year.toString(),
        }))}
        layout={{
            title: 'Monthly Sales',
            xaxis: { title: 'Month' },
            yaxis: { title: 'Sales' },
        }}
        />
      </div>
      
      :<p>You do not have permission to view this webpage.</p>}
    </div>
  )
}

export default InvestorStartupSales
