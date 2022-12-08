import React, { Component } from 'react';
import '../css/StylePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IMAGES, ROUTES } from '../components/constants';
import Table from 'react-bootstrap/Table';
import easyinvoice from 'easyinvoice';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from '@fortawesome/free-solid-svg-icons'


class AdminConsultOrder extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        order: this.props.location.order,
        restaurant: {},
        cart: [],
        plates: [],
        bill: {}
    }

    /* INTIALIZER */
    async componentDidMount() {

        console.log(this.state.bill);

        await fetch(ROUTES.PROXY + '/restaurant/showAllPlatesFromRestaurant/' + this.state.order.restaurantID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if ([400].indexOf(response.status) !== -1) {
                this.props.history.push('/admin/consultRestaurant/' + this.state.order.restaurantID);
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
                this.props.history.push('/admin/consultRestaurant/' + this.state.order.restaurantID);
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
                this.props.history.push('/admin/consultRestaurant/' + this.state.order.restaurantID);
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
        dict["company"] = "Restaurante";
        dict["address"] = this.state.restaurant.address;
        dict["zip"] = this.state.restaurant.name;
        dict["city"] = this.state.restaurant.commercialRegister;
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

    goToRate(order) {
        this.props.history.push({
            pathname: '/order/rate',
            order: order,
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
        this.props.history.push('/admin/consultRestaurant/' + this.state.order.restaurantID);
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

    generate = async (data) => {
        const result = await easyinvoice.createInvoice(data);
        easyinvoice.download(this.state.order.releaseDate.split('T')[0] + '-' + this.state.restaurant.cif + '.pdf', result.pdf);
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
                    <div className='columns-rid'>
                        <input type="submit" value="Factura" onClick={() => this.generate(this.state.bill)} />
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

export default AdminConsultOrder;