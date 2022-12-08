import React, { Component } from 'react';
import { IMAGES, ROUTES } from '../components/constants';
import Table from 'react-bootstrap/Table';
import { authenticationService } from '../services/authentication-service';
import easyinvoice from 'easyinvoice';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from '@fortawesome/free-solid-svg-icons'


class TelefonoConsultOrder extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        order: this.props.location.order,
        restaurant: {},
        cart: [],
        plates: [],
        bill: {},
        disabledDelete: false,
    }

    /* INTIALIZER */
    async componentDidMount() {

        if (this.state.order.state == "NEW") {
            this.state.disabledDelete = true;
        }

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

        await this.prepareBild()
    }

    prepareBild = async () => {
        let dict = {};
        dict["logo"] = "https://firebasestorage.googleapis.com/v0/b/ticomo01.appspot.com/o/images%2FLogo.png?alt=media&token=7974bbfb-833b-41a7-90a7-264ab0507559";
        this.state.bill["images"] = dict;
        dict = {};
        dict["currency"] = "EUR";
        this.state.bill["settings"] = dict;
        dict = {};
        dict["company"] = "TIComo";
        dict["address"] = "Paseo de la Universidad, 4";
        dict["zip"] = "13071";
        dict["city"] = "Ciudad Real";
        dict["country"] = "España";
        this.state.bill["sender"] = dict;
        dict = {}
        dict["company"] = "Cliente";
        dict["address"] = authenticationService.currentUserValue.address;
        dict["zip"] = authenticationService.currentUserValue.name + ' ' + authenticationService.currentUserValue.surname;
        dict["city"] = authenticationService.currentUserValue.NIF;
        dict["country"] = "Ciudad Real, España";
        this.state.bill["client"] = dict;
        dict = {};
        dict["number"] = this.state.order.id;
        dict["date"] = this.state.order.releaseDate.substring(0, 10);
        dict["due-date"] = this.state.order.releaseDate.substring(0, 10);
        this.state.bill["information"] = dict;
        let plates = [];
        for (let i = 0; i < this.state.cart.length; i++) {
            dict = {};
            dict["quantity"] = this.state.cart[i].quantity;
            dict["description"] = this.findArrayElementById(this.state.plates, this.state.cart[i].plateID).name;
            dict["price"] = this.findArrayElementById(this.state.plates, this.state.cart[i].plateID).cost;
            dict["tax-rate"] = 0;
            plates.push(dict);
        }
        this.state.bill["products"] = plates;
        dict = {}
        dict["products"] = "Platos";
        dict["quantity"] = "Cantidad";
        dict["price"] = "Precio";
        dict["invoice"] = "FACTURA";
        dict["number"] = "Pedido";
        dict["date"] = "Día";
        dict["due-date"] = "Día de vencimiento";
        this.state.bill["translate"] = dict;
    }

    deleteOrder = async () => {
        if (this.state.order.state == "NEW") {

            var mensaje = confirm("¿Desea anular este pedido?");
            if (mensaje) {
                console.log(this.state.order.id),
                    fetch(ROUTES.PROXY + '/order/deleteOrder/' + this.state.order.id, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                    }).then((response) => {
                        if (response.status == 200) {
                            this.props.history.push({
                                pathname: '/telefono',
                                client: this.state.client,
                                value: 2
                            });
                        }
                        return response.text();
                    })
                        .then((responseJson) => {
                            responseJson = JSON.parse(responseJson);
                            document.getElementById("errors").textContent = responseJson.error;
                        }).catch((err) => {
                            console.log(err);
                        })
            }
        }
    }

    modifyOrder = async () => {
        this.props.history.push({
            pathname: '/telefono/modifyOrder',
            client: this.state.client,
            restaurantID: this.state.order.restaurantID,
            cartt: this.state.cart,
            order: this.state.order
        });
    }

    /* METHODS */
    findArrayElementById = (array, id) => {
        return array.find((element) => {
            return element.id === id;
        })
    }

    /* TABLES */
    CartTable = (data) => {
        const tableRows = data.map(
            (element) => {
                return (
                    <tr>
                        <td data-label="Nombre">{(this.findArrayElementById(this.state.plates, Number(element.plateID))).name}</td>
                        <td data-label="Cantidad">{element.quantity}</td>
                        <td data-label="Coste">{element.quantity * (this.findArrayElementById(this.state.plates, Number(element.plateID))).cost}</td>
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
        this.props.history.push({
            pathname: '/telefono',
            value: 2
        })
    }

    handleModifyClik() {
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

    goToRate(order) {
        this.props.history.push({
            pathname: '/client/orderRate',
            order: order
        })
    }

    generate = async (data) => {
        const result = await easyinvoice.createInvoice(data);
        easyinvoice.download(this.state.order.releaseDate.split('T')[0] + '-' + authenticationService.currentUserValue.NIF + '.pdf', result.pdf);
    }

    render() {
        return (
            <div className="center-log">
                <div className="card-log">
                    <img src={IMAGES.LOGO} className="centerImage img_logo" alt="" />
                    <div>
                        <h5 class="text-center mb-4">PEDIDO</h5>
                        <div className="subheading mb-5">
                            {this.CartTable(this.state.cart)}
                        </div>
                        <h5 class="text-center mb-4">PRECIO TOTAL: {this.state.order.price} €</h5>
                    </div>
                    <div class="columns-rid"><input type="submit" value="Factura" onClick={() => this.generate(this.state.bill)} /></div>
                    <div class="columns-rid">
                        <div hidden={this.state.disabledDelete ? false : true}>
                            <input type="submit" value="Anular" onClick={() => this.deleteOrder(this.state.order)} />
                        </div>
                        <div hidden={this.state.disabledDelete ? false : true}>
                            <input type="submit" value="Modificar" onClick={() => this.modifyOrder(this.state.order, this.state.cart)} />
                        </div>
                    </div>
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

export default TelefonoConsultOrder;