<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //                      Archivo php del controlador de acceso a la bd                          //
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
        case 'OBTENER_DATOS_USUARIO':
        {
            $Recordset = $MediosModel->ObtenerDatosUsuario($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'OBTENER_EMAIL':
        {
            $Recordset = $MediosModel->ObtenerEmail($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'FILTRAR_TEXTOS':
        {
            $Recordset = $MediosModel->FiltrarTextos($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'FILTRAR_CONTENIDO':
        {
            $Recordset = $MediosModel->ObtenerContenidoElementoTexto($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'EDITAR_TEXTO':
        {
            $MediosModel->ActualizarTexto($parametros);
            $id = $parametros[4];
            $parametros = ['s', $id];
            $Recordset = $MediosModel->ObtenerTexto($parametros);
            $a = json_encode($Recordset);
            echo $a;           
            break;
        }
        case 'INSERTAR_TEXTO':
        {
            $MediosModel->InsertarTexto($parametros);
            $idInsertado = $MediosModel->GetRet()['resultado'];
            $parametros = ['s', $idInsertado];
            $Recordset = $MediosModel->ObtenerTexto($parametros);
            $a = json_encode($Recordset);
            echo $a;         
            break;
        }
        case 'ELIMINAR_TEXTO':
        {
            $MediosModel->EliminarTexto($parametros);
            break;
        }
        case 'FILTRAR_IMAGENES':
        {
            $Recordset = $MediosModel->FiltrarImagenes($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'INSERTAR_IMAGEN':
        {
            $MediosModel->InsertarImagen($parametros);
            $idInsertado = $MediosModel->GetRet()['resultado'];
            $parametros = ['s', $idInsertado];
            $Recordset = $MediosModel->ObtenerImagen($parametros);
            $a = json_encode($Recordset);
            echo $a;         
            break;
        }
        case 'EDITAR_IMAGEN':
        {
            $MediosModel->ActualizarImagen($parametros);
            $id = $parametros[4];
            $parametros = ['s', $id];
            $Recordset = $MediosModel->ObtenerImagen($parametros);
            $a = json_encode($Recordset);
            echo $a;           
            break;
        }
        case 'ELIMINAR_IMAGEN':
        {
            $MediosModel->EliminarImagen($parametros);
            break;
        }
        case 'FILTRAR_VIDEOS':
        {
            $Recordset = $MediosModel->FiltrarVideos($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'INSERTAR_VIDEO':
        {
            $MediosModel->InsertarVideo($parametros);
            $idInsertado = $MediosModel->GetRet()['resultado'];
            $parametros = ['s', $idInsertado];
            $Recordset = $MediosModel->ObtenerVideo($parametros);
            $a = json_encode($Recordset);
            echo $a;         
            break;
        }
        case 'EDITAR_VIDEO':
        {
            $MediosModel->ActualizarVideo($parametros);
            $id = $parametros[4];
            $parametros = ['s', $id];
            $Recordset = $MediosModel->ObtenerVideo($parametros);
            $a = json_encode($Recordset);
            echo $a;           
            break;
        }
        case 'ELIMINAR_VIDEO':
        {
            $MediosModel->EliminarVideo($parametros);
            break;
        }
        case 'FILTRAR_AUDIOS':
        {
            $Recordset = $MediosModel->FiltrarAudios($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'INSERTAR_AUDIO':
        {
            $MediosModel->InsertarAudio($parametros);
            $idInsertado = $MediosModel->GetRet()['resultado'];
            $parametros = ['s', $idInsertado];
            $Recordset = $MediosModel->ObtenerAudio($parametros);
            $a = json_encode($Recordset);
            echo $a;         
            break;
        }
        case 'EDITAR_AUDIO':
        {
            $MediosModel->ActualizarAudio($parametros);
            $id = $parametros[4];
            $parametros = ['s', $id];
            $Recordset = $MediosModel->ObtenerAudio($parametros);
            $a = json_encode($Recordset);
            echo $a;           
            break;
        }
        case 'ELIMINAR_AUDIO':
        {
            $MediosModel->EliminarAudio($parametros);
            break;
        }
        case 'FILTRAR_IMAGENES_OPCIONES':
        {
            $Recordset = $MediosModel->FiltrarImagenesOpciones($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'EDITAR_IMAGEN_OPCION':
        {
            $MediosModel->ActualizarImagenOpcion($parametros);
            $id = $parametros[3];
            $parametros = ['s', $id];
            $Recordset = $MediosModel->ObtenerImagenOpcion($parametros);
            $a = json_encode($Recordset);
            echo $a;           
            break;
        }
        case 'ELIMINAR_IMAGEN_OPCION':
        {
            $MediosModel->EliminarImagenOpcion($parametros);
            break;
        }
        case 'OBTENER_IMAGEN_OPCION':
        {
            $Recordset = $MediosModel->ObtenerImagenOpcion($parametros);
            $a = json_encode($Recordset);
            echo $a;           
            break;
        }
        case 'INSERTAR_IMAGEN_OPCION':
        {
            $MediosModel->InsertarImagenOpcion($parametros);
            $idInsertado = $MediosModel->GetRet()['resultado'];
            $parametros = ['s', $idInsertado];
            $Recordset = $MediosModel->ObtenerImagenOpcion($parametros);
            $a = json_encode($Recordset);
            echo $a;         
            break;
        }
        case 'INSERTAR_TEST':
        {
            $MediosModel->InsertarTest($parametros);
            $idInsertado = $MediosModel->GetRet()['resultado'];
            $parametros = ['s', $idInsertado];
            $Recordset = $MediosModel->ObtenerTest($parametros);
            $a = json_encode($Recordset);
            echo $a;         
            break;
        }
        case 'INSERTAR_ENCABEZADO_TEST':
        {
            $MediosModel->InsertarEncabezadoTest($parametros);
            break;
        }
        case 'FILTRAR_TESTS':
        {
            $Recordset = $MediosModel->FiltrarTests($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'FILTRAR_CONTENIDO_TEST':
        {
            $Recordset = $MediosModel->ObtenerTest($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'FILTRAR_CONTENIDO_ENCABEZADO':
        {
            $Recordset = $MediosModel->FiltrarEncabezadoTest($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'ELIMINAR_TEST':
        {
            $MediosModel->EliminarTest($parametros);
            break;
        }
        case 'ACTUALIZAR_TEST':
        {
            $MediosModel->ActualizarTest($parametros);
            break;
        }
        case 'ELIMINAR_ENCABEZADO_TEST':
        {
            $MediosModel->EliminarEncabezadoTest($parametros);
            break;
        }
        case 'FILTRAR_BATERIAS_TESTS':
        {
            $Recordset = $MediosModel->FiltrarBateriasTests($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'INSERTAR_BATERÍA':
        {
            $MediosModel->InsertarBateriaTest($parametros);
            $idInsertado = $MediosModel->GetRet()['resultado'];
            $parametros = ['s', $idInsertado];
            $Recordset = $MediosModel->ObtenerBateriaTest($parametros);
            $a = json_encode($Recordset);
            echo $a;         
            break;
        }
        case 'INSERTAR_CONTENIDO_BATERÍA':
        {
            $MediosModel->InsertarContenidoBateria($parametros);
            break;
        }
        case 'OBTENER_TESTS_BATERÍA':
        {
            $Recordset = $MediosModel->ObtenerTestsBateria($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'ELIMINAR_BATERÍA_TEST':
        {
            $MediosModel->EliminarBateriaTest($parametros);
            break;
        }
        case 'ACTUALIZAR_BATERÍA':
        {
            $MediosModel->ActualizarBateria($parametros);
            break;
        }
        case 'ELIMINAR_CONTENIDO_BATERÍA':
        {
            $MediosModel->EliminarContenidoBateria($parametros);
            break;
        }
        case 'OBTENER_ASIGNACIONES_ALUMNO':
        {
            $Recordset = $MediosModel->ObtenerAsignacionesAlumno($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'ELIMINAR_ASIGNACIONES':
        {
            $MediosModel->EliminarAsignaciones($parametros);
            break;
        }
        case 'ACTUALIZAR_ASIGNACIONES_ALUMNO':
        {
            $MediosModel->ActualizarAsignacionesAlumno($parametros);
            break;
        }
        case 'ACTUALIZAR_EJECUCIÓN':
        {
            $aux = $_POST['dato_auxiliar'];
            $MediosModel->ActualizarEjecucion($parametros, $aux);
            break;
        }
        case 'COMPROBAR_MEDIO':
        {
            $Recordset = $MediosModel->ComprobarMedio($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'COMPROBAR_TEST':
        {
            $Recordset = $MediosModel->ComprobarTest($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'COMPROBAR_BATERÍA':
        {
            $Recordset = $MediosModel->ComprobarBateria($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'COMPROBAR_EJECUCIÓN_BATERÍA':
        {
            $Recordset = $MediosModel->ComprobarEjecucionBateria($parametros);
            $a = json_encode($Recordset);
            echo $a;
            break;
        }
        case 'RESET_EJECUCIÓN':
        {
            $MediosModel->ResetEjecucion($parametros);
            break;
        }
    }//switch  
?>
