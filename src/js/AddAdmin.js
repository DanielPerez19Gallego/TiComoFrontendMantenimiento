import React, { Component } from 'react';
import '../css/StylePage.css';
import PasswordChecklist from "react-password-checklist"
import 'bootstrap/dist/css/bootstrap.min.css';
import { IMAGES, ROUTES } from '../components/constants';
import Tooltip from '@mui/material/Tooltip';

class AddAdmin extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	state = {
		form: {
			name: '',
			surname: '',
			email: '',
			password: '',
			zone: '',
			validPassword: true,
		}
	}

	errors = {
		email: '',
		name: '',
		surname: '',
	}

	/* METHODS */
	addAdmin = async () => {
		if(this.state.form.validPassword){
			fetch(ROUTES.PROXY + '/user/register', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					role: "ADMIN",
					name: this.state.form.name,
					surname: this.state.form.surname,
					email: this.state.form.email,
					password: this.state.form.password,
					zone: this.state.form.zone,
				})
			}).then((response) => {
				if (response.status == 200) {
					alert("Administrador registrado correctamente");
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
				}).catch((err) => {
					console.log(err);
				})
			}
	}

	/* EVENTS HANDLER */
	back = () => {
		this.props.history.push({
			pathname: '/admin',
			value: 2,
		});
	}

	onClick(e) {
		e.preventDefault();
	}

	handleChange = async e => {
		this.setState({
			form: {
				...this.state.form,
				[e.target.name]: e.target.value
			}
		});
	}

	validPassword = () => {
		if(this.state.form.validPassword){
			this.state.form.validPassword = false
		}else{
			this.state.form.validPassword = true
		}
	}

	render() {
		return (
			<div class="center">
				<img src={IMAGES.LOGO} className="logo" width="150" height="80" alt="" />
				<div class="center">
					<div class="center">
						<div>
							<div class="card">
								<h5 class="text-center mb-4">AÑADIR ADMIN</h5>
								
								<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
								<label class="form-control-label px-0">Nombre<span class="text-danger"> *</span></label>
								</Tooltip>
								<input type="text" name="name" placeholder="Nombre" required="" onChange={this.handleChange} />
								<label class="text-danger-custom" id="name"></label>

								<Tooltip title="No puede contener: [1-9]/*@..." placement="left-start">
								<label class="form-control-label px-0">Apellido<span class="text-danger"> *</span></label>
								</Tooltip>
								<input type="text" name="surname" placeholder="Apellido" required="" onChange={this.handleChange} />
								<label class="text-danger-custom" id="surname"></label>

								<label class="form-control-label px-0">Zona<span class="text-danger"> *</span></label>
								<input type="text" name="zone" placeholder="Torreón" required="" onChange={this.handleChange} />

								<label class="form-control-label px-0">Email<span class="text-danger"> *</span></label>
								<input type="text" name="email" placeholder="Example@mail.com" required="" onChange={this.handleChange} />
								<label class="text-danger-custom" id="email"></label>

								<label class="form-control-label px-0">Contraseña<span class="text-danger"> *</span></label>
								<input type="password" name="password" placeholder="******" required="" onChange={this.handleChange} />

								<PasswordChecklist
									rules={["minLength","lowercase","capital","number","specialChar"]}
									minLength={8}
									value={this.state.form.password}
									onChange={this.validPassword}
									messages={{
										minLength: "La contraseña tiene más de 8 caracteres.",
										lowercase: "La contraseña tiene una letra minúscula.",
										capital: "La contraseña tiene una letra mayúscula.",
										number: "La contraseña tiene un número.",
										specialChar: "La contraseña tiene caracteres especiales.",
									}}
									
								/>

								<div class="columns">
									<input type="submit" value="ACEPTAR" onClick={() => this.addAdmin()} />
									<input type="submit" value="CANCELAR" onClick={() => this.back()} />
								
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default AddAdmin;