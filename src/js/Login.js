import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { IMAGES, ROUTES, ROLES } from '../components/constants';
import { authenticationService } from '../services/authentication-service';

class Login extends Component {

	constructor(props) {
		super(props);

		// redirect to menu if already logged in
		if (authenticationService.currentUserValue) {
			if (authenticationService.currentUserValue.role == ROLES.ADMIN) {
				this.props.history.push(ROUTES.ADMIN);
			} else if (authenticationService.currentUserValue.role == ROLES.RIDER) {
				this.props.history.push(ROUTES.WELCOME);
			} else {
				this.props.history.push('/client');
			}
		}
	}

	state = {
		form: {
			email: '',
			password: ''
		}
	}

	/* METHODS */
	login = async () => {
		await authenticationService.login(this.state.form.email, this.state.form.password)
			.then(
				user => {
					if (authenticationService.currentUserValue) {
						if (authenticationService.currentUserValue.role == ROLES.ADMIN) {
							this.props.history.push(ROUTES.ADMIN);
						} else if (authenticationService.currentUserValue.role == ROLES.RIDER) {
							this.props.history.push("/rider");
						} else if (authenticationService.currentUserValue.role == ROLES.CLIENT) {
							this.props.history.push("/client");
						} else {
							alert('Inicio de sesion como atencion telefonica');
						}
					}
				},
				error => {
					alert(error);	
					//alert("Email o contraseña no válido");
				}
			);
	}

	/* EVENTS */
	handleChange = async e => {
		this.setState({
			form: {
				...this.state.form,
				[e.target.name]: e.target.value
			}
		});
	}

	render() {
		return (
			<div className="center">
				<div className="center">
					<div className="center">
						<div class="card">
							<img src={IMAGES.LOGO} className="centerImage" width="150" height="80" alt="" />
							<h5 class="text-center mb-4">BIENVENIDO A TICOMO</h5>
							<label class="form-control-label px-0">Email<span class="text-danger"> *</span></label>
							<input class="text" type="text" name="email" placeholder="Correo electrónico*" alt="" onChange={this.handleChange} />
							<label class="form-control-label px-0">Contraseña<span class="text-danger"> *</span></label>
							<input class="text" type="password" name="password" placeholder="Contraseña*" alt="" onChange={this.handleChange} />
							<div class="columns">
								<input type="submit" value="LOGIN" onClick={() => this.login()} />
							</div>
							<label className="anim">
								<Link to="/register"> ¿Aún no estás registrado? </Link>
							</label>

						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Login;