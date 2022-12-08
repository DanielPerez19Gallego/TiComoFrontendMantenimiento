import React, { Component } from 'react';
import '../css/StylePage.css';
import PasswordChecklist from "react-password-checklist"
import 'bootstrap/dist/css/bootstrap.min.css';
import { IMAGES, ROUTES } from '../components/constants';
import Tooltip from '@mui/material/Tooltip';

class AddRider extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	state = {
		form: {
			role: 'RIDER',
			name: '',
			surname: '',
			email: '',
			password: '',
			NIF: '',
			license: true,
			licensePlate: '',
			vehicleType: '',
			validPassword: true,
		}
	}

	/* METHODS */
	addRider = async () => {
		if (this.state.form.validPassword) {
			fetch(ROUTES.PROXY + '/user/register', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					role: 'RIDER',
					name: this.state.form.name,
					surname: this.state.form.surname,
					email: this.state.form.email,
					password: this.state.form.password,
					nif: this.state.form.nif,
					license: this.state.form.license,
					licensePlate: this.state.form.licensePlate,
					vehicleType: this.state.form.vehicleType,
				})
			}).then((response) => {
				if (response.status == 200) {
					alert("Rider registrado correctamente");
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
					document.getElementById("password").textContent = responseJson.errorPwd;
				}).catch((err) => {
					console.log(err);
				})
		}
	}

	/* EVENTS */
	back = () => {
		this.props.history.push({
			pathname: '/admin',
			value: 2,
		});
	}

	handleChangeCheckBox = async e => {
		if (e.target.checked) {
			this.setState({ disabledMatricula: false })
			this.setState({
				form: {
					...this.state.form,
					[e.target.name]: true
				}
			});
		} else {
			this.setState({ disabledMatricula: true })
			this.setState({
				form: {
					...this.state.form,
					[e.target.name]: false
				}
			});
		}
	}

	handleChange = async e => {
		this.setState({
			form: {
				...this.state.form,
				[e.target.name]: e.target.value
			}
		});
	}

	onClick(e) {
		e.preventDefault();
	}

	validPassword = () => {
		if (this.state.form.validPassword) {
			this.state.form.validPassword = false
		} else {
			this.state.form.validPassword = true
		}
	}

	render() {
		return (
			<div className="center-log">
				<div className="card-log">
					<img src={IMAGES.LOGO} className="centerImage img_logo" alt="" />
					<h5 class="text-center mb-4">AÑADIR RIDER</h5>

					<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
						<label class="form-control-label px-0">Nombre<span class="text-danger"> *</span></label>
					</Tooltip>
					<input type="text" name="name" placeholder="Nombre" required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="name"></label>

					<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
						<label class="form-control-label px-0">Apellidos<span class="text-danger"> *</span></label>
					</Tooltip>
					<input type="text" name="surname" placeholder="Apellidos" required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="surname"></label>

					<Tooltip title="Debe contener 8 números y 1 letra" placement="left-start">
						<label class="form-control-label px-0">NIF<span class="text-danger"> *</span></label>
					</Tooltip>
					<input type="text" name="nif" placeholder="00000000X" required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="nif"></label>

					<label class="form-control-label px-0">Email<span class="text-danger"> *</span></label>
					<input type="text" name="email" placeholder="Example@mail.com" required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="email"></label>

					<label class="form-control-label px-0">Contraseña<span class="text-danger"> *</span></label>
					<input type="password" name="password" placeholder="*****" required="" onChange={this.handleChange} />

					<PasswordChecklist
						rules={["minLength", "lowercase", "capital", "number", "specialChar"]}
						minLength={8}
						value={this.state.form.password}
						valueAgain={this.state.form.passwordAgain}
						onChange={this.validPassword}
						messages={{
							minLength: "La contraseña tiene más de 8 caracteres.",
							lowercase: "La contraseña tiene una letra minúscula.",
							capital: "La contraseña tiene una letra mayúscula.",
							number: "La contraseña tiene un número.",
							specialChar: "La contraseña tiene caracteres especiales.",
						}}

					/>
					<h6 class="text-center mb-4"></h6>
					<h6 class="text-center mb-4">VEHÍCULO</h6>

					<Tooltip title="Debe contener 4 números y 3 letras" placement="left-start">
						<label class="form-control-label px-0">Matrícula<span class="text-danger"> *</span></label>
					</Tooltip>
					<input type="text" name="licensePlate" placeholder="0000XXX" disabled={(this.state.disabledMatricula) ? "disabled" : ""} required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="license"></label>

					<Tooltip title="Si es un coche, moto o bicicleta" placement="left-start">
						<label class="form-control-label px-0">Tipo de vehículo<span class="text-danger"> *</span></label>
					</Tooltip>
					<input type="text" name="vehicleType" placeholder="Coche/Moto/Bici" onChange={this.handleChange} />

					<div>
						<label class="form-control-label px-0">Carné<span class="text-danger"> *</span></label>
						<input type="checkbox" name="license" defaultChecked={true} required="" onClick={this.handleChangeCheckBox} />
					</div>

					<div class="columns-rid">
						<input type="submit" value="ACEPTAR" onClick={() => this.addRider()} />
						<input type="submit" value="CANCELAR" onClick={() => this.back()} />
					</div>
				</div>
			</div>
		)
	}
}

export default AddRider;
