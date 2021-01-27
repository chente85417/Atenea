<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //                        Archivo php datos de apertura de sesión                              //
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
    //Se recogen los parámetros que vienen por post
    $parametros = $_POST['parametros'];

    if (session_status() != PHP_SESSION_ACTIVE)
    {
        session_start();
    }//if
    //Se nombra la sesión
    $_SESSION['usuario'] = $parametros[0];
    //Se identifica al usuario
    $_SESSION['usrID'] = $parametros[1];
?>