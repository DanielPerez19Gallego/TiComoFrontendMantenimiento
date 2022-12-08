import React, { Component } from 'react';
import '../css/StylePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ROUTES } from '../components/constants';
import Table from 'react-bootstrap/Table';
import { Link, Redirect } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';

const fillColorArray = [
	"#f17a45",
	"#f19745",
	"#f1a545",
	"#f1b345",
	"#f1d045",
];

class ConsultRestaurant extends Component {
	constructor(props) {
		super(props);
	}
	state = {
		restaurant: {},
		plates: [],
		orders: [],
		disabled: true
	}

	/* INTIALIZER */
	async componentDidMount() {
		await fetch(ROUTES.PROXY + '/restaurant/showRestaurant/' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1), {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then((response) => {
			if ([400].indexOf(response.status) !== -1) {
				this.props.history.push({
					pathname: '/admin',
					value: 4,
				});
			}
			return response.json();
		}).then(data => {
			this.setState({ restaurant: data })
		}).catch((err) => {
			console.log(err);
		})

		await fetch(ROUTES.PROXY + '/restaurant/showAllPlatesFromRestaurant/' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1), {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then((response) => {
			return response.json();
		}).then(data => {
			this.setState({ plates: data })
		}).catch((err) => {
			console.log(err);
		})

		await fetch(ROUTES.PROXY + '/order/showAllOrdersByRestaurant/' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1), {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then((response) => {
			return response.json();
		}).then(data => {
			this.setState({ orders: data })
		}).catch((err) => {
			console.log(err);
		})

		console.log(this.state.restaurant.averageRate);
	}

	/* TABLES */
	PlatesTable = (data) => {
		return (
			<ImageList className='cont-platos-carta' id='imgPlatos'>
				{data.map((element) => (
					<ImageListItem className='plato-carta' key={element.img}>
						<img
							src={`${element.photo}?w=248&fit=crop&auto=format`}
							srcSet={`${element.photo}?w=248&fit=crop&auto=format&dpr=2 2x`}
							alt={element.name}
							loading="lazy"
						/>
						<ImageListItemBar
							title={element.name}
							subtitle={element.cost + '€'}
							actionIcon={
								<IconButton
									sx={{ color: "rgba(255, 255, 255, 0.54)" }}
									aria-label={`info about ${element.title}`}
									onClick={() => this.goToPlate(element)}
								>
									<InfoIcon />
								</IconButton>
							}
						/>
					</ImageListItem>
				))}

			</ImageList>
		)
	}

	OrdersTable = (data) => {
		let counter = 1;
		const tableRows = data.map(
			(element) => {
				console.log(element);
				return (
					<tr>
						<td data-label="Día">
							<button
								className="button-custom-white"
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
			<div style={{}}>
				<Table striped bordered hover variant="dark">
					<thead>
						<tr>
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

	goToOrder(order) {
		this.props.history.push({
			pathname: '/admin/consultOrder',
			order: order,
		});
	}

	goToPlate(plate) {
		this.props.history.push({
			pathname: '/admin/consultRestaurant/' + this.state.restaurant.id + '/consultPlate/' + plate.id,
		});
	}

	/* METHODS */
	deleteRestaurant = async () => {
		var mensaje = confirm("¿Desea eliminar este Restaurante?");
		if (mensaje) {
			fetch(ROUTES.PROXY + '/restaurant/deleteRestaurant/' + this.state.restaurant.id, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
			}).then((response) => {
				if (response.status == 200) {
					this.props.history.push({
						pathname: '/admin',
						value: 4,
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

	modifyRestaurant = async () => {
		var mensaje = confirm("¿Desea guardar los cambios?");
		if (mensaje) {
			fetch(ROUTES.PROXY + '/restaurant/modifyRestaurant/' + this.state.restaurant.id, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: this.state.restaurant.name,
					email: this.state.restaurant.email,
					cif: this.state.restaurant.cif,
					address: this.state.restaurant.address,
					phone: this.state.restaurant.phone,
					category: this.state.restaurant.category,
					commercialRegister: this.state.restaurant.commercialRegister
				})
			}).then((response) => {
				if (response.status == 200) {
					alert("Cambios guardados correctamente");
					this.props.history.push({
						pathname: '/admin',
						value: 4,
					});
				}
				return response.text();
			})
				.then((responseJson) => {
					responseJson = JSON.parse(responseJson);
					document.getElementById("email").textContent = responseJson.errorEmail + "\n";
					document.getElementById("phone").textContent = responseJson.errorPhone;
					document.getElementById("cif").textContent = responseJson.errorCIF;
				}).catch((err) => {
					console.log(err);
				})
		}
	}

	/* EVENTS */
	onClick(e) {
		e.preventDefault();
	}

	back = () => {
		this.props.history.push({
			pathname: '/admin',
			value: 4,
		});
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

			<div className='cont-consult-res'>
				<div className='cont-consult-res_datos'>
					<div class="cardInColumn-cli">
						<div class="columnsForIcons-cli">
							<Tooltip title="Cancelar" placement="top-start">
								<FontAwesomeIcon icon={faLeftLong} font-size={20} color={"#000000"} onClick={() => this.back()} />
							</Tooltip>
						</div>
						<h5 class="text-center mb-4">INFORMACIÓN RESTAURANTE</h5>
						<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
							<label class="form-control-label px-0">Nombre<span class="text-danger"> *</span></label>
						</Tooltip>
						<input class="Fields" type="text" name="name" placeholder={this.state.restaurant.name} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
						<label class="text-danger-custom" id="name"></label>

						<Tooltip title="No puede haber dos restaurantes con el mismo email " placement="left-start">
							<label class="form-control-label px-0">Email<span class="text-danger"> *</span></label>
						</Tooltip>
						<input class="Fields" type="text" name="email" placeholder={this.state.restaurant.email} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
						<label class="text-danger-custom" id="email"></label>

						<Tooltip title="Tiene que tener 8 numeros y 1 letra" placement="left-start">
							<label class="form-control-label px-0">CIF<span class="text-danger"> *</span></label>
						</Tooltip>
						<input class="Fields" type="text" name="cif" placeholder={this.state.restaurant.cif} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
						<label class="text-danger-custom" id="cif"></label>

						<label class="form-control-label px-0">Dirección<span class="text-danger"> *</span></label>
						<input class="Fieldsthis.state.restaurant.averageRate" type="text" name="address" placeholder={this.state.restaurant.address} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />

						<Tooltip title="Debe tener 9 números y existir en España" placement="left-start">
							<label class="form-control-label px-0">Teléfono<span class="text-danger"> *</span></label>
						</Tooltip>
						<input class="Fields" type="text" name="phone" placeholder={this.state.restaurant.phone} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
						<label class="text-danger-custom" id="phone"></label>

						<label class="form-control-label px-0">Categoría<span class="text-danger"> *</span></label>
						<input class="Fields" type="text" name="category" placeholder={this.state.restaurant.category} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />

						<label class="form-control-label px-0">Registro Mercantil<span class="text-danger"> *</span></label>
						<input class="Fields" type="text" name="commercialRegister" placeholder={this.state.restaurant.commercialRegister} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />

						<label class="form-control-label px-0"> Rate </label>
						<Rating
							onClick={this.rateRestaurant}
							initialValue={Math.round(this.state.restaurant.averageRate)}
							transition
							fillColorArray={fillColorArray}
							readonly={true}

						/>
						<div class="columns-rid">
							<input type="submit" value="MODIFICAR" onClick={this.handleModifyClik.bind(this)} />
							<input type="submit" value="ELIMINAR" onClick={() => this.deleteRestaurant()} />
						</div>
						<div hidden={this.state.disabled ? true : false}>
							<label>¿Desea guardar los cambios?</label>
							<div class="columns-rid">
								<input type="submit" value="ACEPTAR" onClick={() => this.modifyRestaurant()} />
								<input type="submit" value="CANCELAR" onClick={() => this.back()} />
							</div>
						</div>
					</div>
				</div>

				<div className='cont-consult-res_carta'>
					<div className='cont-consult-res_platos'>
						<div class="cardInColumn-cli" id="platosCard">
							<h5 class="text-center mb-4">CARTA DEL RESTAURANTE</h5>
							<div className="subheading">
								{this.PlatesTable(this.state.plates)}
							</div>
							<Link to={"/admin/consultRestaurant/" + this.state.restaurant.id + "/addPlate"}>Añadir un nuevo plato a la carta</Link>
						</div>
					</div>

					<div className='cont-consult-res_pedido'>
						<div class="cardInColumn-cli" id="cont-ped-ad">
							<h5 class="text-center mb-4">LISTA DE PEDIDOS</h5>
							<div className="subheading mb-5">
								{this.OrdersTable(this.state.orders)}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ConsultRestaurant;