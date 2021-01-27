<!--
/////////////////////////////////////////////////////////////////////////////////////////////////
//                Archivo php de estructura de la vista del usuario Alumno                     //
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
    <title>Página del alumno</title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css?family=Annie+Use+Your+Telescope|Baloo|Nanum+Brush+Script|Pragati+Narrow&display=swap" rel="stylesheet">
	<!--CDN de Bootstrap-->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <!--Iconos FontAwesome-->
    <link rel="stylesheet" href="../fontawesome/css/all.css">
    <!--Mi propia hoja de estilos-->
    <link rel="stylesheet" type="text/css" href="../css/estilos_barra_nav.css">
    <link rel="stylesheet" type="text/css" href="../css/estilos_alumno.css">
    <!--FUENTES-->
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow&family=Roboto+Condensed:ital@0;1&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet">
	<!--Reset de los estilos del navegador
	<link rel="stylesheet" href="../css/nav-reset.css">-->
	<!--CDN de JQuery-->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<!--Código JS-->
	<script src="../js/codigo_AlumnoView.js"></script>
</head>
<body>
    <header>
        <?php
            if (session_status() != PHP_SESSION_ACTIVE)
            {
                session_start();
            }//if
            if (!isset($_SESSION['usuario']) || empty($_SESSION['usuario']))
            {
                session_destroy();
                header("Location: ../login.php");
            }//if
        ?>
        <div id="datos_usuario_conectado" class="container-fluid">
            <div class="row aling-items-center">
                <div id="contenedor_AteneaIcono">
                    <img src="../media/Atenea icono.png" alt="icono de Atenea" id="AteneaIcono">
                </div>
                <p id="saludo">Hola:</p>
                <p id="PF_nombre"></p>
                <input type="hidden" id="alumno_conectado" value="<?php echo $_SESSION['usrID'] ?>">
                <div id="contenedor_logout" class="col align-self-end">
                    <a href="../php/logout.php">Salir</a>
                </div>
            </div>
        </div>
    </header>
    <section id="contenido_alumno">
        <section id="seccion_planes">
        </section>
    </section>
	<!--CDN de los scripts de Bootstrap-->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>
</html>