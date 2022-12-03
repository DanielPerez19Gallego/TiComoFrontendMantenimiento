import React, { Component } from 'react';
import { Rating } from 'react-simple-star-rating';
import { TextField } from "@mui/material";
import { IMAGES, ROUTES } from '../components/constants';


const fillColorArray = [
	"#f17a45",
	"#f19745",
	"#f1a545",
	"#f1b345",
	"#f1d045",
];

class Value extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	state = {
		order: this.props.location.order,
		rateRestaurant: 0,
		rateRider: 0,
		description: "",
		disabled: false,
		orderRate: undefined
	}

	componentDidMount() {
        fetch(ROUTES.PROXY + '/order/showOrderRate/' + this.state.order.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
			if (response.status == 200) {
				this.setState({ disabled: true });
				return response.json();
			}
        }).then(data => {
            this.setState({ orderRate: data })
			this.setState({ description: this.state.orderRate.description });
        }).catch((err) => {
            console.log(err);
        })
    }

	rateRestaurant = (event, newRating) => {
		this.setState({ rateRestaurant: newRating + 1 });
	};

	rateRider = (event, newRating) => {
		this.setState({ rateRider: newRating + 1 });
	};

	valueorder = async () => {

		if(this.state.disabled){
			this.props.history.push("/client");
		}else{
			fetch(ROUTES.PROXY + '/order/rateOrder', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					order: this.state.order,
					rateRestaurant: this.state.rateRestaurant,
					rateRider: this.state.rateRider,
					description: this.state.description
				})
			}).then((response) => {
				if (response.status == 200) {
					alert("Valoración registrada correctamente");
					this.props.history.push({
						pathname: '/client/consultOrder',
						order: this.state.order
					});
				}
				return response.text();
			}).then((responseJson) => {
					responseJson = JSON.parse(responseJson);
			}).catch((err) => {
				console.log(err);
			})
		}
	}

	back = () => {
		this.props.history.push({
			pathname: '/client',
			value: 3
		});
	}

	handleChange = (event) => {
        this.setState({ description: event.target.value });
    };

	onClick(e) {
		e.preventDefault();
	}

	render() {
		return (
			<div class="center">
				<img src={IMAGES.LOGO} className="logo" width="150" height="80" alt="" />
				<div class="center">
					<div class="center">
						<div>
							<div class="card">
								<h5 class="text-center mb-4">VALORAR PEDIDO</h5>
								<label class="form-control-label px-0"> Restaurante </label>
								<Rating
									onClick={this.rateRestaurant}
									initialValue={(this.state.orderRate == undefined)? 0 : this.state.orderRate.rateRestaurant}
									size={50}
									transition
									showTooltip
									fillColorArray={fillColorArray}
									readonly={this.state.disabled}
								/>
								<label class="form-control-label px-0"> Rider </label>
								<Rating
									onClick={this.rateRider}
									initialValue={(this.state.orderRate == undefined)? 0 : this.state.orderRate.rateRider}
									size={50}
									transition
									showTooltip
									fillColorArray={fillColorArray}
									readonly={this.state.disabled}
								/>
								<br></br>
								<TextField
          							id="filled-multiline-static"
          							label="Comentario"
          							multiline
									value={this.state.description}
									onChange={this.handleChange}
          							rows={4}
          							variant="filled"
									disabled={this.state.disabled}
        						/>
								<div class="columns">
									<input type="submit" value="ACEPTAR" onClick={() => this.valueorder()} />
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

export default Value;