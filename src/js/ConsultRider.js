import React, { Component } from 'react';
import { IMAGES, ROUTES } from '../components/constants';
import { Rating } from 'react-simple-star-rating';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
const fillColorArray = [
	"#f17a45",
	"#f19745",
	"#f1a545",
	"#f1b345",
	"#f1d045",
];

class ConsultRider extends Component {

	uploader = React.createRef();
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	state = {
		rider: [],
		disabled: true,
		disabledMatricula: true,
	}

	/* INITIALIZER */
	componentDidMount() {
		fetch(ROUTES.PROXY + '/rider/showRider/' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1), {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then((response) => {
			if ([400].indexOf(response.status) !== -1) {
				this.props.history.push({
					pathname: '/admin',
					value: 2,
				});
			}
			return response.json();
		}).then(data => {
			this.setState({ rider: data })
			this.setState({ disabledMatricula: !this.state.rider.license })
			console.log(this.state)
		}).catch((err) => {
			console.log(err);
		})

	}

	/* METHODS */
	deleteRider = async () => {
		var mensaje = confirm("¿Desea eliminar este Rider?");
		if (mensaje) {
			fetch(ROUTES.PROXY + '/rider/deleteRider/' + this.state.rider.id, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
			}).then((response) => {
				if (response.status == 200) {
					this.props.history.push({
						pathname: '/admin',
						value: 2,
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
						value: 2,
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

	/* EVENTS */
	onClick(e) {
		e.preventDefault();
	}

	back = () => {
		this.props.history.push({
			pathname: '/admin',
			value: 2,
		});
	}

	handleModifyClik() {
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
	handleChangeCheckBoxac = async e => {
		if (e.target.checked) {
			this.setState({
				rider: {
					...this.state.rider,
					[e.target.name]: true
				}
			});
		} else {
			this.setState({
				rider: {
					...this.state.rider,
					[e.target.name]: false
				}
			});
		}
	}

	handleChange = async e => {
		this.setState({
			rider: {
				...this.state.rider,
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
					<h5 class="text-center mb-4">INFORMACIÓN RIDER</h5>
					<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
						<label class="form-control-label px-0">Nombre<span class="text-danger"> *</span></label>
					</Tooltip>
					<input class="Fields" type="text" name="name" placeholder={this.state.rider.name} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="name"></label>

					<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
						<label class="form-control-label px-0">Apellidos<span class="text-danger"> *</span></label>
					</Tooltip>
					<input class="Fields" type="text" name="surname" placeholder={this.state.rider.surname} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="surname"></label>

					<Tooltip title="No puede haber dos usuarios con el mismo email " placement="left-start">
						<label class="form-control-label px-0">Email<span class="text-danger"> *</span></label>
					</Tooltip>
					<input class="Fields" type="text" name="email" placeholder={this.state.rider.email} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="email"></label>

					<Tooltip title="Debe contener 8 números y 1 letra" placement="left-start">
						<label class="form-control-label px-0">NIF<span class="text-danger"> *</span></label>
					</Tooltip>
					<input class="Fields" type="text" name="nif" placeholder={this.state.rider.nif} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="nif"></label>
					<label class="form-control-label px-0">Tipo de vehículo<span class="text-danger"> *</span></label>
					<input class="Fields" type="text" name="vehicleType" placeholder={this.state.rider.vehicleType} disabled={(this.state.disabled) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<Tooltip title="Debe contener 8 números y 1 letra" placement="left-start">
						<label class="form-control-label px-0">Matrícula<span class="text-danger"> *</span></label>
					</Tooltip>
					<input class="Fields" type="text" name="licensePlate" placeholder={this.state.rider.licensePlate} disabled={(this.state.disabled || this.state.disabledMatricula) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="license"></label>
					<div>
						<label class="form-control-label px-0">Cuenta Activada<span class="text-danger"> *</span></label>
						<input class="Fields" type="checkbox" name="activeAccount" defaultChecked={this.state.rider.activeAccount} disabled={(this.state.disabled) ? "disabled" : ""} required="" onClick={this.handleChangeCheckBoxac} />
					</div>
					<div>

						<label class="form-control-label px-0">Carné<span class="text-danger"> *</span></label>
						<input class="Fields" type="checkbox" name="license" defaultChecked={this.state.rider.license} disabled={(this.state.disabled) ? "disabled" : ""} required="" onClick={this.handleChangeCheckBox} />

					</div>
					<Rating
						onClick={this.rateRestaurant}
						initialValue={Math.round(this.state.rider.averageRate)}
						transition
						fillColorArray={fillColorArray}
						readonly={true}

					/>
					<div class="columns.rid">
						<input type="submit" value="MODIFICAR" onClick={this.handleModifyClik.bind(this)} />
						<input type="submit" value="ELIMINAR" onClick={() => this.deleteRider()} />
					</div>
					<div hidden={this.state.disabled ? true : false}>
						<label>¿Desea guardar los cambios?</label>
						<div class="columns-rid">
							<input type="submit" value="ACEPTAR" onClick={() => this.modifyRider()} />
							<input type="submit" value="CANCELAR" onClick={() => this.back()} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ConsultRider;