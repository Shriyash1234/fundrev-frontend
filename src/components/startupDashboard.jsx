import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/joy';
import Papa from 'papaparse';
import Plot from 'react-plotly.js';
import './css/dashboard.css';

const StartupDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { CompanyName, businessDescription, revenue } = location.state;
  // console.log(CompanyName);
  // console.log(businessDescription);
  // console.log(revenue)
  useEffect(() => {
    fetchSalesData();
  }, []);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvData = e.target.result;

        try {
          const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true });
          const salesByMonth = groupSalesByMonth(parsedData.data);
          setSalesData(Object.values(salesByMonth));
        } catch (error) {
          console.error('Error parsing CSV:', error);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    setSelectedYear(selectedYear);
  };

  const groupSalesByMonth = (data) => {
    const salesByYear = {};
  
    data.forEach((row) => {
      const date = new Date(row['Order Date']);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthKey = `${month}-${year}`;
  
      if (!salesByYear[year]) {
        salesByYear[year] = Array(12).fill(0); 
      }
  
      salesByYear[year][month - 1] += row['Sales'];
    });
    const salesByYearArray = Object.entries(salesByYear).map(([year, sales]) => ({
      year: parseInt(year),
      sales,
    }));
  
    return salesByYearArray;
  };
  const groupSalesByMonthAPI = (data) => {
    const salesByYear = {};
  
    data.forEach((row) => {
      const date = new Date(row['Order Date']);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthKey = `${month}-${year}`;
  
      if (!salesByYear[year]) {
        salesByYear[year] = Array(12).fill(0); 
      }
  
      salesByYear[year][month - 1] += row['Sales'];
    });
    const salesByYearArray = Object.entries(salesByYear).map(([year, sales]) => ({
      year: parseInt(year),
      sales,
    }));
  
    return salesByYearArray;
  };
  
  const filteredSalesData = salesData.filter((item) => {
    const year = item.year;
    return selectedYear === null || year === selectedYear;
  });
  
  const handleUpdateSales = () => {
    
    fetch('http://localhost:5000/updateSales/'+CompanyName, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salesData)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Sales data updated successfully:', data);
      })
      .catch((error) => {
        console.error('Error updating sales data:', error);
        // Handle errors appropriately
      });
  };
  const fetchSalesData = () => {
  setLoading(true);

  fetch('http://localhost:5000/startup/' + CompanyName)
    .then((response) => response.json())
    .then((data) => {
      const salesDataArray = Object.entries(data.startup.salesData).map(([year, salesObj]) => ({
        year: parseInt(year) + 2019,
        sales: salesObj.sales,
      }));
      
      setSalesData(salesDataArray);
      console.log(salesDataArray);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching sales data:', error);
      setLoading(false);
    });
};


  return (
    <section className='Dashboard'>
      <h1 className='username'>{CompanyName}</h1>
      <h1 className='sentence'>Revenue-{revenue}</h1>
      <div className='update'>
        <input
          id='avatar'
          type='file'
          name='avatar'
          accept='.csv'
          onChange={handleFileUpload}
        />
        <Button className="update-btn" onClick={handleUpdateSales}>Update Sales</Button>

      </div>
      
      
      <Plot
      data={filteredSalesData.map(({ year, sales }) => ({
        type: 'bar',
        x: Array.from({ length: 12 }, (_, i) => i + 1), 
        y: sales,
        name: year.toString(),
      }))}
      layout={{
        title: 'Monthly Sales',
        xaxis: { title: 'Month' },
        yaxis: { title: 'Sales' },
      }}
    />
    </section>
  );
};

export default StartupDashboard;
