import React, { Component } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { IMAGES, ROUTES } from '../components/constants';

/*********************************************************************
*
* Class Name: ConsultAdmin.js
* Class description: Dedicated to see  each admin info 
**********************************************************************/

class ConsultAdmin extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	state = {
		admin: [],
		disabled: true
	}

	/* INITIALIZER */
	componentDidMount() {
		fetch(ROUTES.PROXY + '/admin/showAdmin/' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1), {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then((response) => {
			if ([400].indexOf(response.status) !== -1) {
				this.props.history.push({
					pathname: '/admin',
					value: 1,
				});
			}
			return response.json();
		}).then(data => {
			this.setState({ admin: data })
		}).catch((err) => {
			console.log(err);
		})
	}

	/* METHODS */
	deleteAdmin = async () => {
		var mensaje = confirm("¿Desea eliminar este Administrador?");
		if (mensaje) {
			fetch(ROUTES.PROXY + '/admin/deleteAdmin/' + this.state.admin.id, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
			}).then((response) => {
				if (response.status == 200) {
					this.props.history.push({
						pathname: '/admin',
						value: 1,
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

	modifyAdmin = async () => {
		var mensaje = confirm("¿Desea guardar los cambios?");
		if (mensaje) {
			fetch(ROUTES.PROXY + '/admin/modifyAdmin/' + this.state.admin.id, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: this.state.admin.name,
					surname: this.state.admin.surname,
					email: this.state.admin.email,
					password: this.state.admin.pwd,
					zone: this.state.admin.zone
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
					document.getElementById("email").textContent = responseJson.errorEmail + "\n";
					document.getElementById("name").textContent = responseJson.errorName;
					document.getElementById("surname").textContent = responseJson.errorSurname;
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
			value: 1,
		});
	}

	handleModifyClik() {
		this.setState({ disabled: !this.state.disabled })
	}

	handleChange = async e => {
		this.setState({
			admin: {
				...this.state.admin,
				[e.target.name]: e.target.value
			}
		});
	}

	render() {
		return (
			<div className="center-log">
				<div className="card-log">
					<img src={IMAGES.LOGO} className="centerImage img_logo" alt="" />
					
					<div class="columnsForIcons">
						<Tooltip title="Cancelar" placement="top-start">
							<FontAwesomeIcon icon={faLeftLong} font-size={20} color={"#000000"} onClick={() => this.back()} />
						</Tooltip>
					</div>
					<h5 class="text-center mb-4">INFORMACIÓN ADMINISTRADOR</h5>
					<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
						<label class="form-control-label px-0">Nombre<span class="text-danger"> *</span></label>
					</Tooltip>
					<input class="Fields" type="text" name="name" placeholder={this.state.admin.name} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="name"></label>
					<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
						<label class="form-control-label px-0">Apellido<span class="text-danger"> *</span></label>
					</Tooltip>
					<input class="Fields" type="text" name="surname" placeholder={this.state.admin.surname} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="surname"></label>
					<Tooltip title="No puede haber dos usuarios con el mismo email " placement="left-start">
						<label class="form-control-label px-0">Email<span class="text-danger"> *</span></label>
					</Tooltip>
					<input class="Fields" type="text" name="email" placeholder={this.state.admin.email} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="email"></label>
					<label class="form-control-label px-0">Zona<span class="text-danger"> *</span></label>
					<input class="Fields" type="text" name="zone" placeholder={this.state.admin.zone} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<div class="columns-rid">
						<input type="submit" value="MODIFICAR" onClick={this.handleModifyClik.bind(this)} />
						<input type="submit" value="ELIMINAR" onClick={() => this.deleteAdmin()} />
					</div>
					<div hidden={this.state.disabled ? true : false}>
						<label>¿Desea guardar los cambios?</label>
						<div class="columns-rid">
							<input type="submit" value="ACEPTAR" onClick={() => this.modifyAdmin()} />
							<input type="submit" value="CANCELAR" onClick={() => this.back()} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ConsultAdmin;