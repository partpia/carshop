import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';
import AddCar from './AddCar';
import Snackbar from '@mui/material/Snackbar';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import EditCar from './EditCar';

function Carlist() {

    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');

    const handleClose = () => {
        setOpen(false);
      };

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = () => {
        fetch('http://carrestapi.herokuapp.com/cars')
            .then(response => response.json())
            .then(data => setCars(data._embedded.cars))
            .catch(err => console.error(err))
    }

    const deleteCar = url => {
        if (window.confirm('Are you sure?')) {
            fetch(url, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        fetchCars();
                        setMsg('Car deleted');
                        setOpen(true);
                    }
                    else
                        alert('Poisto ei onnistunut')
                })
                .catch(err => console.error(err))
        }
    }

    const addCar = car => {
        fetch('http://carrestapi.herokuapp.com/cars',
            {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(car)
            }
        )
        .then(_ => fetchCars())
        .catch(err => console.error(err))
    }

    const editCar = (url, updatedCar) => {
        fetch(url, {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(updatedCar)
        })
        .then(_ => {
            setMsg('Car updated');
            setOpen(true);
            fetchCars()
        })
        .catch(err => console.error(err))
    }

    const columns = [
        { field: 'brand', sortable: true, filter: true },
        { field: 'model', sortable: true, filter: true },
        { field: 'color', sortable: true, filter: true },
        { field: 'fuel', sortable: true, filter: true, width: 120 },
        { field: 'year', sortable: true, filter: true, width: 120 },
        { field: 'price', sortable: true, filter: true, width: 120 },
        {
            headerName: '',
            sortable: false,
            filter: false,
            field: '_links.self.href',
            cellRendererFramework: params => <Button size="small" color="error" onClick={() => deleteCar(params.value)}>Delete</Button>
        },
        {
            headerName: '',
            sortable: false,
            filter: false,
            width: 120,
            field: '_links.self.href',
            cellRendererFramework: params => < EditCar editCar={editCar} car={params} />
        }
    ]

    return (
        <div>
            <AddCar addCar={addCar} />
            <div className="ag-theme-material" style={{ marginTop: 20, height: 600, width: '80%', margin: 'auto' }}>
                <AgGridReact
                    rowData={cars}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={10}
                    suppressCellSelection={true}>
                </AgGridReact>
            </div>
            <Snackbar
                open={open}
                message={msg}
                autoHideDuration={3000}
                onClose={handleClose}
            />
        </div>
    );
}
export default Carlist;
