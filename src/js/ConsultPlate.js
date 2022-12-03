import React, { Component } from 'react';
import '../css/StylePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { IMAGES } from '../components/constants';
import Tooltip from '@mui/material/Tooltip';

import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
  } from "firebase/storage";
import { storage } from "../services/firebase";
import { v4 } from "uuid";
import { ROUTES } from '../components/constants';


class ConsultPlate extends Component {

  	constructor(props) {
	    super(props);
	    this.onClick = this.onClick.bind(this);
 	}
	state = {
			plate: [],
			disabled: true,
			restaurant: {},
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
        await fetch(ROUTES.PROXY + '/restaurant/showPlate/'+window.location.href.substring(window.location.href.lastIndexOf('/')+1),{
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

		await fetch(ROUTES.PROXY + '/restaurant/showRestaurant/'+window.location.pathname.split("/")[3],{
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

	deletePlate=async()=>{
		var mensaje = confirm("¿Desea eliminar este Plato?");
		if(mensaje){
			console.log(this.state.plate.id),
			fetch(ROUTES.PROXY + '/restaurant/deletePlate/'+this.state.plate.id,{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'},
			}).then((response) => {
				if(response.status==200){
					deleteObject(ref(storage, this.state.plate.photo));
					this.props.history.push('/admin/consultRestaurant/'+this.state.plate.restaurantID);
				}
				return response.text();
			})
			.then((responseJson) => {
				responseJson = JSON.parse(responseJson);
				document.getElementById("errors").textContent = responseJson.error;
			}).catch((err)=>{
				console.log(err);
			})
		}
	}

	uploadPhoto=async() => {
		let fileName = this.state.imageUpload.name.split('.')[0];
		fileName += v4();
		fileName += '.';
		fileName += this.state.imageUpload.name.split('.')[1];
		const imageRef = ref(storage, `images/plates/${fileName}`);
		await uploadBytes(imageRef, this.state.imageUpload).then(async (snapshot) => {
		    await getDownloadURL(snapshot.ref).then((url) => {
			this.setState({ imageUrls: url });
			console.log(this.state.imageUrls);
		  });
		});
	}

	modifyPlate=async()=>{
		await this.uploadPhoto();
		var mensaje = confirm("¿Desea guardar los cambios?");
		if(mensaje){
			fetch(ROUTES.PROXY + '/restaurant/modifyPlate/'+this.state.plate.id,{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'},
				body: JSON.stringify({
					name: this.state.plate.name,
					photo: this.state.imageUrls,
					description: this.state.plate.description,
					cost: this.state.plate.cost.toString(),
					veganFriendly: this.state.plate.veganFriendly,
					restaurantID: this.state.plate.restaurantID.toString()
				})
			}).then((response) => {
				if(response.status==200){
					alert("Plato modificado correctamente");
					deleteObject(ref(storage, this.state.plate.photo));
					this.props.history.push('/admin/consultRestaurant/'+this.state.plate.restaurantID);
				}else{
					deleteObject(ref(storage, this.state.imageUrls));
				}
				return response.text();
			})
			.then((responseJson) => {
				responseJson = JSON.parse(responseJson);
				document.getElementById("cost").textContent = responseJson.errorCost;
			}).catch((err)=>{
				console.log(err);
			})
		}
	}
    
    onClick(e) {
    e.preventDefault();
  	}
	
	back = () => {
		window.location.href = '/admin/consultRestaurant/'+this.state.plate.restaurantID;
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
          							<input 
										disabled = {this.state.disabled}
           	 							type="file"
            							onChange={this.handleChangeImage}
            							accept="image/*"
          							/>
        							<img src={this.state.image}width="350" height="290" alt=""/>
       							</div>							
								<div class = "columns">
									<input type="submit" value="MODIFICAR" onClick = {this.handleModifyClik.bind(this)}/>
									<input type="submit" value="ELIMINAR" onClick={()=> this.deletePlate()}/>
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

export default ConsultPlate;