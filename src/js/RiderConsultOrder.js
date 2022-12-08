import React, { Component } from 'react';
import { IMAGES, ROUTES } from '../components/constants';
import Table from 'react-bootstrap/Table';
import { authenticationService } from '../services/authentication-service';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from '@fortawesome/free-solid-svg-icons'


class RiderConsultOrder extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        order: this.props.location.order,
        restaurant: {},
        cart: [],
        plates: []
    }

    /* INTIALIZER */
    async componentDidMount() {

        await fetch(ROUTES.PROXY + '/restaurant/showAllPlatesFromRestaurant/' + this.state.order.restaurantID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if ([400].indexOf(response.status) !== -1) {
                this.props.history.push(ROUTES.ADMIN);
            }
            return response.json();
        }).then(data => {
            this.setState({ plates: data });
        }).catch((err) => {
            console.log(err);
        })

        await fetch(ROUTES.PROXY + '/order/showPlatesByOrder/' + this.state.order.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if ([400].indexOf(response.status) !== -1) {
                this.props.history.push(ROUTES.ADMIN);
            }
            return response.json();
        }).then(data => {
            this.setState({ cart: data });
        }).catch((err) => {
            console.log(err);
        })

        await fetch(ROUTES.PROXY + '/restaurant/showRestaurant/' + this.state.order.restaurantID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if ([400].indexOf(response.status) !== -1) {
                this.props.history.push(ROUTES.ADMIN);
            }
            return response.json();
        }).then(data => {
            this.setState({ restaurant: data });
        }).catch((err) => {
            console.log(err);
        })
    }

    markAsDelivered() {
        fetch(ROUTES.PROXY + '/order/modifyOrder/' + this.state.order.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                state: "DELIVERED",
                riderID: authenticationService.currentUserValue.id
            }),
        }).then((response) => {
            return response.json();
        }).then(data => {
            this.setState({ order: data })
        }).catch((err) => {
            console.log(err);
        });

        this.props.history.push({
            pathname: '/rider',
            value: 3,
        });
    }

    /* METHODS */
    findArrayElementById = (array, id) => {
        console.log(array);
        return array.find((element) => {
            return element.id === id;
        })
    }

    /* TABLES */
    CartTable = (data) => {
        console.log(data);
        const tableRows = data.map(
            (element) => {
                console.log(element);
                return (
                    <tr>
                        <td data-label="Nombre">{(this.findArrayElementById(this.state.plates, Number(element.plateID))).name}</td>
                        <td data-label="Cantidad">{element.quantity}</td>
                        <td data-label="Coste">{element.quantity * (this.findArrayElementById(this.state.plates, Number(element.plateID))).cost}€</td>
                    </tr>
                )
            }
        )

        return (
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Coste</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </Table>
        );
    }

    /* EVENTS */
    onClick(e) {
        e.preventDefault();
    }

    back = () => {
        window.location.href = "/admin";
    }

    handleModifyClik() {
        console.log(this.state)
        this.setState({ disabled: !this.state.disabled })
    }

    handleChange = async e => {
        this.setState({
            restaurant: {
                ...this.state.restaurant,
                [e.target.name]: e.target.value
            }
        });
    }

    render() {
        return (
            <div class="center-log">
                
                <div class="card-log">
                    <img src={IMAGES.LOGO} className="logo img_logo" alt="" />
                    <div>
                        <h5 class="text-center mb-4">PEDIDO</h5>
                        <div className="subheading mb-5">
                            {this.CartTable(this.state.cart)}
                        </div>
                        <h5 class="text-center mb-4">PRECIO TOTAL: {this.state.order.price} €</h5>
                    </div>
                    <div class="columns"><input type="submit" value="Entregar" onClick={() => this.markAsDelivered()} /></div>
                    <div class="columnsForIcons">
                        <Tooltip title="Cancelar" placement="top-start">
                            <FontAwesomeIcon icon={faLeftLong} font-size={20} color={"#000000"} onClick={() => this.back()} />
                        </Tooltip>
                    </div>
                </div>
            </div>
        )
    }
}

export default RiderConsultOrder;