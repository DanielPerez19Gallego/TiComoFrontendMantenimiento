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
				this.props.history.push('/rider');
			} else if (authenticationService.currentUserValue.role == ROLES.CLIENT) {
				this.props.history.push('/client');
			} else {
				this.props.history.push('/telefono');
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
							//alert('Inicio de sesion como atencion telefonica');
							this.props.history.push("/telefono");
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
			<div className="center-log">
				<div className="card-log">
					<img src={IMAGES.LOGO} className="centerImage img_logo" alt="" />
					<h5 className="text-center mb-4">BIENVENIDO A TICOMO</h5>
					<label className="form-control-label px-0">
						Email<span className="text-danger"> *</span>
					</label>
					<input className="text" type="text" name="email" placeholder="Correo electrónico*" alt="" onChange={this.handleChange} />
					<label className="form-control-label px-0">
						Contraseña<span className="text-danger"> *</span>
					</label>
					<input className="text" type="password" name="password" placeholder="Contraseña*" alt="" onChange={this.handleChange} />
					<div className="columns">
						<input type="submit" value="LOGIN" onClick={() => this.login()} />
					</div>
					<label className="anim">
						<Link to="/register"> ¿Aún no estás registrado? </Link>
					</label>

				</div>
			</div>
		)
	}
}

export default Login;