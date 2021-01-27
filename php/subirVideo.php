<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //                        Archivo php para subir vídeos al servidor                            //
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
    $path_videos = $_SERVER['DOCUMENT_ROOT'] . '/Atenea/media/Videos/';
    $video_temporal = $_FILES['video_card']['tmp_name'];

    if (!is_dir($path_videos) || !is_uploaded_file($video_temporal))
    {
        echo $res;
    }//if

    $path_destino = $path_videos . $_POST['nombre'];

    if (!move_uploaded_file($video_temporal, $path_destino))
    {
        echo $res;
    }//if

    $res = 1;
    echo $res;
?>
