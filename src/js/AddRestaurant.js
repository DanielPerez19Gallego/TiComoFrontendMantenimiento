import React, { Component } from 'react';
import '../css/StylePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IMAGES, ROUTES } from '../components/constants';
import Tooltip from '@mui/material/Tooltip';

class AddRestaurant extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	state = {
		form: {
			name: '',
			email: '',
			cif: '',
			address: '',
			phone: '',
			category: '',
			commercialRegister: ''
		}
	}

	/* METHODS */
	addRestaurant = async () => {
		fetch(ROUTES.PROXY + '/restaurant/addRestaurant', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: this.state.form.name,
				email: this.state.form.email,
				cif: this.state.form.cif,
				address: this.state.form.address,
				phone: this.state.form.phone,
				category: this.state.form.category,
				commercialRegister: this.state.form.commercialRegister
			})
		}).then((response) => {
			if (response.status == 200) {
				alert("Restaurante registrado correctamente");
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
				document.getElementById("phone").textContent = responseJson.errorPhone;
				document.getElementById("cif").textContent = responseJson.errorCIF;
			}).catch((err) => {
				console.log(err);
			})
	}

	/* EVENTS */
	back = () => {
		this.props.history.push({
			pathname: '/admin',
			value: 4,
		});
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

	render() {
		return (
			<div className="center-log">
				<div className="card-log">
					<img src={IMAGES.LOGO} className="centerImage img_logo" alt="" />

					<h5 class="text-center mb-4">AÑADIR RESTAURANTE</h5>

					<label class="form-control-label px-0">Nombre<span class="text-danger"> *</span></label>
					<input type="text" name="name" placeholder="Nombre" required="" onChange={this.handleChange} />

					<label class="form-control-label px-0">Email<span class="text-danger"> *</span></label>
					<input type="text" name="email" placeholder="Example@mail.com" required="" onChange={this.handleChange} />

					<Tooltip title="Debe tener 8 números y 1 letra" placement="left-start">
						<label class="form-control-label px-0">CIF<span class="text-danger"> *</span></label>
					</Tooltip>
					<input type="text" name="cif" placeholder="000000000X" required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="cif"></label>

					<label class="form-control-label px-0">Dirección<span class="text-danger"> *</span></label>
					<input type="text" name="address" placeholder="C/" required="" onChange={this.handleChange} />

					<Tooltip title="Debe tener 9 números y existir en España" placement="left-start">
						<label class="form-control-label px-0">Teléfono<span class="text-danger"> *</span></label>
					</Tooltip>
					<input type="text" name="phone" placeholder="666666666" required="" onChange={this.handleChange} />
					<label class="text-danger-custom" id="phone"></label>

					<label class="form-control-label px-0">Categoría<span class="text-danger"> *</span></label>
					<input type="text" name="category" placeholder="Mexicano" required="" onChange={this.handleChange} />

					<label class="form-control-label px-0">Registro Mercantil<span class="text-danger"> *</span></label>
					<input type="text" name="commercialRegister" placeholder="Nombre SL" required="" onChange={this.handleChange} />

					<div class="columns-rid">
						<input type="submit" value="ACEPTAR" onClick={() => this.addRestaurant()} />
						<input type="submit" value="CANCELAR" onClick={() => this.back()} />
					</div>
				</div>
			</div>
		)
	}
}

export default AddRestaurant;

