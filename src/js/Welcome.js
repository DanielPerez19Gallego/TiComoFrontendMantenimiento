import React, { Component } from 'react';
import { authenticationService } from '../services/authentication-service';
import { IMAGES } from '../components/constants';
import rider from '../imgs/rider.png';
import restaurant from '../imgs/restaurante.png';
import telefono from '../imgs/atencion_telefonica2.png';

class Welcome extends Component {

	logout = async () => {
		authenticationService.logout();
	}


	render() {
		return (
			<div className="center-log">
				<div className="card-log2">
					<div className="botones-home">
						<div class="columns-rid">
							<a href="/" className="buttonWelcome">Iniciar sesión</a>
							<a href="/register" className="buttonWelcome">Registrarse</a>
						</div>
					</div>
					<div className="body-home">
						<div class="contenedorExplicacion" id='nombre-logo'>
						<h1 >TIComo</h1>
						<img src={IMAGES.LOGO_FONDO} className="img_logo" alt="" id="foto-welcome"/>
						</div>

						<h2 class="prueba"> Restaurantes en la puerta de tu casa </h2>
						<div class="contenedorExplicacion" >
							Restaurantes en la puerta de tu casa TIComo es un sistema de gestión de pedidos de comida a domicilio que da servicio al área de Ciudad Real capital. A través de la aplicación, cualquier usuario puede solicitar comida de un gran número de restaurantes. Una vez preparado el pedido, nuestra confiable red de riders se encargarán de hacerte llegar la comida solicitada en tiempo récord.
						</div>

						<div class="cont-trabajos">
							<div class="trabajo">
								<h2>Restaurantes</h2>
								<p>Aumenta las ventas de tu restaurante.</p>
								<img class="imagenLoco" src={restaurant} />
							</div>
							<div class="trabajo">
								<h2>Riders</h2>
								<p>Formar parte de nuestra red de Riders.</p>
								<img class="imagenLoco" src={rider} />
							</div>
							<div class="trabajo">
								<h2>Operadores</h2>
								<p>Únete al equipo de atención telefónica.</p>
								<img class="imagenLoco" src={telefono} />
							</div>
						</div>

					</div>
				</div>
			</div>
		);
	}
}

export default Welcome;