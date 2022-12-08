import * as React from 'react';
import { Component } from 'react';
import { authenticationService } from '../services/authentication-service';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from 'react-bootstrap/Table';
import { IMAGES, ROUTES } from '../components/constants';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';
import AddCircleIcon from '@mui/icons-material/AddCircle';

/* FUNCTIONS */
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

class RiderPage extends Component {
    constructor(props) {
        super(props);
        console.log(props)
    }


    state = {
        rider: {}, globalOrders: [], myOrders: [], restaurants: [], disabled: true, disabledMatricula: true,
        value: (this.props.location.value == undefined) ? 1 : this.props.location.value
    }

    /* INITIALIZER */
    async componentDidMount() {
        await fetch(ROUTES.PROXY + '/restaurant/showAllRestaurants', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            
            return response.json();
        }).then(data => {
            this.setState({ restaurants: data })
        }).catch((err) => {
            console.log(err);
        })

        await fetch(ROUTES.PROXY + '/order/showAllOrdersByRider/' + authenticationService.currentUserValue.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json();
        }).then(data => {
            this.setState({ myOrders: data })
        }).catch((err) => {
            console.log(err);
        });

        await fetch(ROUTES.PROXY + '/order/showAllOrders', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json();
        }).then(data => {
            this.setState({ globalOrders: data })
            this.setState({ disabledMatricula: !this.state.rider.license })
        }).catch((err) => {
            console.log(err);
        });

        await fetch(ROUTES.PROXY + '/rider/showRider/'+ authenticationService.currentUserValue.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            
            return response.json();
        }).then(data => {
            this.setState({ rider: data })
        }).catch((err) => {
            console.log(err);
        })
    }

    /* TABLES */
    GlobalOrdersTable = (data) => {
        data.sort((a, b) => {
            let dateA = a.releaseDate.split('T')[0];
            let dateB = b.releaseDate.split('T')[0];

            if (dateA > dateB) {
                return -1;
            }

            if (dateA < dateB) {
                return 1;
            }

            let timeA = a.releaseDate.split('T')[1];
            let timeB = b.releaseDate.split('T')[1];

            if (timeA > timeB) {
                return -1;
            }

            if (timeA < timeB) {
                return 1;
            }
        });
        let auxData = [];
        data.forEach(auxElement => {
            if (auxElement.state == "NEW") {
                auxData.push(auxElement);
            }
        });
        auxData.sort((a, b) => b.releaseDate > a.releaseDate);
        const tableRows = auxData.map(
            (element) => {
                return (
                    <tr>
                        <td data-label="Restaurante">{(this.findArrayElementById(this.state.restaurants, Number(element.restaurantID))).name}</td>
                        <td data-label="Fecha">{element.releaseDate.split('T')[0]}</td>
                        <td data-label="Hora">{element.releaseDate.split('T')[1]}</td>
                        <td data-label="Añadir Pedido"><AddCircleIcon onClick={() => this.selectOrder(element)} /></td>
                    </tr>
                )
            }
        )
        return (
            <div>
            <Table striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>RESTAURANTE</th>
                        <th>FECHA PEDIDO</th>
                        <th>HORA PEDIDO</th>
                        <th>AÑADIR A MIS PEDIDOS</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </Table>
            </div>
        );
    }

    findArrayElementById = (array, id) => {
        return array.find((element) => {
            return element.id === id;
        })
    }

    MyOrdersTable = (data) => {
        data.sort((a, b) => {
            let dateA = a.releaseDate.split('T')[0];
            let dateB = b.releaseDate.split('T')[0];

            if (dateA > dateB) {
                return -1;
            }

            if (dateA < dateB) {
                return 1;
            }

            let timeA = a.releaseDate.split('T')[1];
            let timeB = b.releaseDate.split('T')[1];

            if (timeA > timeB) {
                return -1;
            }

            if (timeA < timeB) {
                return 1;
            }
        });
        
        const tableRows = data.map(
            (element) => {
                return (
                    <tr>
                        <td data-label="Restaurante">{(this.findArrayElementById(this.state.restaurants, Number(element.restaurantID))).name}</td>
                        <td data-label="Fecha">{element.releaseDate.split('T')[0]}</td>
                        <td data-label="Hora">{element.releaseDate.split('T')[1]}</td>
                        <td data-label="Estado"><button
                            className="button-custom"
                            onClick={() => this.goToOrder(element)}
                        >
                            {element.state}
                        </button></td>
                    </tr>
                )
            }
        )
        return (
            <div>
            <Table striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>RESTAURANTE</th>
                        <th>FECHA PEDIDO</th>
                        <th>HORA PEDIDO</th>
                        <th>ESTADO</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </Table>
            </div>
        );
    }

    /* EVENTS */
    logout() {
        authenticationService.logout();
        this.props.history.push(ROUTES.LOGIN);
    };

    handleChange = async e => {
        this.setState({
            client: {
                ...this.state.client,
                [e.target.name]: e.target.value
            }
        });
    }

    selectOrder(order) {
        fetch(ROUTES.PROXY + '/order/modifyOrder/' + order.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                state: "ONTHEWAY",
                riderID: authenticationService.currentUserValue.id
            }),
        }).then((response) => {
            return response.json();
        }).then(data => {
            this.setState({ globalOrders: data })
        }).catch((err) => {
            console.log(err);
        });

        if (this.state.myOrders.includes(order) === "false") {
            this.state.myOrders.push(order);
        }

        this.state.value = 3;
        window.location.href = '/rider';
    };

    modifyRider = async () => {
		var mensaje = confirm("¿Desea guardar los cambios?");
		if (mensaje) {
			fetch(ROUTES.PROXY + '/rider/modifyRider/' + this.state.rider.id, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({

					name: this.state.rider.name,
					surname: this.state.rider.surname,
					email: this.state.rider.email,
					nif: this.state.rider.nif,
					password: this.state.rider.pwd,
					vehicleType: this.state.rider.vehicleType,
					license: this.state.rider.license,
					licensePlate: this.state.rider.licensePlate,
					activeAccount: this.state.rider.activeAccount
				})
			}).then((response) => {
				if (response.status == 200) {
					alert("Cambios guardados correctamente");
					this.props.history.push({
						pathname: '/admin',
						value: 1,
					});
				}
				return response.text();
			})
				.then((responseJson) => {
					responseJson = JSON.parse(responseJson);
					document.getElementById("email").textContent = responseJson.errorEmail;
					document.getElementById("name").textContent = responseJson.errorName;
					document.getElementById("surname").textContent = responseJson.errorSurname;
					document.getElementById("license").textContent = responseJson.errorLicensePlate;
					document.getElementById("nif").textContent = responseJson.errorNIF;
				}).catch((err) => {
					console.log(err);
				})
		}
	}

    goToOrder(order) {
        this.props.history.push({
            pathname: '/rider/consultOrder',
            order: order,
        });
    }

    handleTabChange = (event, newValue) => {
        this.setState({ value: newValue })
    };

    handleModifyClick() {
        this.setState({ disabled: !this.state.disabled })
    }

    handleChangeCheckBox = async e => {
		if (e.target.checked) {
			this.setState({ disabledMatricula: false })
			this.setState({
				rider: {
					...this.state.rider,
					[e.target.name]: true
				}
			});
		} else {
			this.setState({ disabledMatricula: true })
			this.setState({
				rider: {
					...this.state.rider,
					[e.target.name]: false
				}
			});
		}
	}

    render() {
        return (
            <div className='cont-gest'>
                <div className='cont-gest-header'>
                    <Box>
                        <Tabs className="menu-tabs"
                            orientation='vertical'
                            value={this.state.value}
                            onChange={this.handleTabChange}
                            aria-label="full width tabs example"
                            TabIndicatorProps={{ sx: { backgroundColor: '#D6C2B5' } }}
                        >
                            <img src={IMAGES.LOGO_FONDO} className="img_logo" alt="" id="foto-tabs" />
                            <Tab label={<span style={{ color: '#D6C2B5' }}>Pedidos</span>} {...a11yProps(2)} />
                            <Tab label={<span style={{ color: '#D6C2B5' }}>Mis Pedidos</span>} {...a11yProps(3)} />
                            <Tab label={<span style={{ color: '#D6C2B5' }}>Perfil</span>} {...a11yProps(4)} />
                            <FontAwesomeIcon icon={faRightFromBracket} font-size={20} color={"#D6C2B5"} onClick={() => this.logout()} />
                        </Tabs>


                    </Box>
                </div>
                <div className='cont-gest-body'>
                    <TabPanel
                        value={this.state.value} index={1}>
                        <h2>TODOS LOS PEDIDOS</h2>
                        {this.GlobalOrdersTable(this.state.globalOrders)}
                    </TabPanel>

                    <TabPanel
                        value={this.state.value} index={2}>
                        <h2>MIS PEDIDOS</h2>
                        {this.MyOrdersTable(this.state.myOrders)}
                    </TabPanel>

                    <TabPanel
                        value={this.state.value} index={3}>
                        <h2>MI PERFIL</h2>
                        <div className="centerInTab-rid">
                            <div className="centerInTab-rid">
                                <div className="columns-rid">
                                    <div className='cardInTab'>

                                        <Tooltip title="No puede contener: [1-9]/*@..." placement="top-start">
                                            <label className="form-control-label px-0">Nombre<span className="text-danger"> *</span></label>
                                        </Tooltip>
                                        <input type="text" name="name" placeholder={this.state.rider.name} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
                                        <label className="text-danger-custom" id="name"></label>

                                        <Tooltip title="No puede contener: [1-9]/*@..." placement="top-start">
                                            <label className="form-control-label px-0">Apellidos<span className="text-danger"> *</span></label>
                                        </Tooltip>
                                        <input className="Fields" type="text" name="surname" placeholder={this.state.rider.surname} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
                                        <label className="text-danger-custom" id="surname"></label>

                                        <label className="form-control-label px-0">Email<span className="text-danger"> *</span></label>
                                        <input className="Fields" type="text" name="email" placeholder={this.state.rider.email} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
                                        <label className="text-danger-custom" id="email"></label>

                                    </div>
                                    <div className='cardInTab'>
                                        <Tooltip title="Debe tener 8 números y 1 letra" placement="top-start">
                                            <label className="form-control-label px-0">NIF<span className="text-danger"> *</span></label>
                                        </Tooltip>
                                        <input className="Fields" type="text" name="nif" placeholder={this.state.rider.nif} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
                                        <label className="text-danger-custom" id="nif"></label>

                                        <Tooltip title="Si conduce un coche, moto o bici" placement="top-start">
                                            <label className="form-control-label px-0">Tipo de vehículo<span className="text-danger"> *</span></label>
                                        </Tooltip>
                                        <input className="Fields" type="text" name="vehicleType" placeholder={this.state.rider.vehicleType} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />

                                        <Tooltip title="Debe tener 4 números y 3 letras" placement="top-start">
                                            <label className="form-control-label px-0">Matrícula<span className="text-danger"> *</span></label>
                                        </Tooltip>
                                        <input className="Fields" type="text" name="licensePlate" placeholder={(this.state.disabled) ? "XXXXXXX" : this.state.rider.licensePlate} disabled={(this.state.disabled || this.state.disabledMatricula) ? "disabled" : ""} required="" onChange={this.handleChange} />
                                        <label className="text-danger-custom" id="license"></label>

                                        <div>
                                            <label className="form-control-label px-0">Carné<span className="text-danger"> *</span></label>
                                            <input className="Fields" type="checkbox" name="license" defaultChecked={this.state.rider.license} disabled={(this.state.disabled) ? "disabled" : ""} required="" onClick={this.handleChangeCheckBox} />
                                        </div>
                                    </div>
                                    <Tooltip title="Editar" placement="top-start">
                                        <FontAwesomeIcon icon={faEdit} font-size={20} color={"#deb619"} onClick={() => this.handleModifyClick()} />
                                    </Tooltip>
                                </div>
                            </div>

                        </div>
                        <div className="centerInTab-rid">
                            <div hidden={this.state.disabled ? true : false}>
                                <label>¿Desea guardar los cambios?</label>
                                <div className="columns-rid">
                                    <input type="submit" value="ACEPTAR" onClick={() => this.modifyRider()} />
                                    <input type="submit" value="CANCELAR" onClick={() => this.handleModifyClick()} />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </div>
            </div>
        )
    }

}

export default RiderPage;