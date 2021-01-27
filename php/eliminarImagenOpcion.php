<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //               Archivo php para eliminación de imágenes de opciones de test                  //
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
    //Se recogen los datos que vienen por POST
    $parametros = $_POST['parametros'];

    $path_imagen = $_SERVER['DOCUMENT_ROOT'] . '/Atenea/media/Tests/' . $parametros[0];

    $res = unlink($path_imagen);
    echo $res;
?>
