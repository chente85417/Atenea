<!--
/////////////////////////////////////////////////////////////////////////////////////////////////
//              Archivo php de estructura del diálogo de gestión de usuarios                   //
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
    <title>Inserción - edición de usuario</title>
    <link href="https://fonts.googleapis.com/css?family=Annie+Use+Your+Telescope|Baloo|Nanum+Brush+Script|Pragati+Narrow&display=swap" rel="stylesheet">
	<!--CDN de Bootstrap-->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	<!--FUENTES-->
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow&family=Roboto+Condensed:ital@0;1&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet">
    <!--Mi propia hoja de estilos-->
	<link rel="stylesheet" type="text/css" href="../css/estilos_formulario_usuario.css">
	<!--Reset de los estilos del navegador
	<link rel="stylesheet" href="../css/nav-reset.css">-->
	<!--CDN de JQuery-->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<!--Código JS-->
	<script src="../js/DlgUsuario.js"></script>
</head>
<body>
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

        require("../Models/conexionbd.php");

        $ID_usuario  = array('s', $_POST['ID_USR']);

        $UsuariosModel = new ConectorBD();
        if ($UsuariosModel->GetRet()['resultado'] == 0)
        {
            //Fallo al crear la conexión con la BD
            die($UsuariosModel->GetRet()['dato']);
        }//if
    
        $Recordset;
        $nombre             = "";
        $apellidos          = "";
        $nombreUsuario      = "";
        $alumno             = false;
        $email              = "";
        $fechaNacimiento    = "";
        $direccion          = "";
        $codigoPostal       = "";
        $telefono           = "";
        $foto               = "No se ha seleccionado ningún archivo...";

        if ($ID_usuario[1] != -1)
        {
            //Se pretende editar los datos de un usario existente
            $Recordset = $UsuariosModel->ObtenerDatosUsuario($ID_usuario)[0];
            if ($Recordset["USR_PERFIL"] == "ALUMNO")
            {
                $alumno = true;
            }//if
            else
            {
                $alumno = false;
            }//else
            $nombre             = $Recordset["USR_NOMBRE"];
            $apellidos          = $Recordset["USR_APELLIDOS"];
            $nombreUsuario      = $Recordset["USR_NOMBRE_USUARIO"];
            $email              = $Recordset["USR_EMAIL"];
            $fechaNacimiento    = $Recordset["USR_FECHA_NACIMIENTO"];
            $direccion          = $Recordset["USR_DIRECCION"];
            $codigoPostal       = $Recordset["USR_CODIGO_POSTAL"];
            $telefono           = $Recordset["USR_TELEFONO"];
            $foto               = $Recordset["USR_FOTO"];
        }//if
        else
        {
            //Se pretende insertar un nuevo usuario
        }//else
        
    ?>
    <section id="FUSR_seccion">
        <form action="" id="FUSR_datos_usuario" class="container-fluid" enctype="multipart/form-data" method="POST">
            <input type="hidden" id="ID_USR" name="ID_USR" value="<?php echo $ID_usuario[1]?>"/>
            <div class="row">
                <!--FOTO-->
                <div id="FUSR_contenedor_foto" class="form-group col-3">
                    <img id="FUSR_imagen_foto_usuario" src= "<?php
                                                                if (($ID_usuario[1] != -1)&&($foto != ""))
                                                                {
                                                                    echo "../media/Usuarios/" . $foto;
                                                                }//if
                                                                else
                                                                {
                                                                    echo "../media/Usuarios/silueta_usuario.png";
                                                                }//else
                                                            ?>" name="imagen_foto_usuario" alt="seleccionar foto">
                    <div id="FUSR_contenedor_selector_foto">
                        <input type="button" value="Seleccionar foto" id="FUSR_boton_seleccionar_foto" class="btn btn-secondary">
                        <input type="button" value="Quitar foto" id="FUSR_boton_quitar_foto" class="btn btn-secondary">
                        <p id="FUSR_label_foto"><?php echo $foto ?></p>
                    </div>
                    <input type="file" name="fotoUsuario" id="FUSR_file_foto_usuario">
                </div>
                <div id="FUSR_contenedor_derecho" class="col-8 container-fluid">
                    <!--NOMBRE DE USUARIO-->
                    <div class="form-group">
                        <label for="DlgUsuario-nombreUsuario" class="col-form-label etiqueta">Nombre de usuario:</label>
                        <input type="text" class="form-control" id="DlgUsuario-nombreUsuario" value="<?php echo $nombreUsuario?>" required>
                    </div>
                    <!--PERFIL-->
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="filtroPerfil" id="perfilAdministrador" value="administrador" <?php if (!$alumno) echo "checked"?>>
                        <label class="form-check-label etiqueta" for="perfilAdministrador">
                            Administrador
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="filtroPerfil" id="perfilAlumno" value="alumno" <?php if ($alumno) echo "checked"?>>
                        <label class="form-check-label etiqueta" for="perfilAlumno">
                            Alumno
                        </label>
                    </div>
                    <!--EMAIL-->
                    <div class="form-group">
                        <label for="DlgUsuario-email" class="col-form-label etiqueta">Email:</label>
                        <input type="email" class="form-control" id="DlgUsuario-email" value="<?php echo $email?>" required>
                    </div>
                </div>
            </div>
            <!--NOMBRE-->
            <div class="form-group">
                <label for="DlgUsuario-nombre" class="col-form-label etiqueta">Nombre:</label>
                <input type="text" class="form-control" id="DlgUsuario-nombre" value="<?php echo $nombre?>" required>
            </div>
            <!--APELLIDOS-->
            <div class="form-group">
                <label for="DlgUsuario-apellidos" class="col-form-label etiqueta">Apellidos:</label>
                <input type="text" class="form-control" id="DlgUsuario-apellidos" value="<?php echo $apellidos?>" required>
            </div>
            <!--DIRECCIÓN-->
            <div class="form-group">
                <label for="DlgUsuario-direccion" class="col-form-label etiqueta">Dirección:</label>
                <input type="text" class="form-control" id="DlgUsuario-direccion" value="<?php echo $direccion?>" required>
            </div>
            <div id="FUSR_contenedor_cp" class="row justify-content-between">
                <!--FECHA DE NACIMIENTO-->
                <div class="form-group col-3">
                    <label for="DlgUsuario-fechaNacimiento" class="col-form-label etiqueta">Fecha de nacimiento:</label>
                    <input type="date" class="form-control" id="DlgUsuario-fechaNacimiento" value="<?php echo $fechaNacimiento?>">
                </div>
                <!--CÓDIGO POSTAL-->
                <div class="form-group col-3">
                    <label for="DlgUsuario-codigoPostal" class="col-form-label etiqueta">Código Postal:</label>
                    <input type="text" class="form-control" id="DlgUsuario-codigoPostal" value="<?php echo $codigoPostal?>">
                </div>
                <!--TELÉFONO-->
                <div class="form-group col-3">
                    <label for="DlgUsuario-telefono" class="col-form-label etiqueta">Teléfono:</label>
                    <input type="tel" class="form-control" id="DlgUsuario-telefono" value="<?php echo $telefono?>">
                </div>      
            </div>
        </form>
        <div id="FUSR_contenedor_botones">
            <button type="button" class="btn btn-dark" id="FUSR_btn_InsertarUsuario">
                <?php
                    if ($ID_usuario[1] == -1)
                    {
                        echo "Insertar";
                    }//if
                    else
                    {
                        echo "Modificar";
                    }//else
                ?>
            </button>
            <button type="button" id="FUSR_btn_Cancelar" class="btn btn-secondary">Cancelar</button>
        </div>

    </section>

	<!--CDN de los scripts de Bootstrap-->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>
</html>