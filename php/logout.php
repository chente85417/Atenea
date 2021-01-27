<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //                   Archivo php para proceso de eliminación de sesión                         //
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
    if (session_status() != PHP_SESSION_ACTIVE)
    {
        session_start();
    }//if
    unset($_SESSION['usuario']);
    session_destroy();
    header("Location: ../login.php");
?>