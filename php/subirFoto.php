<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //            Archivo php para subir archivo de fotografía del usuario al servidor             //
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
    */
    $res = 0;
    $path_fotos_usuarios = $_SERVER['DOCUMENT_ROOT'] . '/Atenea/media/Usuarios/';
    $imagen_temporal = $_FILES['fotoUsuario']['tmp_name'];

    if (!is_dir($path_fotos_usuarios) || !is_uploaded_file($imagen_temporal))
    {
        echo $res;
    }//if

    $aux = explode('.', $_FILES['fotoUsuario']['name']);
    $path_destino = $path_fotos_usuarios . $_POST['nombre'] . '.' . $aux[1];

    if (!move_uploaded_file($imagen_temporal, $path_destino))
    {
        echo $res;
    }//if

    $res = 1;
    echo $res;
?>
