import React, { Component } from 'react';
import { IMAGES, ROUTES } from '../components/constants';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';

class ConsultClient extends Component {

	uploader = React.createRef();
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	state = {
		client: [],
		disabled: true
	}

	/* INITIALIZER */
	componentDidMount() {
		fetch(ROUTES.PROXY + '/client/showClient/' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1), {
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
			this.setState({ client: data })
			console.log(this.state)
		}).catch((err) => {
			console.log(err);
		})
	}

	/* METHODS */
	deleteClient = async () => {
		var mensaje = confirm("¿Desea eliminar este Cliente?");
		if (mensaje) {
			fetch(ROUTES.PROXY + '/client/deleteClient/' + this.state.client.id, {
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

	modifyClient = async () => {
		var mensaje = confirm("¿Desea guardar los cambios?");
		if (mensaje) {
			fetch(ROUTES.PROXY + '/client/modifyClient/' + this.state.client.id, {
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
					this.props.history.push({
						pathname: '/admin',
						value: 4,
					});
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
		this.setState({ disabled: !this.state.disabled })
	}

	handleChangeCheckBox = async e => {
		if (e.target.checked) {
			this.setState({
				client: {
					...this.state.client,
					[e.target.name]: true
				}
			});
		} else {
			this.setState({
				client: {
					...this.state.client,
					[e.target.name]: false
				}
			});
		}
	}

	handleChange = async e => {
		this.setState({
			client: {
				...this.state.client,
				[e.target.name]: e.target.value
			}
		});
	}

	render() {
		return (
			<div class="center">
				<img src={IMAGES.LOGO} className="logo" width="150" height="80" alt="" />
				<div class="center">
					<div class="center">
						<div>
							<div class="card">
								<h5 class="text-center mb-4">INFORMACIÓN CLIENTE </h5>
								<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
								<label class="form-control-label px-0">Nombre<span class="text-danger"> *</span></label>
								</Tooltip>
								<input class="Fields" type="text" name="name" placeholder={this.state.client.name} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
								<label class="text-danger-custom" id="name"></label>
								<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
								<label class="form-control-label px-0">Apellidos<span class="text-danger"> *</span></label>
								</Tooltip>
								<input class="Fields" type="text" name="surname" placeholder={this.state.client.surname} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
								<label class="text-danger-custom" id="surname"></label>
								<Tooltip title="No puede haber dos usuarios con el mismo email " placement="left-start">
								<label class="form-control-label px-0">Email<span class="text-danger"> *</span></label>
								</Tooltip>
								<input class="Fields" type="text" name="email" placeholder={this.state.client.email} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
								<label class="text-danger-custom" id="email"></label>
								<Tooltip title="Debe contener 8 números y 1 letra" placement="left-start">
								<label class="form-control-label px-0">NIF<span class="text-danger"> *</span></label>
								</Tooltip>
								<input class="Fields" type="text" name="nif" placeholder={this.state.client.nif} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
								<label class="text-danger-custom" id="nif"></label>
								<label class="form-control-label px-0">Dirección<span class="text-danger"> *</span></label>
								<input class="Fields" type="text" name="address" placeholder={this.state.client.address} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
								<Tooltip title="Debe tener 9 números y existir en España" placement="left-start">
								<label class="form-control-label px-0">Teléfono<span class="text-danger"> *</span></label>
								</Tooltip>
								<input class="Fields" type="text" name="phone" placeholder={this.state.client.phone} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
								<label class="text-danger-custom" id="phone"></label>
								<div>
									<label class="form-control-label px-0">Cuenta Activada<span class="text-danger"> *</span></label>
									<input class="Fields" type="checkbox" name="activeAccount" defaultChecked={this.state.client.activeAccount} disabled={(this.state.disabled) ? "disabled" : ""} required="" onClick={this.handleChangeCheckBox} />
								</div>
								<div class="columns">
									<input type="submit" value="MODIFICAR" onClick={this.handleModifyClik.bind(this)} />
									<input type="submit" value="ELIMINAR" onClick={() => this.deleteClient()} />
								</div>
								<div hidden={this.state.disabled ? true : false}>
									<label>¿Desea guardar los cambios?</label>
									<div class="columns">
										<input type="submit" value="ACEPTAR" onClick={() => this.modifyClient()} />
										<input type="submit" value="CANCELAR" onClick={() => this.back()} />
									</div>
								</div>
								<div class="columnsForIcons">
								<Tooltip title="Cancelar" placement="top-start">
                                    <FontAwesomeIcon icon={faLeftLong} font-size={20} color={"#000000"} onClick={() => this.back()} />
                                </Tooltip>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ConsultClient;