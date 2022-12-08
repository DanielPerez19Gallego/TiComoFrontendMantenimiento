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
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';

/* FUNCTIONS */
/* Definición del menú */
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

/* CLASS */
class ClientPage extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        restaurants: [], orders: [], client: {}, orders: [], disabled: true,
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

        await fetch(ROUTES.PROXY + '/order/showAllOrdersByClient/' + authenticationService.currentUserValue.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json();
        }).then(data => {
            this.setState({ orders: data });
            console.log(this.state.orders);
        }).catch((err) => {
            console.log(err);
        })

        await fetch(ROUTES.PROXY + '/client/showClient/' + authenticationService.currentUserValue.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json();
        }).then(data => {
            this.setState({ client: data })
        }).catch((err) => {
            console.log(err);
        })
    }

    /* METHODS */
    modifyClient = async () => {
        var mensaje = confirm("¿Desea guardar los cambios?");
        if (mensaje) {
            fetch(ROUTES.PROXY + '/client/modifyClient/' + authenticationService.currentUserValue.id, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.client.name,
                    surname: this.state.client.surname,
                    email: this.state.client.email,
                    nif: this.state.client.nif,
                    address: this.state.client.address,
                    phone: this.state.client.phone,
                    activeAccount: this.state.client.activeAccount
                })
            }).then((response) => {
                if (response.status == 200) {
                    alert("Cambios guardados correctamente");
                    this.handleModifyClick();
                }
                return response.text();
            })
                .then((responseJson) => {
                    responseJson = JSON.parse(responseJson);
                    document.getElementById("email").textContent = responseJson.errorEmail;
                    document.getElementById("name").textContent = responseJson.errorName;
                    document.getElementById("surname").textContent = responseJson.errorSurname;
                    document.getElementById("nif").textContent = responseJson.errorNIF;
                    document.getElementById("phone").textContent = responseJson.errorPhone;
                }).catch((err) => {
                    console.log(err);
                })
        }
    }

    findArrayElementById = (array, id) => {
        return array.find((element) => {
            return element.id === id;
        })
    }

    roundAverage(number) {
        let numberRegexp = new RegExp('\\d\\.(\\d){' + 2 + ',}');
        if (numberRegexp.test(number)) {
            return Number(number.toFixed(2));
        } else {
            return Number(number.toFixed(2)) === 0 ? 0 : number;
        }
    }

    rateColour(rate) {
        if (rate >= 0 && rate < 1) {
            return "#f17a45"
        } else if (rate >= 1 && rate < 2) {
            return "#f19745"
        } else if (rate >= 2 && rate < 3) {
            return "#f1a545"
        } else if (rate >= 3 && rate < 4) {
            return "#f1b345"
        } else {
            return "#f1d045"
        }
    }

    /* TABLES */
    RestaurantsTable = (data) => {
        /* Ordenar por valoraciones de mayor a menor */
        data.sort((a, b) => {
            let dateA = a.averageRate;
            let dateB = b.averageRate;

            if (dateA > dateB) {
                return -1;
            }

            if (dateA < dateB) {
                return 1;
            }
        });
        const tableRows = data.map(
            (element) => {
                return (
                    <tr>
                        <td data-label="Restaurante">
                            <button
                                className="button-custom"
                                onClick={() => this.goToRestaurant(element.id)}
                            >
                                {element.name}
                            </button>
                        </td>
                        <td data-label="Descripción">{element.category}</td>
                        <td data-label="Valoración" className='izq'>
                            {this.roundAverage(element.averageRate)}<FontAwesomeIcon icon={faStar} font-size={20} color={this.rateColour(element.averageRate)} />
                        </td>
                    </tr>
                )
            }
        )
        return (
            <div>
                <Table striped bordered hover variant="light">
                    <thead>
                        <tr>
                            <th>Restaurante</th>
                            <th>Descripción</th>
                            <th>Valoración</th>
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

    OrdersTable = (data) => {
        /* Ordenar por fecha de realización de más a menos nuevo */
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
                console.log(element.restaurantID);
                return (
                    <tr>
                        <td data-label="Restaurante">{(this.findArrayElementById(this.state.restaurants, Number(element.restaurantID))).name}</td>
                        <td data-label="Día">
                            <button
                                className="button-custom"
                                onClick={() => this.goToOrder(element)}
                            >
                                {element.releaseDate.split('T')[0]}
                            </button>
                        </td>
                        <td data-label="Hora">{element.releaseDate.split('T')[1].substring(0, 8)}</td>
                        <td data-label="Estado">{element.state}</td>
                    </tr>
                )
            }
        )
        return (
            <div>
                <Table striped bordered hover variant="light">
                    <thead>
                        <tr>
                            <th>Restaurante</th>
                            <th>Dia</th>
                            <th>Hora</th>
                            <th>Estado</th>
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
    }

    handleTabChange = (event, newValue) => {
        this.props.history.push();
        this.setState({ value: newValue })
    };

    handleChange = async e => {
        this.setState({
            client: {
                ...this.state.client,
                [e.target.name]: e.target.value
            }
        });
    }

    goToRestaurant(restaurantID) {
        this.props.history.push({
            pathname: '/client/consultRestaurant',
            client: this.state.client,
            restaurantID: restaurantID,
        });
    }

    goToOrder(order) {
        this.props.history.push({
            pathname: '/client/consultOrder',
            order: order,
        });
    }

    handleModifyClick() {
        this.setState({ disabled: !this.state.disabled })
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
                            <img src={IMAGES.LOGO_FONDO} className="img_logo" alt="" id="foto-tabs-cli" />
                            <Tab label={<span style={{ color: '#D6C2B5' }}>Restaurantes</span>} {...a11yProps(2)} />
                            <Tab label={<span style={{ color: '#D6C2B5' }}>Pedidos</span>} {...a11yProps(3)} />
                            <Tab label={<span style={{ color: '#D6C2B5' }}>Perfil</span>} {...a11yProps(4)} />
                            <FontAwesomeIcon icon={faRightFromBracket} font-size={20} color={"#D6C2B5"} onClick={() => this.logout()} />
                        </Tabs>
                    </Box>
                </div>
                <div className='cont-gest-body'>
                    <TabPanel value={this.state.value} index={1}>
                        <h2>¿QUÉ QUIERES COMER HOY?</h2>
                        {this.RestaurantsTable(this.state.restaurants)}
                    </TabPanel>

                    <TabPanel value={this.state.value} index={2}>
                        <h2>MIS PEDIDOS</h2>
                        {this.OrdersTable(this.state.orders)}
                    </TabPanel>

                    <TabPanel value={this.state.value} index={3}>
                        <h2>MI PERFIL</h2>
                        <div class="centerInTab-rid">
                            <div class="centerInTab-rid">
                                <div class="columns-rid">
                                    <div class='cardInTab'>
                                        <Tooltip title="No puede contener: [1-9]/*@..." placement="top-start">
                                            <label class="form-control-label px-0">Nombre<span class="text-danger"> *</span></label>
                                        </Tooltip>
                                        <input type="text" name="name" placeholder={this.state.client.name} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
                                        <label class="text-danger-custom" id="name"></label>

                                        <Tooltip title="No puede contener: [1-9]/*@..." placement="bottom">
                                            <label class="form-control-label px-0">Apellidos<span class="text-danger"> *</span></label>
                                        </Tooltip>
                                        <input class="Fields" type="text" name="surname" placeholder={this.state.client.surname} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
                                        <label class="text-danger-custom" id="surname"></label>

                                        <label class="form-control-label px-0">Email<span class="text-danger"> *</span></label>
                                        <input class="Fields" type="text" name="email" placeholder={this.state.client.email} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
                                        <label class="text-danger-custom" id="email"></label>

                                    </div><div class='cardInTab'>
                                        <Tooltip title="Debe tener 8 números y 1 letra" placement="top-start">
                                            <label class="form-control-label px-0">NIF<span class="text-danger"> *</span></label>
                                        </Tooltip>
                                        <input class="Fields" type="text" name="nif" placeholder={this.state.client.nif} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
                                        <label class="text-danger-custom" id="nif"></label>

                                        <label class="form-control-label px-0">Dirección<span class="text-danger"> *</span></label>
                                        <input class="Fields" type="text" name="address" placeholder={this.state.client.address} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />

                                        <Tooltip title="Debe tener 9 números y existir en España" placement="bottom">
                                            <label class="form-control-label px-0">Teléfono<span class="text-danger"> *</span></label>
                                        </Tooltip>
                                        <input class="Fields" type="text" name="phone" placeholder={this.state.client.phone} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
                                        <label class="text-danger-custom" id="phone"></label>
                                    </div>
                                    <Tooltip title="Editar" placement="top-start">
                                        <FontAwesomeIcon icon={faEdit} font-size={20} color={"#deb619"} onClick={() => this.handleModifyClick()} />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="centerInTab-rid">
                            <div hidden={this.state.disabled ? true : false}>
                                <label>¿Desea guardar los cambios?</label>
                                <div class="columns-rid">
                                    <input type="submit" value="ACEPTAR" onClick={() => this.modifyClient()} />
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

export default ClientPage;