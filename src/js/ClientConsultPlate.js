import React, { Component } from 'react';
import '../css/StylePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import { authenticationService } from '../services/authentication-service';
import { IMAGES, ROUTES } from '../components/constants';


class ClientConsultPlate extends Component {

  	constructor(props) {
	    super(props);
	    this.onClick = this.onClick.bind(this);
 	}
	state = {
		plate: this.props.location.plate,
		disabled: true,
		restaurant: this.props.location.restaurant,
		imageUpload: null,
		imageUrls: [],
		image: null,
	}

	handleModifyClik() {
		this.setState( {disabled: !this.state.disabled} )
	} 

	handleChange=async e=>{
        this.setState({
            plate:{
                ...this.state.plate,
                [e.target.name]: e.target.value
            }
        });
    }

	handleChangeImage=async e=>{
		this.setState({ image: URL.createObjectURL(e.target.files[0]) });
		this.setState({ imageUpload: e.target.files[0] });
	};
	
	handleChangeCheckBox=async e=>{
		console.log(this.state.plate);
		console.log(this.state.plate[e.target.name]);
		if (e.target.checked) {
			this.setState({
				plate:{
					...this.state.plate,
					[e.target.name]: true
				}
			});
		  } else {
			this.setState({
				plate:{
					...this.state.plate,
					[e.target.name]: false
				}
			});
		  }
		console.log(this.state.plate.veganFriendly)
    }

	componentDidMount=async()=>{
        await fetch(ROUTES.PROXY + '/restaurant/showPlate/'+this.state.plate.id,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'},
        }).then((response) => {
			if ([400].indexOf(response.status) !== -1) {
				this.props.history.push(ROUTES.ADMIN);
                authenticationService.logout();    
            }
		    return response.json();
	    }).then(data => {
            this.setState({ plate: data });
			this.setState({ image: this.state.plate.photo});
        }).catch((err)=>{
            console.log(err);
        })

		await fetch(ROUTES.PROXY + '/restaurant/showRestaurant/'+this.state.restaurant.id,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'},
        }).then((response) => {
			if ([400].indexOf(response.status) !== -1) {
				this.props.history.push(ROUTES.ADMIN);
                authenticationService.logout();    
            }
		    return response.json();
	    }).then(data => {
            this.setState({ restaurant: data })
        }).catch((err)=>{
            console.log(err);
        })
	
		console.log(this.state)
	}
    
    onClick(e) {
    	e.preventDefault();
  	}
	
	back = () => {
		this.props.history.push({
			pathname: '/client/consultRestaurant',
			restaurantID: this.state.restaurant.id
		});
	}

	render() {
		return (
			<div class="center">
				<img src={IMAGES.LOGO} className="logo" width="150" height="80" alt=""/> 
				<div class="center">
					<div class="center">
						<div>
							<div class="card">
								<h5 class="text-center mb-4">INFORMACIÓN PLATO</h5>
								
								<label class="form-control-label px-0">Restaurante<span class="text-danger"> *</span></label>
								<input class="Fields" type="text" name="restaurant" placeholder={this.state.restaurant.name} disabled = {true} required="" onChange={this.handleChange}/>

								<Tooltip title="No puede haber otro plato con el mismo nombre" placement="left-start">
								<label class="form-control-label px-0">Nombre<span class="text-danger"> *</span></label>
								</Tooltip>
								<input class="Fields" type="text" name="name" placeholder={this.state.plate.name} disabled = {(this.state.disabled)? "disabled" : ""}required="" onChange={this.handleChange}/>

								<Tooltip title="En €. Tiene que ser un números" placement="left-start">
								<label class="form-control-label px-0">Coste<span class="text-danger"> *</span></label>
								</Tooltip>
								<input class="Fields" type="text" name="cost" placeholder={this.state.plate.cost} disabled = {(this.state.disabled)? "disabled" : ""}required="" onChange={this.handleChange}/>
								<label class="text-danger" id="cost"></label>
								
								<div>
									<label class="form-control-label px-0">Vegano<span class="text-danger"> *</span></label>
							  		<input class="Fields" type="checkbox" name="veganFriendly" defaultChecked={this.state.plate.veganFriendly} disabled = {(this.state.disabled)? "disabled" : ""}required="" onClick={this.handleChangeCheckBox}/>
								</div>
								
								<div>
        							<img src={this.state.image}width="350" height="290" alt=""/>
       							</div>
								<div hidden={this.state.disabled ?  true : false}>
									<label>¿Desea guardar los cambios?</label>
									<div class = "columns">
										<input type="submit" value="ACEPTAR" onClick = {()=> this.modifyPlate()}/>
										<input type="submit" value="CANCELAR" onClick={()=> this.back()}/>
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

export default ClientConsultPlate;