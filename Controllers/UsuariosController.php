<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //                 Archivo php del controlador de la gestión de usuarios                       //
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

    $UsuariosModel = new ConectorBD();
    if ($UsuariosModel->GetRet()['resultado'] == 0)
    {
        //Fallo al crear la conexión con la BD
        die($UsuariosModel->GetRet()['dato']);
    }//if

    switch ($operacion)
    {
        case 'FILTRAR':
        {
            $Recordset = $UsuariosModel->FiltrarUsuarios($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'EDITAR':
        {
            $UsuariosModel->ActualizarUsuario($parametros);
            $idModificado = $UsuariosModel->GetRet()['resultado'];
            echo $idModificado;  
            break;
        }
        case 'INSERTAR':
        {
            $UsuariosModel->InsertarUsuario($parametros);
            $idInsertado = $UsuariosModel->GetRet()['resultado'];
            echo $idInsertado;         
            break;
        }
        case 'ELIMINAR':
        {
            $UsuariosModel->EliminarUsuario($parametros);
            break;
        }
    }//switch  
?>
