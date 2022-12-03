import React, { Component } from 'react';
import { authenticationService } from '../services/authentication-service';

class Welcome extends Component {

    logout=async()=>{
		authenticationService.logout();
	}


	render() {
		return (
			<div class="center">
				<img src={IMAGES.LOGO} className="logo" width="150" height="80" alt=""/> 
				<div class="center">
					<div class="center">
						<div>
							<div class="card">
								<h5 class="text-center mb-4">PÁGINA EN CONSTRUCCIÓN</h5>
							</div>
						</div>
					</div>
				</div>
			</div>	

		)
	}
}

export default Welcome;