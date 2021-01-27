<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //                    Archivo php del controlador del proceso de login                         //
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
    require("../Models/conexionbd.php");

    //Se recogen los datos que vienen por POST
    $operacion  = $_POST['operacion'];
    $parametros = $_POST['parametros'];

    $MediosModel = new ConectorBD();
    if ($MediosModel->GetRet()['resultado'] == 0)
    {
        //Fallo al crear la conexión con la BD
        die($MediosModel->GetRet()['dato']);
    }//if

    switch ($operacion)
    {
        case 'VALIDAR_LOGIN':
            {
                $Resultado = $MediosModel->ValidarLogin($parametros);
                $a = json_encode($Resultado);
                echo $a;
                break;
            }
        case 'ACTUALIZAR_CLAVE':
            {
                $Resultado = $MediosModel->ActualizarClave($parametros);
                $a = json_encode($Resultado);
                echo $a;
                break;
            }
        case 'ACTUALIZAR_CLAVE_POR_USUARIO':
            {
                $Resultado = $MediosModel->ActualizarClavePorUsuario($parametros);
                $a = json_encode($Resultado);
                echo $a;
                break;
            }
    }//switch
?>