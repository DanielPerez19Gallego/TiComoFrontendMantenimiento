import React, { Component } from 'react';
import { IMAGES, ROUTES } from '../components/constants';
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
  } from "firebase/storage";
import { storage } from "../services/firebase";
import { v4 } from "uuid";  
import Tooltip from '@mui/material/Tooltip';

class AddPlate extends Component {

  	constructor(props) {
	    super(props);
	    this.onClick = this.onClick.bind(this);
 	}
	
	state = {
		form: {
			name: '',
			photo: '',
			description: '',
			cost: '',
			veganFriendly: false,
			restaurantID: '',
			validPassword: true
		},
		restaurant: {},
		disabled: true,
		imageUpload: null,
		imageUrls: [],
		image: null,
	}

	componentDidMount() {
		fetch(ROUTES.PROXY + '/restaurant/showRestaurant/'+window.location.pathname.split("/")[3],{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'},
        }).then((response) => {
			if ([400].indexOf(response.status) !== -1) {
				this.props.history.push(ROUTES.ADMIN);
            }
		    return response.json();
	    }).then(data => {
            this.setState({ restaurant: data })
        }).catch((err)=>{
            console.log(err);
        })
	}

	handleChangeImage=async e=>{
		this.setState({ image: URL.createObjectURL(e.target.files[0]) });
		this.setState({ imageUpload: e.target.files[0] });
	};

	handleChange=async e=>{
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value.toString()
            }
        });
    }
	
	handleChangeCheckBox=async e=>{
		if (e.target.checked) {
			this.setState({
				form:{
					...this.state.form,
					[e.target.name]: true
				}
			});
		  } else {
			this.setState({
				form:{
					...this.state.form,
					[e.target.name]: false
				}
			});
		  }
    }


    onClick(e) {
   		e.preventDefault();
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

	addPlate=async()=>{
		if(this.state.form.validPassword){
		await this.uploadPhoto();
		console.log(this.state.imageUrls);
		fetch(ROUTES.PROXY + '/restaurant/addPlate',{
      		method: 'POST',
      		headers: {
				'Accept': 'application/json',
    			'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: this.state.form.name,
				photo: this.state.imageUrls,
				description: this.state.form.description,
				cost: this.state.form.cost,
				veganFriendly: this.state.form.veganFriendly,
				restaurantID: this.state.restaurant.id.toString()
			})
        }).then((response) => {
			if(response.status==200){
				alert("Plato registrado correctamente");
                this.props.history.push('/admin/consultRestaurant/'+this.state.restaurant.id);
			}else{
				deleteObject(ref(storage, this.state.imageUrls));
			}
			return response.text();
		})
		 .then((responseJson) => {
			responseJson = JSON.parse(responseJson);
			document.getElementById("name").textContent = responseJson.errorName;
			document.getElementById("cost").textContent = responseJson.errorCost;
			document.getElementById("image").textContent = responseJson.errorImage;
   		}).catch((err)=>{
			console.log(err);
		})
	}}
	
	back = () => {
		window.location.href = '/admin/consultRestaurant/'+this.state.restaurant.id;
	}

	render() {
		return (
			<div class="center">
				<img src={IMAGES.LOGO} className="logo" width="150" height="80" alt=""/> 
				<div class="center">
					<div class="center">
						<div>
							<div class="card">
								<h5 class="text-center mb-4">AÑADIR PLATO</h5>
								
								<label class="form-control-label px-0">Restaurante<span class="text-danger"> *</span></label>
								<input type="text" name="restaurant" placeholder={this.state.restaurant.name} disabled = {(this.state.disabled)? "disabled" : ""} required="" onChange={this.handleChange}/>
								
								<Tooltip title="No puede haber otro plato con el mismo nombre" placement="left-start">
								<label class="form-control-label px-0">Nombre<span class="text-danger"> *</span></label>
								</Tooltip>
								<input type="text" name="name" placeholder="Nombre" required="" onChange={this.handleChange}/>
								<label class="text-danger" id="name"></label>
								
								<label class="form-control-label px-0">Descripción<span class="text-danger"> *</span></label>
								<input type="text" name="description"  placeholder="Descripción" required="" onChange={this.handleChange}/>
								
								<Tooltip title="En €. Tiene que ser un número" placement="left-start">
								<label class="form-control-label px-0">Coste<span class="text-danger"> *</span></label>
								</Tooltip>
								<input type="text" name="cost" placeholder="Coste" required="" onChange={this.handleChange}/>
								<label class="text-danger" id="cost"></label>
								
									<div>
										<label class="form-control-label px-0">Vegano<span class="text-danger"> *</span></label>
							  			<input type="checkbox" name="veganFriendly" defaultChecked={false} required="" onClick={this.handleChangeCheckBox}/>
									</div>
								
								<label class="form-control-label px-0">Suba una imagen del plato<span class="text-danger"> *</span></label>
								<div>
          							<input
           	 							type="file"
            							onChange={this.handleChangeImage}
            							accept="image/*"
          							/>
        							<img src={this.state.image} width="350" height="290" alt=""/>
       							</div>
								
								<div class = "columns">
									<input type="submit" value="ACEPTAR" onClick={()=> this.addPlate()}/>
									<input type="submit" value="CANCELAR" onClick={()=> this.back()}/>
								</div>
							</div>
						</div>
					</div>
					<div>

					</div>
				</div>

			</div>

		)
	}
}

export default AddPlate;