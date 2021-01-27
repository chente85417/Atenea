<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //                  Archivo php para subida de archivo de audio al servidor                    //
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
    $path_audios = $_SERVER['DOCUMENT_ROOT'] . '/Atenea/media/Audio/';
    $audio_temporal = $_FILES['audio_file']['tmp_name'];

    if (!is_dir($path_audios) || !is_uploaded_file($audio_temporal))
    {
        echo $res;
    }//if

    //$aux = explode('.', $_FILES['imagen_card']['name']);
    $path_destino = $path_audios . $_POST['nombre'];// . '.' . $aux[count($aux) - 1];

    if (!move_uploaded_file($audio_temporal, $path_destino))
    {
        echo $res;
    }//if

    $res = 1;
    echo $res;
?>
