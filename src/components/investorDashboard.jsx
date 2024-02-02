import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const InvestorDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { username } = location.state;

  const fetchCompanies = () => {
    setLoading(true);

    fetch('https://fundrev-backend-q8xm.onrender.com/allCompanies')
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data.companies);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <section className='Dashboard'>
      <h3 className='username'>Hi {username}</h3>
      <p className='sentence'>Here are the startups you may be interested in:</p>
      <div class="companies">
      {companies.map((company) => (
        <Box className="company-card" key={company._id} sx={{ width: 350, marginBottom: 2 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
                {company.username}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {company.businessDescription}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Revenue: {company.revenue}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Show Interest</Button>
            </CardActions>
          </Card>
        </Box>
      ))}
      </div>
      
    </section>
  );
};

export default InvestorDashboard;
