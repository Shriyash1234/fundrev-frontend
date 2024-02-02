import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Option from '@mui/joy/Option';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import TextField from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import { Link } from 'react-router-dom';


const InputCredentials = (props) => {
    const [currency, setCurrency] = React.useState('dollar');
    const Navigate = useNavigate();
    const [investorFormData, setinvestorFormData] = useState({
        username: '',
        password: '',
        businessDescription: '', 
        revenue: '',
    });
    const handleChange = (e) => {
        setinvestorFormData({ ...investorFormData, [e.target.name]: e.target.value });
    };
    async function handlSubmit(){
        let Link="",jsonData="";
        if(investorFormData.businessDescription===''){
            Link = 'https://fundrev-backend-q8xm.onrender.com/addinvestor';
            const formDataCopy = { ...investorFormData };
            delete formDataCopy.businessDescription;
            delete formDataCopy.revenue;
            jsonData = JSON.stringify(formDataCopy);
            setinvestorFormData(formDataCopy);
        }
        else{
            Link = 'https://fundrev-backend-q8xm.onrender.com/addstartup';
            jsonData = JSON.stringify(investorFormData);
        }
        console.log(jsonData)
        try{
            console.log(Link)
            const response = await fetch(Link, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: jsonData
          });
          Navigate("/Login")
        }
        catch(error){
            console.log(error);
        }
    }
    async function handleLogin(){
        let Link="";
        const formDataCopy = { ...investorFormData };
        delete formDataCopy.businessDescription;
        delete formDataCopy.revenue;
        const jsonData = JSON.stringify(formDataCopy);
        setinvestorFormData(formDataCopy);
        try{
            Link = props.mode==="Investor"?"https://fundrev-backend-q8xm.onrender.com/checkinvestorpassword":"https://fundrev-backend-q8xm.onrender.com/checkstartuppassword"
            console.log(Link)
            const response = await fetch(Link, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: jsonData
          });
          if (response.ok) {
            const data = await response.json();
            console.log(data.message)
            if(data.message === "ok"){
                if(props.mode==="Startup"){
                    Navigate("/dashboard/startup",{state:{
                        CompanyName:data.username,
                        businessDescription:data.businessDescription,
                        revenue:data.revenue
                    }})
                }
                else{
                    Navigate("/dashboard/investor",{state:{
                        username:data.username,
                    }})
                }
                
            }
            else{
                alert("Incorrect Password")
            }
          }
        }
        catch(error){
            console.log(error);
        }
    }
  return (
    <div className='credentials'>
        
        {
            props.mode==="Investor"?
            <Stack spacing={2}>
                <Input className='input'
                name = 'username'
                value={investorFormData.username}
                onChange={handleChange}
                placeholder={props.text==="Login"?"Username":"Enter Username"}
                sx={{
                '&::before': {
                    border: '1.5px solid var(--Input-focusedHighlight)',
                    transform: 'scaleX(0)',
                    left: '2.5px',
                    right: '2.5px',
                    bottom: 0,
                    top: 'unset',
                    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                    borderRadius: 0,
                    borderBottomLeftRadius: '64px 20px',
                    borderBottomRightRadius: '64px 20px',
                },
                '&:focus-within::before': {
                    transform: 'scaleX(1)',
                },
                }}
            />
                <Input className='input'
                type='password'
                name = 'password'
                value={investorFormData.password}
                onChange={handleChange}
                placeholder={props.text==="Login"?"Password":"Enter Password"}
                sx={{
                '&::before': {
                    border: '1.5px solid var(--Input-focusedHighlight)',
                    transform: 'scaleX(0)',
                    left: '2.5px',
                    right: '2.5px',
                    bottom: 0,
                    top: 'unset',
                    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                    borderRadius: 0,
                    borderBottomLeftRadius: '64px 20px',
                    borderBottomRightRadius: '64px 20px',
                },
                '&:focus-within::before': {
                    transform: 'scaleX(1)',
                },
                }}
                />
            </Stack>
        :
            <Stack spacing={2}>
                <Input className='input'
                name="username"
                onChange={handleChange}
                placeholder={props.text==="Login"?"Username":"Enter Company Name/Username"}
                sx={{
                '&::before': {
                    border: '1.5px solid var(--Input-focusedHighlight)',
                    transform: 'scaleX(0)',
                    left: '2.5px',
                    right: '2.5px',
                    bottom: 0,
                    top: 'unset',
                    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                    borderRadius: 0,
                    borderBottomLeftRadius: '64px 20px',
                    borderBottomRightRadius: '64px 20px',
                },
                '&:focus-within::before': {
                    transform: 'scaleX(1)',
                },
                }}
                />
                {
                    props.text==="Sign up"?
                    <Stack spacing={2}>
                        <TextField  
                            rows={5} 
                            name = "businessDescription"
                            onChange={handleChange}
                            placeholder="Enter Business Description"/> 
                        <Input
                            placeholder="Revenue"
                            onChange={handleChange}
                            name = "revenue"
                            startDecorator={{ dollar: '$', inr: '₹' }[currency]}
                            endDecorator={
                            <React.Fragment>
                                <Divider orientation="vertical" />
                                <Select
                                variant="plain"
                                name="currency"
                                value={currency}
                                onChange={(_, value) => setCurrency(value)}
                                slotProps={{
                                    listbox: {
                                    variant: 'outlined',
                                    },
                                }}
                                sx={{ mr: -1.5, '&:hover': { bgcolor: 'transparent' } }}
                                >
                                <Option value="dollar">US dollar</Option>
                                <Option value="inr">Indian Rupees</Option>
                                </Select>
                            </React.Fragment>
                            }
                            sx={{ width: 300 }}
                        />
                    </Stack>:""
                }
                               
                <Input className='input'
                type='password'
                name="password"
                onChange={handleChange}
                placeholder={props.text==="Login"?"Password":"Enter Password"}
                sx={{
                '&::before': {
                    border: '1.5px solid var(--Input-focusedHighlight)',
                    transform: 'scaleX(0)',
                    left: '2.5px',
                    right: '2.5px',
                    bottom: 0,
                    top: 'unset',
                    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                    borderRadius: 0,
                    borderBottomLeftRadius: '64px 20px',
                    borderBottomRightRadius: '64px 20px',
                },
                '&:focus-within::before': {
                    transform: 'scaleX(1)',
                },
                }}
                />
            </Stack>
        }
        {
            props.text==="Login"?
            <p>Don't have an account yet?<Link className='sign-up-link' to="/signup"> Sign up</Link></p>
            :<p></p>
        }
        
        <Button className="button" size="lg" onClick={props.text==="Login"?handleLogin:handlSubmit}>{props.text}</Button>
    </div>
  )
}

export default InputCredentials
