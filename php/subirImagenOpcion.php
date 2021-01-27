<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //              Archivo php para subir imágenes de opciones de test al servidor                //
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
    $path_imagenes = $_SERVER['DOCUMENT_ROOT'] . '/Atenea/media/Tests/';
    $imagen_temporal = $_FILES['imagen_card']['tmp_name'];

    if (!is_dir($path_imagenes) || !is_uploaded_file($imagen_temporal))
    {
        echo $res;
    }//if

    //$aux = explode('.', $_FILES['imagen_card']['name']);
    $path_destino = $path_imagenes . $_POST['nombre'];// . '.' . $aux[count($aux) - 1];

    if (!move_uploaded_file($imagen_temporal, $path_destino))
    {
        echo $res;
    }//if

    $res = 1;
    echo $res;
?>
