import Papa from 'papaparse';

const parseCSV = (csvData) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        resolve(result.data);
      },
      error: (error) => {
        reject(error.message);
      },
    });
  });
};

const groupSalesByMonth = (data) => {
  const salesByMonth = {};
  data.forEach((row) => {
    const date = new Date(row['Order Date']);
    const monthKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
    if (!salesByMonth[monthKey]) {
      salesByMonth[monthKey] = 0;
    }
    salesByMonth[monthKey] += row['Sales'];
  });
  return salesByMonth;
};
