<!--
/////////////////////////////////////////////////////////////////////////////////////////////////
//	                  Archivo php de estructura de la página de login                          //
/////////////////////////////////////////////////////////////////////////////////////////////////
//                   Este archivo forma parte del código del proyecto                          //
//                                                                                             //
//                  ATENEA (ejemplo de plataforma de formación como SPA)                       //
//                                                                                             //
//      desarrollado por Vicente Alejandro Garcerán Blanco como proyecto fin de Máster         //
//                                                                                             //
//         MDI MÁSTER ESPECIALIZADO EN DISEÑO Y DESARROLLO DE APLICACIONES WEB 2019            //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
-->
<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Login ATENEA</title>
	<link rel="shortcut icon" href="./Views/favicon.ico" type="image/x-icon">
	<!--CDN de Bootstrap
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">-->
	<!--Hoja de estilos local-->
	<link rel="stylesheet" type="text/css" href="./css/estilos_login.css">
	<!--Reset de los estilos del navegador-->
	<link rel="stylesheet" href="./css/nav-reset.css">
	<!--CDN de JQuery-->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<!--Código JS-->
	<script src="./js/codigo_login.js"></script>
</head>
<body>
	<?php
			require("./php/datos_conexion.php");
	?>
	<section class="container-fluid">
		<div id="login_formulario">
			<img src="./media/Atenea logo.png" alt="logo de Atenea" id="AteneaLogo">
			<input type="hidden" id="clave_maestra" value="<?php echo $datos_conexion['clave_maestra'] ?>">
			<form  class="row" action="" enctype="multipart/form-data" method="POST">
				<div class="col-12 bloque">
					<h4>Nombre de usuario</h4>
					<input type="text" name="login_nombre_usuario" id="login_nombre_usuario" required>
				</div>
				<div class="col-12 bloque">
					<h4>Contraseña</h4>
					<input type="password" name="login_clave_usuario" id="login_clave_usuario" required>
				</div>
				<div class="col-12 bloque_boton primero">
					<button type="button" class="boton_login" id="login_boton_entrar">Entrar</button>
				</div>
				<div class="col-12 bloque_boton">
					<button type="button" class="boton_login" id="login_boton_reset_pass">He olvidado mi contraseña...</button>
				</div>
			</form>
		</div>
		<div id="reset_clave">
			<div class="col-12 bloque">
				<h4>Escriba la nueva contraseña</h4>
				<input type="password" name="nueva_clave" id="nueva_clave" required>
			</div>
			<div class="col-12 bloque">
				<h4>Reescriba la nueva contraseña</h4>
				<input type="password" name="nueva_clave2" id="nueva_clave2" required>
			</div>
			<div class="col-12 bloque_boton primero">
				<button type="button" class="boton_login" id="btn_reset_clave">Actualizar la clave</button>
			</div>
			<div class="col-12 bloque_boton">
				<button type="button" class="boton_login" id="btn_volver">Volver al login</button>
			</div>
		</div>
	</section>

	<!--CDN de los scripts de Bootstrap-->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>
</html>