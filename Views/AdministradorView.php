<!--
/////////////////////////////////////////////////////////////////////////////////////////////////
//             Archivo php de estructura de la vista del usuario Administrador                 //
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
    <title>Página del administrador</title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css?family=Annie+Use+Your+Telescope|Baloo|Nanum+Brush+Script|Pragati+Narrow&display=swap" rel="stylesheet">
	<!--CDN de Bootstrap-->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <!--Iconos FontAwesome-->
    <link rel="stylesheet" href="../fontawesome/css/all.css">
    <!--FUENTES-->
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow&family=Roboto+Condensed:ital@0;1&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet">
    <!--Mi propia hoja de estilos-->
    <link rel="stylesheet" type="text/css" href="../css/estilos_barra_nav.css">
    <link rel="stylesheet" type="text/css" href="../css/estilos.css">
	<!--Reset de los estilos del navegador
	<link rel="stylesheet" href="../css/nav-reset.css">-->
	<!--CDN de JQuery-->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
	<!--Código JS-->
	<script src="../js/codigo_AdministradorView.js"></script>
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
                <p id="ADM_nombre"></p>
                <input type="hidden" id="usuario_conectado" value="<?php echo $_SESSION['usrID'] ?>">
                <div id="contenedor_logout" class="col align-self-end">
                    <a href="../php/logout.php">Salir</a>
                </div>
            </div>
        </div>
        <div id="barra_nav">
            <ul>
                <li class="elemento_menu_principal_seleccionado"><a href="">GESTIÓN DE USUARIOS</a></li>
                <li><a href="">GESTIÓN DE MEDIOS</a></li>
                <li><a href="">TESTS</a></li>
                <li><a href="">BATERÍAS DE TESTS</a></li>
                <li><a href="">PLANES DE FORMACIÓN</a></li>
            </ul>
        </div>
    </header>
    <section id="usuarios_registrados">
        <section id="USR_tabla_seccion_herramientas" class="container-fluid">
            <div class="row">
                <form action="../php/DlgUsuario.php" class="col-2" enctype="multipart/form-data" method="POST">
                    <input type="hidden" id="ID_USR" name="ID_USR" value="-1"/>
                    <button type="submit" id="btn_editar_insertar_usuario" class="btn btn-secondary">Insertar nuevo usuario</button>
                </form>
                <button type="submit" class="btn btn-secondary col-1" id="filtrar">Filtrar</button>
                <div class="col-2">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="filtroPerfil" id="filtroPerfilAdministradores" value="administrador" checked>
                        <label class="form-check-label" for="filtroPerfilAdministradores">
                            Administradores
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="filtroPerfil" id="filtroPerfilAlumnos" value="alumno">
                        <label class="form-check-label" for="filtroPerfilAlumnos">
                            Alumnos
                        </label>
                    </div>
                </div>
            </div>
        </section>
        <section id="seccion_tabla">
            <div id="USR_contenedor_tabla">
                <h3 id="USR_encabezado_tabla">Usuarios Registrados</h3>
                <table id="USR_tabla">
                    <tr id="USR_fila_encabezados">
                        <th class="USR_col_enc" id="USR_col_enc_codigo"></th>
                        <th class="USR_col_enc" id="USR_col_enc_foto">FOTO</th>
                        <th class="USR_col_enc" id="USR_col_enc_nombre">NOMBRE</th>
                        <th class="USR_col_enc" id="USR_col_enc_apellidos">APELLIDOS</th>
                        <th class="USR_col_enc" id="USR_col_enc_usuario">USUARIO</th>
                        <th class="USR_col_enc" id="USR_col_enc_email">EMAIL</th>
                        <th class="USR_col_enc" id="USR_col_enc_fechaAlta">FECHA DE ALTA</th>
                        <th class="USR_col_enc" id="USR_col_enc_direccion">DIRECCIÓN</th>
                        <th class="USR_col_enc" id="USR_col_enc_cp">CÓDIGO POSTAL</th>
                        <th class="USR_col_enc" id="USR_col_enc_telefono">TELÉFONO</th>
                        <th class="USR_col_enc" id="USR_col_enc_fechaNac">FECHA DE NACIMIENTO</th>
                        <th class="USR_col_enc" id="USR_col_enc_fotoArchivo"></th>
                        <th class="USR_col_enc" id="USR_col_enc_btn_editar"></th>
                        <th class="USR_col_enc" id="USR_col_enc_btn_eliminar"></th>
                    </tr>
                </table>
            </div>
        </section>
    </section>
    <section id="medios">
        <div id="barra_nav_medios">
            <ul>
                <li><a href="">TEXTOS</a></li>
                <li><a href="">IMÁGENES</a></li>
                <li><a href="">VÍDEOS</a></li>
                <li><a href="">AUDIOS</a></li>
            </ul>
        </div>
        <section id="textos" class="container-fluid">
            <div id="textos_contenedor_titulos" class="col-12 textos_contenedor_titulos"><h3>Repositorio de textos</h3></div>
            <div class="row textos_contenedor_herramientas">
                <div class="col-6">
                    <button type="button" id="btn_adjuntar_texto" class="btn btn-secondary">Adjuntar texto seleccionado a test en curso</button>
                </div>
                <div id="contenedor_botones" class="col-6">
                    <div class="row">
                        <button type="button" id="btn_insertar_texto" class="btn btn-secondary">Añadir nuevo texto</button>
                        <button type="button" id="btn_cancelar_insertar_texto" class="btn btn-secondary">Cancelar</button>
                    </div>
                </div>
            </div>
            <div id="textos_contenedor_datos" class="row">
                <div class="col-6" id="tabla_textos_contenedor">
                    <table id="tabla_textos">
                        <tr id="tabla_textos_encabezado">
                            <th class="tabla_textos_col_enc" id="tabla_textos_col_enc_codigo"></th>
                            <th class="tabla_textos_col_enc" id="tabla_textos_col_enc_nombre">NOMBRE</th>
                            <th class="tabla_textos_col_enc" id="tabla_textos_col_enc_descripcion">DESCRIPCIÓN</th>
                            <th class="tabla_textos_col_enc" id="tabla_textos_col_enc_btn_editar"></th>
                            <th class="tabla_textos_col_enc" id="tabla_textos_col_enc_btn_eliminar"></th>
                        </tr>
                    </table>
                </div>
                <div id="textos_data_contenedor" class="col-6 container-fluid textos_data_contenedor">
                    <div class="col-12 row container contenedor_interno">
                        <label for="texto_nombre" class="row col-12">Denominación:</label>
                        <input type="text" name="texto_nombre" id="texto_nombre" class="row col-8">
                    </div>
                    <div class="col-12 row container contenedor_interno">
                        <label for="texto_descripcion" class="row col-12">Descripción:</label>
                        <input type="text" name="texto_descripcion" id="texto_descripcion" class="row col-12">
                    </div>
                    <div class="col-12 row container contenedor_interno">
                        <label for="texto_contenido" class="row col-12">Contenido:</label>
                        <textarea name="texto_contenido" id="texto_contenido" class="row col-12" cols="30" rows="10"></textarea>
                    </div>
                </div>
            </div>
        </section>
        <section id="imagenes" class="container-fluid">
            <div id="imagenes_contenedor_titulos" class="col-12 imagenes_contenedor_titulos"><h3>Repositorio de imágenes</h3></div>
            <div class="row imagenes_contenedor_herramientas">
                <div id="contenedor_botones" class="col-6 justify-content-between">
                    <button type="button" id="btn_insertar_imagen" class="btn btn-secondary">Añadir nueva imagen</button>
                </div>
                <div class="col-6">
                    <button type="button" id="btn_adjuntar_imagen" class="btn btn-secondary">Adjuntar imagen seleccionada a test en curso</button>
                </div>
            </div>
            <div id="contenedor_cartas_imagenes" class="container-fluid">
            </div>
        </section>
        <section id="videos" class="container-fluid">
            <div id="videos_contenedor_titulos" class="col-12 videos_contenedor_titulos"><h3>Repositorio de vídeos</h3></div>
            <div class="row videos_contenedor_herramientas">
                <div id="contenedor_botones" class="col-6 justify-content-between">
                    <button type="button" id="btn_insertar_video" class="btn btn-secondary">Añadir nuevo vídeo</button>
                </div>
                <div class="col-6">
                    <button type="button" id="btn_adjuntar_video" class="btn btn-secondary">Adjuntar vídeo seleccionado a test en curso</button>
                </div>
            </div>
            <div id="contenedor_cartas_videos" class="container-fluid">
            </div>
        </section>
        <section id="audios" class="container-fluid">
            <div id="audios_contenedor_titulos" class="col-12 audios_contenedor_titulos"><h3>Repositorio de audios</h3></div>
            <div class="row audios_contenedor_herramientas">
                <div id="contenedor_botones" class="col-6 justify-content-between">
                    <button type="button" id="btn_insertar_audio" class="btn btn-secondary">Añadir nuevo audio</button>
                </div>
                <div class="col-6">
                    <button type="button" id="btn_adjuntar_audio" class="btn btn-secondary">Adjuntar audio seleccionado a test en curso</button>
                </div>
            </div>
            <div id="tabla_audios_contenedor" class="row">
                <table id="tabla_audios">
                    <tr id="tabla_audios_encabezado">
                        <th class="tabla_audios_col_enc" id="tabla_audios_col_enc_codigo"></th>
                        <th class="tabla_audios_col_enc" id="tabla_audios_col_enc_nombre">NOMBRE</th>
                        <th class="tabla_audios_col_enc" id="tabla_audios_col_enc_descripcion">DESCRIPCIÓN</th>
                        <th class="tabla_audios_col_enc" id="tabla_audios_col_enc_player">REPRODUCTOR</th>
                        <th class="tabla_audios_col_enc" id="tabla_audios_col_enc_selector"></th>
                        <th class="tabla_audios_col_enc" id="tabla_audios_col_enc_btn_izdo"></th>
                        <th class="tabla_audios_col_enc" id="tabla_audios_col_enc_btn_dcho"></th>
                    </tr>
                </table>
            </div>
        </section>
    </section>
    <section id="tests" class="container-fluid">
        <div id="tests_contenedor_titulos" class="col-12 tests_contenedor_titulos"><h3>Repositorio de Tests</h3></div>
        <div id="contenedor_tests" class="row">
            <aside id="contenedor_tabla_tests" class="col-4">
                <div class="row tests_contenedor_herramientas">
                    <button type="button" id="btn_nuevo_test" class="col-3 btn btn-secondary">Nuevo Test</button>
                    <button type="button" id="btn_cancelar_test" class="col-2 btn btn-secondary">Cancelar</button>
                </div>
                <table id="tabla_tests">
                    <tr id="tabla_tests_encabezado">
                        <th class="tabla_tests_col_enc" id="tabla_tests_col_enc_codigo"></th>
                        <th class="tabla_tests_col_enc" id="tabla_tests_col_enc_nombre">NOMBRE</th>
                        <th class="tabla_tests_col_enc" id="tabla_tests_col_enc_btn_editar"></th>
                        <th class="tabla_tests_col_enc" id="tabla_tests_col_enc_btn_eliminar"></th>
                    </tr>
                </table>
            </aside>
            <div id="contenedor_test" class="col-8">
                <div id="contenedor_editables">
                    <div id="contenedor_denominacion" class="contenedor_editable">
                        <label for="denominacion">Denominación:</label>
                        <input type="text" name="denominacion" id="test_denominacion">
                    </div>
                    <div id="contenedor_descripcion" class="contenedor_editable">
                        <label for="descripcion">Descripción:</label>
                        <input type="text" name="descripcion" id="test_descripcion">
                    </div>
                </div>
                <div id="contenedor_encabezado" class="container">
                    <div id="encabezado_header" class="row justify-content-between">
                        <h3 class="col-9">ENCABEZADO DEL TEST</h3>
                        <button type="button" id="btn_insertar_elemento" class="col-2 btn btn-secondary">+ Elemento</button>
                    </div>
                    <textarea name="texto_test" id="texto_test" class="row col-12" rows="1"></textarea>
                </div>
                <div id="contenedor_opciones" class="container-fluid">
                    <div class="container row contenedor_opcion">
                        <div class="contenedor_radio_opcion">
                            <input type="radio" id="opcion1" name="opciones_test" value="1">
                        </div>
                        <div class="contenedor_imagen_opcion col-2">
                            <div class="mini_barra_herramientas_opcion" id="mini_barra_herramientas_opcion">
                                <i id="btn_editar_opcion1" class="fas fa-pen btn_mini_barra_opcion opcion_editar"></i>
                                <i id="btn_eliminar_opcion1" class="fas fa-trash-alt btn_mini_barra_opcion opcion_eliminar"></i>
                            </div>
                            <input type="hidden" id="imagen_opcion1_codigo" name="imagen_opcion1_codigo" value="-1"/>
                            <img src="" id="imagen_opcion1" class="imagenes_opciones" alt="">
                        </div>
                        <label for="opcion1" class="contenedor_label_opcion col-8">
                            <textarea name="opcion1" id="test_opcion1" rows="1"></textarea>
                        </label><br>
                    </div>
                    <div class="container row contenedor_opcion">
                        <div class="contenedor_radio_opcion">
                            <input type="radio" id="opcion2" name="opciones_test" value="2">
                        </div>
                        <div class="contenedor_imagen_opcion col-2">
                            <div class="mini_barra_herramientas_opcion" id="mini_barra_herramientas_opcion">
                            <i id="btn_editar_opcion2" class="fas fa-pen btn_mini_barra_opcion opcion_editar"></i>
                                <i id="btn_eliminar_opcion2" class="fas fa-trash-alt btn_mini_barra_opcion opcion_eliminar"></i>
                            </div>
                            <input type="hidden" id="imagen_opcion2_codigo" name="imagen_opcion2_codigo" value="-1"/>
                            <img src="" id="imagen_opcion2" class="imagenes_opciones" alt="">
                        </div>
                        <label for="opcion2" class="contenedor_label_opcion col-8">
                            <textarea name="opcion2" id="test_opcion2" rows="1"></textarea>
                        </label><br>
                    </div>
                    <div class="container row contenedor_opcion">
                        <div class="contenedor_radio_opcion">
                            <input type="radio" id="opcion3" name="opciones_test" value="3">
                        </div>
                        <div class="contenedor_imagen_opcion col-2">
                            <div class="mini_barra_herramientas_opcion" id="mini_barra_herramientas_opcion">
                            <i id="btn_editar_opcion3" class="fas fa-pen btn_mini_barra_opcion opcion_editar"></i>
                                <i id="btn_eliminar_opcion3" class="fas fa-trash-alt btn_mini_barra_opcion opcion_eliminar"></i>
                            </div>
                            <input type="hidden" id="imagen_opcion3_codigo" name="imagen_opcion3_codigo" value="-1"/>
                            <img src="" id="imagen_opcion3" class="imagenes_opciones" alt="">
                        </div>
                        <label for="opcion3" class="contenedor_label_opcion col-8">
                            <textarea name="opcion3" id="test_opcion3" rows="1"></textarea>
                        </label><br>
                    </div>
                    <div class="container row contenedor_opcion">
                        <div class="contenedor_radio_opcion">
                            <input type="radio" id="opcion4" name="opciones_test" value="4">
                        </div>
                        <div class="contenedor_imagen_opcion col-2">
                            <div class="mini_barra_herramientas_opcion" id="mini_barra_herramientas_opcion">
                            <i id="btn_editar_opcion4" class="fas fa-pen btn_mini_barra_opcion opcion_editar"></i>
                                <i id="btn_eliminar_opcion4" class="fas fa-trash-alt btn_mini_barra_opcion opcion_eliminar"></i>
                            </div>
                            <input type="hidden" id="imagen_opcion4_codigo" name="imagen_opcion4_codigo" value="-1"/>
                            <img src="" id="imagen_opcion4" class="imagenes_opciones" alt="">
                        </div>
                        <label for="opcion1" class="contenedor_label_opcion col-8">
                            <textarea name="opcion4" id="test_opcion4" rows="1"></textarea>
                        </label><br>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="baterias" class="container-fluid">
        <div id="baterias_contenedor_titulos" class="col-12 baterias_contenedor_titulos"><h3>Repositorio de Baterías de Tests</h3></div>
        <div id="baterias_contenedor_herramientas" class="row">
            <button type="button" id="btn_nueva_bateria_test" class="col-2 btn btn-secondary">Nueva Batería de Tests</button>
            <button type="button" id="btn_cancelar_bateria_test" class="col-1 btn btn-secondary">Cancelar</button>
        </div>
        <div id="contenedor_baterias" class="row">
        </div>
    </section>
    <section id="planes" class="container-fluid">
        <div id="planes_contenedor_titulos" class="col-12 planes_contenedor_titulos"><h3>Repositorio de asignaciones</h3></div>
        <div id="planes_contenedor_herramientas" class="row">
            <button type="button" id="btn_editar_asignaciones" class="col-2 btn btn-secondary">Actualizar asignaciones</button>
            <button type="button" id="btn_cancelar_asignaciones" class="col-1 btn btn-secondary">Cancelar</button>
        </div>
        <div id="contenedor_planes" class="row">
        </div>
    </section>
	<!--CDN de los scripts de Bootstrap-->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>
</html>