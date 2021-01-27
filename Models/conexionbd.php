<?php
    /*
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //                    Archivo php del modelo de tratamiento de datos                           //
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
    /*
        LIBRERÍA DE RECURSOS DE ACCESO Y CONEXIÓN A LA BD

        Esta librería gestiona un objeto para el acceso y consulta a la BD
        Está implementada mediante una clase que se encarga de conectar y realizar las consultas y tareas
        relacionadas con la BD


    */
    //Inclusión de los datos de conexión
    require_once("../php/datos_conexion.php");

    class ConectorBD
    {
        private $host;
        private $usuario;
        private $clave;
        private $bd;
        private $conexion;

        private $ret;

        function __construct()
        {
            $this->ret = array('resultado'=>0, 'dato'=>'');
            //Se obtienen los datos de conexión y se almacenan en los atributos de la clase
            $this->SetHost();
            $this->SetUsuario();
            $this->SetClave();
            $this->SetBD();

            //Creación de la conexión a la BD
            $this->conexion = new mysqli($this->host, $this->usuario, $this->clave, $this->bd);

            if ($this->conexion->connect_errno)
            {
                $this->ret['dato'] = 'Error ' . $this->conexion->connect_errno . ' al establecer la conexión con la BD: ' . $this->conexion->connect_error;
            }//if

            if (!$this->conexion->set_charset('utf8'))
            {
                $this->ret['dato'] = 'Error cargando conjunto de caracteres utf-8: ' . $this->conexion->error;
            }//if

            $this->ret['resultado'] = 1;
        }

        //MÉTODOS SETTER
        function SetHost()
        {
            global $datos_conexion;
            ($datos_conexion['host'] === '') ? $this->host = 'localhost' : $this->host = $datos_conexion['host'];
        }//SetHost
        function SetUsuario()
        {
            global $datos_conexion;
            ($datos_conexion['usuario'] === '') ? $this->usuario = '' : $this->usuario = $datos_conexion['usuario']; 
        }//SetUsuario
        function SetClave()
        {
            global $datos_conexion;
            ($datos_conexion['clave'] === '') ? $this->clave = '' : $this->clave = $datos_conexion['clave']; 
        }//SetClave
        function SetBD()
        {
            global $datos_conexion;
            ($datos_conexion['bd'] === '') ? $this->bd = '' : $this->bd = $datos_conexion['bd']; 
        }//SetBD

        //MÉTODOS GETTER
        function GetRet()
        {
            return $this->ret;
        }//GetRet

        function ValidarLogin($parametros)// $usuario, $clave)
        {
            $this->ret['resultado'] = 0;

            $sql = "SELECT
                        USR_CODE,
                        USR_CLAVE,
                        USR_PERFIL 
                        FROM 
                            usuarios 
                        WHERE 
                            USR_NOMBRE_USUARIO = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de verificación de login!';
            }//if
            else
            {
                //Se enlazan los parámetros
                if (!$consulta_preparada->bind_param('s', $parametros[0]))//$usuario))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de verificación de login!';
                }//if
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de verificación de login!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result($id, $pass, $perfil))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de verificación de login!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                //Se verifica la contraseña encriptada
                                if (password_verify($parametros[1], $pass))//$clave, $pass))
                                {
                                    //Login correcto
                                    $this->ret['resultado'] = 1;
                                    $this->ret['dato'] = $id . '|' . $perfil;
                                }//if
                                else
                                {
                                    //El login no es correcto
                                    $this->ret['resultado'] = -1;
                                    $this->ret['dato'] = 'Login incorrecto!';
                                }//else
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $this->ret;
        }//ValidarLogin

        function ActualizarClave($parametros)
        {
            $this->ret['resultado'] = 0;

            //Encriptado de la contraseña
            $parametros[1] = password_hash($parametros[1], PASSWORD_BCRYPT);

            $sql = "UPDATE usuarios 
                        SET USR_CLAVE = ?
                        WHERE USR_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de usuarios!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de verificación de login!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de usuarios!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarClave

        function ActualizarClavePorUsuario($parametros)
        {
            $this->ret['resultado'] = 0;

            //Encriptado de la contraseña
            $parametros[1] = password_hash($parametros[1], PASSWORD_BCRYPT);

            $sql = "UPDATE usuarios 
                        SET USR_CLAVE = ?
                        WHERE USR_NOMBRE_USUARIO = ?
                        AND USR_EMAIL = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de cambio de clave!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de cambio de clave!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de cambio de clave!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = 1;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $this->ret['resultado'];
        }//ActualizarClavePorUsuario

        function FiltrarUsuarios($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            USR_CODE, 
                            USR_FOTO, 
                            USR_NOMBRE, 
                            USR_APELLIDOS, 
                            USR_NOMBRE_USUARIO, 
                            USR_EMAIL, 
                            USR_FECHA_ALTA, 
                            USR_DIRECCION, 
                            USR_CODIGO_POSTAL, 
                            USR_TELEFONO, 
                            USR_FECHA_NACIMIENTO 
                        FROM 
                            usuarios 
                        WHERE 
                            USR_PERFIL LIKE ? AND 
                            USR_NOMBRE LIKE ? AND 
                            USR_APELLIDOS LIKE ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de usuarios!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de verificación de login!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de usuarios!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $foto,
                                                                $nombre,
                                                                $apellido,
                                                                $usuario,
                                                                $email,
                                                                $fecha_alta,
                                                                $direccion,
                                                                $cp,
                                                                $telefono,
                                                                $fecha_nacimiento))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de filtrado de usuarios!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['USR_CODE']                = $id;
                                $arrayRegistro['USR_FOTO']                = $foto;
                                $arrayRegistro['USR_NOMBRE']              = $nombre;
                                $arrayRegistro['USR_APELLIDOS']           = $apellido;
                                $arrayRegistro['USR_NOMBRE_USUARIO']      = $usuario;
                                $arrayRegistro['USR_EMAIL']               = $email;
                                $arrayRegistro['USR_FECHA_ALTA']          = $fecha_alta;
                                $arrayRegistro['USR_DIRECCION']           = $direccion;
                                $arrayRegistro['USR_CODIGO_POSTAL']       = $cp;
                                $arrayRegistro['USR_TELEFONO']            = $telefono;
                                $arrayRegistro['USR_FECHA_NACIMIENTO']    = $fecha_nacimiento;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//FiltrarUsuarios

        function ObtenerDatosUsuario($ID)
        {
           $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            USR_CODE,
                            USR_PERFIL, 
                            USR_FOTO, 
                            USR_NOMBRE, 
                            USR_APELLIDOS, 
                            USR_NOMBRE_USUARIO, 
                            USR_EMAIL, 
                            USR_FECHA_ALTA, 
                            USR_DIRECCION, 
                            USR_CODIGO_POSTAL, 
                            USR_TELEFONO, 
                            USR_FECHA_NACIMIENTO 
                        FROM 
                            usuarios 
                        WHERE 
                            USR_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de datos de usuario!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$ID))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de datos de usuario!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de datos de usuario!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $perfil,
                                                                $foto,
                                                                $nombre,
                                                                $apellido,
                                                                $usuario,
                                                                $email,
                                                                $fecha_alta,
                                                                $direccion,
                                                                $cp,
                                                                $telefono,
                                                                $fecha_nacimiento))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de datos de usuario!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['USR_CODE']                = $id;
                                $arrayRegistro['USR_FOTO']                = $foto;
                                $arrayRegistro['USR_PERFIL']              = $perfil;
                                $arrayRegistro['USR_NOMBRE']              = $nombre;
                                $arrayRegistro['USR_APELLIDOS']           = $apellido;
                                $arrayRegistro['USR_NOMBRE_USUARIO']      = $usuario;
                                $arrayRegistro['USR_EMAIL']               = $email;
                                $arrayRegistro['USR_FECHA_ALTA']          = $fecha_alta;
                                $arrayRegistro['USR_DIRECCION']           = $direccion;
                                $arrayRegistro['USR_CODIGO_POSTAL']       = $cp;
                                $arrayRegistro['USR_TELEFONO']            = $telefono;
                                $arrayRegistro['USR_FECHA_NACIMIENTO']    = $fecha_nacimiento;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;           
        }//ObtenerDatosUsuario

        function ObtenerEmail($parametros)
        {
           $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            USR_EMAIL
                        FROM 
                            usuarios 
                        WHERE 
                            USR_NOMBRE_USUARIO = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de email de usuario!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de email de usuario!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de email de usuario!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result($email))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de email de usuario!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['USR_EMAIL'] = $email;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;           
        }//ObtenerEmail

        function InsertarUsuario($parametros)
        {
            $this->ret['resultado'] = 0;

            //Encriptado de la contraseña
            $parametros[2] = password_hash($parametros[2], PASSWORD_BCRYPT);

            $sql = "INSERT INTO usuarios VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?)";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de usuarios!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de verificación de login!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de usuarios!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//InsertarUsuario

        function ActualizarUsuario($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "UPDATE usuarios SET USR_NOMBRE_USUARIO = ?,
                                        USR_PERFIL = ?,
                                        USR_NOMBRE = ?,
                                        USR_APELLIDOS = ?,
                                        USR_DIRECCION = ?,
                                        USR_CODIGO_POSTAL = ?,
                                        USR_TELEFONO = ?,
                                        USR_EMAIL = ?,
                                        USR_FECHA_NACIMIENTO = ?,
                                        USR_FECHA_ALTA = ?,
                                        USR_FOTO = ? WHERE USR_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de actualización de usuario!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de actualización de usuario!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de actualización de usuario!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarUsuario

        function InsertarFotoUsuario($ID, $foto)   
        {
            //Escapamos los caracteres para que se puedan almacenar en la base de datos correctamente.
            $foto = $this->conexion->real_escape_string($foto);

            $this->ret['resultado'] = 0;
            //No se usa una sentencia preparada al tratarse de un blob
            $sql = "UPDATE usuarios SET USR_FOTO = '" . $foto . "' WHERE USR_CODE = '" . $ID . "'";

            $res = $this->conexion->query($sql);
    
            if ($this->conexion->errno)
            {
                $this->ret['dato'] = 'No se pudo subir la foto. Error ' . $this->conexion->errno . ': ' . $this->conexion->error;
            }//if
            else
            {
                $this->ret['resultado'] = 1;
                $this->ret['dato'] = 'La foto se subió correctamente';
            }//else

            $this->conexion->close();
        }//InsertarUsuario

        function EliminarUsuario($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM usuarios WHERE USR_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de usuarios!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de usuarios!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarUsuarios

        function FiltrarTextos($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            MD_CODE, 
                            MD_DENOMINACION, 
                            MD_DESCRIPCION 
                        FROM 
                            medios 
                        WHERE 
                            MD_TIPO = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de medios(textos)!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en el filtrado de medios(textos)!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de medios(textos)!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de filtrado de medios(textos)!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['MD_CODE']           = $id;
                                $arrayRegistro['MD_DENOMINACION']   = $denominacion;
                                $arrayRegistro['MD_DESCRIPCION']    = $descripcion;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//FiltrarTextos

        function ObtenerContenidoElementoTexto($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            MD_VALOR  
                        FROM 
                            medios 
                        WHERE 
                            MD_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de obtención de contenido de texto!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la obtención de contenido de texto!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de obtención de contenido de texto!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result($contenido))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de obtención de contenido de texto!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['MD_VALOR']  = $contenido;
                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ObtenerContenidoElementoTexto

        function InsertarTexto($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "INSERT INTO medios VALUES (NULL,?,?,?,?,'')";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de inserción de texto!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de inserción de texto!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de inserción de texto!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//InsertarTexto

        function ObtenerTexto($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            MD_CODE, 
                            MD_DENOMINACION, 
                            MD_DESCRIPCION, 
                            MD_VALOR 
                        FROM 
                            medios 
                        WHERE 
                            MD_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de obtención de texto!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de obtención de texto!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de obtención de texto!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion,
                                                                $contenido
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de obtención de texto!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['MD_CODE']           = $id;
                                $arrayRegistro['MD_DENOMINACION']   = $denominacion;
                                $arrayRegistro['MD_DESCRIPCION']    = $descripcion;
                                $arrayRegistro['MD_VALOR']          = $contenido;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ObtenerTexto

        function EliminarTexto($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM medios WHERE MD_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de texto!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de texto!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarTexto

        function ActualizarTexto($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "UPDATE medios SET   MD_DENOMINACION = ?,
                                        MD_DESCRIPCION = ?,
                                        MD_VALOR = ? WHERE MD_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de actualización de texto!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de actualización de texto!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de actualización de texto!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarTexto

        function FiltrarImagenes($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            MD_CODE, 
                            MD_DENOMINACION, 
                            MD_DESCRIPCION,
                            MD_RUTA
                        FROM 
                            medios 
                        WHERE 
                            MD_TIPO = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de medios(imágenes)!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en el filtrado de medios(imágenes)!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de medios(imágenes)!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion,
                                                                $ruta))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de filtrado de medios(imágenes)!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['MD_CODE']           = $id;
                                $arrayRegistro['MD_DENOMINACION']   = $denominacion;
                                $arrayRegistro['MD_DESCRIPCION']    = $descripcion;
                                $arrayRegistro['MD_RUTA']           = $ruta;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//FiltrarImagenes

        function InsertarImagen($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "INSERT INTO medios VALUES (NULL,?,?,?,'',?)";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de inserción de imagen!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de inserción de imagen!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de inserción de imagen!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//InsertarImagen

        function ObtenerImagen($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            MD_CODE, 
                            MD_DENOMINACION, 
                            MD_DESCRIPCION, 
                            MD_RUTA 
                        FROM 
                            medios 
                        WHERE 
                            MD_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de obtención de imagen!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de obtención de imagen!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de obtención de imagen!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion,
                                                                $ruta
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de obtención de imagen!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['MD_CODE']           = $id;
                                $arrayRegistro['MD_DENOMINACION']   = $denominacion;
                                $arrayRegistro['MD_DESCRIPCION']    = $descripcion;
                                $arrayRegistro['MD_RUTA']           = $ruta;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ObtenerImagen

        function ActualizarImagen($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "UPDATE medios SET   MD_DENOMINACION = ?,
                                        MD_DESCRIPCION = ?,
                                        MD_RUTA = ? WHERE MD_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de actualización de imagen!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de actualización de imagen!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de actualización de imagen!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarImagen

        function EliminarImagen($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM medios WHERE MD_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de imagen!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de imagen!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarImagen

        function FiltrarVideos($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            MD_CODE, 
                            MD_DENOMINACION, 
                            MD_DESCRIPCION,
                            MD_RUTA
                        FROM 
                            medios 
                        WHERE 
                            MD_TIPO = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de medios(vídeos)!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en el filtrado de medios(vídeos)!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de medios(vídeos)!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion,
                                                                $ruta))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de filtrado de medios(vídeos)!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['MD_CODE']           = $id;
                                $arrayRegistro['MD_DENOMINACION']   = $denominacion;
                                $arrayRegistro['MD_DESCRIPCION']    = $descripcion;
                                $arrayRegistro['MD_RUTA']           = $ruta;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//FiltrarVideos

        function InsertarVideo($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "INSERT INTO medios VALUES (NULL,?,?,?,'',?)";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de inserción de vídeo!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de inserción de vídeo!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de inserción de vídeo!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//InsertarVideo

        function ObtenerVideo($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            MD_CODE, 
                            MD_DENOMINACION, 
                            MD_DESCRIPCION, 
                            MD_RUTA 
                        FROM 
                            medios 
                        WHERE 
                            MD_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de obtención de vídeo!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de obtención de vídeo!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de obtención de vídeo!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion,
                                                                $ruta
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de obtención de vídeo!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['MD_CODE']           = $id;
                                $arrayRegistro['MD_DENOMINACION']   = $denominacion;
                                $arrayRegistro['MD_DESCRIPCION']    = $descripcion;
                                $arrayRegistro['MD_RUTA']           = $ruta;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ObtenerVideo

        function ActualizarVideo($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "UPDATE medios SET   MD_DENOMINACION = ?,
                                        MD_DESCRIPCION = ?,
                                        MD_RUTA = ? WHERE MD_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de actualización de vídeo!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de actualización de vídeo!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de actualización de vídeo!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarVideo

        function EliminarVideo($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM medios WHERE MD_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de vídeo!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de vídeo!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarVideo

        function FiltrarAudios($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            MD_CODE, 
                            MD_DENOMINACION, 
                            MD_DESCRIPCION,
                            MD_RUTA 
                        FROM 
                            medios 
                        WHERE 
                            MD_TIPO = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de medios(audios)!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en el filtrado de medios(audios)!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de medios(audios)!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion,
                                                                $ruta))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de filtrado de medios(audios)!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['MD_CODE']           = $id;
                                $arrayRegistro['MD_DENOMINACION']   = $denominacion;
                                $arrayRegistro['MD_DESCRIPCION']    = $descripcion;
                                $arrayRegistro['MD_RUTA']           = $ruta;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//FiltrarAudios

        function InsertarAudio($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "INSERT INTO medios VALUES (NULL,?,?,?,'',?)";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de inserción de audio!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de inserción de audio!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de inserción de audio!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//InsertarAudio

        function ObtenerAudio($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            MD_CODE, 
                            MD_DENOMINACION, 
                            MD_DESCRIPCION, 
                            MD_RUTA 
                        FROM 
                            medios 
                        WHERE 
                            MD_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de obtención de audio!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de obtención de audio!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de obtención de audio!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion,
                                                                $ruta
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de obtención de audio!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['MD_CODE']           = $id;
                                $arrayRegistro['MD_DENOMINACION']   = $denominacion;
                                $arrayRegistro['MD_DESCRIPCION']    = $descripcion;
                                $arrayRegistro['MD_RUTA']           = $ruta;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ObtenerAudio

        function ActualizarAudio($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "UPDATE medios SET   MD_DENOMINACION = ?,
                                        MD_DESCRIPCION = ?,
                                        MD_RUTA = ? WHERE MD_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de actualización de audio!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de actualización de audio!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de actualización de audio!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarAudio

        function EliminarAudio($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM medios WHERE MD_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de audio!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de audio!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarAudio

        function FiltrarTests($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "SELECT TS_CODE, TS_DENOMINACION, TS_DESCRIPCION FROM tests WHERE ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de tests!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en el filtrado de tests!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de tests!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de filtrado de tests!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['TS_CODE']           = $id;
                                $arrayRegistro['TS_DENOMINACION']   = $denominacion;
                                $arrayRegistro['TS_DESCRIPCION']    = $descripcion;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//FiltrarTests

        function ObtenerContenidoTest($parametros)
        {
        }//ObtenerContenidoTest

        function FiltrarImagenesOpciones($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "SELECT * FROM imagenes_opciones_tests";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de imágenes de opciones!';
            }//if
            else
            {
                /*
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en el filtrado de medios(imágenes)!';
                }//if     
                else
                {
                */    
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de imágenes de opciones!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $ruta))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de filtrado de imágenes de opciones!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['IOT_CODE']          = $id;
                                $arrayRegistro['IOT_DENOMINACION']  = $denominacion;
                                $arrayRegistro['IOT_RUTA']          = $ruta;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                //}//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//FiltrarImagenesOpciones

        function EliminarImagenOpcion($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM imagenes_opciones_tests WHERE IOT_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de imagen de opción de test!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de imagen de opción de test!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarImagenOpcion

        function InsertarImagenOpcion($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "INSERT INTO imagenes_opciones_tests VALUES (NULL,?,?)";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de inserción de imagen de opción de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de inserción de imagen de opción de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de inserción de imagen de opción de test!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//InsertarImagenOpcion

        function ObtenerImagenOpcion($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            IOT_CODE, 
                            IOT_DENOMINACION, 
                            IOT_RUTA 
                        FROM 
                            imagenes_opciones_tests 
                        WHERE 
                            IOT_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de obtención de imagen de opción de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de obtención de imagen de opción de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de obtención de imagen de opción de test!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $ruta
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de obtención de imagen de opción de test!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['IOT_CODE']          = $id;
                                $arrayRegistro['IOT_DENOMINACION']  = $denominacion;
                                $arrayRegistro['IOT_RUTA']          = $ruta;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ObtenerImagenOpcion

        function ActualizarImagenOpcion($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "UPDATE imagenes_opciones_tests SET   IOT_DENOMINACION = ?,
                                        IOT_RUTA = ? WHERE IOT_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de actualización de imagen de opción de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de actualización de imagen de opción de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de actualización de imagen de opción de test!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarImagenOpcion

        function InsertarTest($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "INSERT INTO tests VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?)";

            if ($parametros[5] == "")
            {
                $parametros[5] = NULL;
            }//if
            if ($parametros[7] == "")
            {
                $parametros[7] = NULL;
            }//if
            if ($parametros[9] == "")
            {
                $parametros[9] = NULL;
            }//if
            if ($parametros[11] == "")
            {
                $parametros[11] = NULL;
            }//if

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de inserción de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de inserción de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de inserción de test!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//InsertarTest

        function ObtenerTest($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            TS_CODE, 
                            TS_DENOMINACION, 
                            TS_DESCRIPCION,
                            TS_ENUNCIADO,
                            TS_RESPUESTA,
                            TS_OP1_IMG,
                            TS_OP1_TXT,
                            TS_OP2_IMG,
                            TS_OP2_TXT,
                            TS_OP3_IMG,
                            TS_OP3_TXT,
                            TS_OP4_IMG,
                            TS_OP4_TXT 
                        FROM 
                            tests 
                        WHERE 
                            TS_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de obtención de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de obtención de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de obtención de test!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion,
                                                                $textoPropio,
                                                                $respuesta,
                                                                $op1Imagen,
                                                                $op1Texto,
                                                                $op2Imagen,
                                                                $op2Texto,
                                                                $op3Imagen,
                                                                $op3Texto,
                                                                $op4Imagen,
                                                                $op4Texto
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de obtención de test!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['TS_CODE']           = $id;
                                $arrayRegistro['TS_DENOMINACION']   = $denominacion;
                                $arrayRegistro['TS_DESCRIPCION']    = $descripcion;
                                $arrayRegistro['TS_ENUNCIADO']      = $textoPropio;
                                $arrayRegistro['TS_RESPUESTA']      = $respuesta;
                                $arrayRegistro['TS_OP1_IMG']        = $op1Imagen;
                                $arrayRegistro['TS_OP1_TXT']        = $op1Texto;
                                $arrayRegistro['TS_OP2_IMG']        = $op2Imagen;
                                $arrayRegistro['TS_OP2_TXT']        = $op2Texto;
                                $arrayRegistro['TS_OP3_IMG']        = $op3Imagen;
                                $arrayRegistro['TS_OP3_TXT']        = $op3Texto;
                                $arrayRegistro['TS_OP4_IMG']        = $op4Imagen;
                                $arrayRegistro['TS_OP4_TXT']        = $op4Texto;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ObtenerTest

        function InsertarEncabezadoTest($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "INSERT INTO union_tests_medios VALUES (?,?,?)";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de inserción de elemento de encabezado de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de inserción de elemento de encabezado de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de inserción de elemento de encabezado de test!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//InsertarEncabezadoTest

        function FiltrarEncabezadoTest($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "SELECT  medios.MD_CODE AS CODIGO,
                            medios.MD_TIPO AS TIPO,
                            medios.MD_VALOR AS VALOR,
                            medios.MD_RUTA AS RUTA
                    FROM    medios,
                            tests,
                            union_tests_medios
                    WHERE   tests.TS_CODE = union_tests_medios.EXT_TS_CODE
                            AND
                            medios.MD_CODE = union_tests_medios.EXT_MD_CODE
                            AND
                            tests.TS_CODE = ?
                            ORDER BY union_tests_medios.ORDEN";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de encabezado de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en el filtrado de encabezado de test!';
                }//if     
                else
                {    
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de encabezado de test!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $tipo,
                                                                $valor,
                                                                $ruta))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de filtrado de encabezado de test!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['MD_CODE']   = $id;
                                $arrayRegistro['MD_TIPO']   = $tipo;
                                $arrayRegistro['MD_VALOR']  = $valor;
                                $arrayRegistro['MD_RUTA']   = $ruta;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//FiltrarEncabezadoTest

        function EliminarTest($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM tests WHERE TS_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de test!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de test!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarTest

        function ActualizarTest($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "UPDATE tests SET    TS_DENOMINACION = ?,
                                        TS_DESCRIPCION = ?,
                                        TS_ENUNCIADO = ?,
                                        TS_RESPUESTA = ?,
                                        TS_OP1_IMG = ?,
                                        TS_OP1_TXT = ?,
                                        TS_OP2_IMG = ?,
                                        TS_OP2_TXT = ?,
                                        TS_OP3_IMG = ?,
                                        TS_OP3_TXT = ?,
                                        TS_OP4_IMG = ?,
                                        TS_OP4_TXT = ? WHERE TS_CODE = ?";

            if ($parametros[5] == "")
            {
                $parametros[5] = NULL;
            }//if
            if ($parametros[7] == "")
            {
                $parametros[7] = NULL;
            }//if
            if ($parametros[9] == "")
            {
                $parametros[9] = NULL;
            }//if
            if ($parametros[11] == "")
            {
                $parametros[11] = NULL;
            }//if

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de actualización de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de actualización de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de actualización de test!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarTest

        function EliminarEncabezadoTest($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM union_tests_medios WHERE EXT_TS_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de encabezado del test!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de encabezado del test!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarEncabezadoTest

        function FiltrarBateriasTests($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "SELECT BT_CODE, BT_DENOMINACION, BT_DESCRIPCION FROM baterias_tests WHERE ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de filtrado de baterías de tests!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en el filtrado de baterías de tests!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de filtrado de baterías de tests!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de filtrado de baterías de tests!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['BT_CODE']           = $id;
                                $arrayRegistro['BT_DENOMINACION']   = $denominacion;
                                $arrayRegistro['BT_DESCRIPCION']    = $descripcion;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//FiltrarBateriasTests

        function InsertarBateriaTest($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "INSERT INTO baterias_tests VALUES (NULL,?,?)";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de inserción de batería de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de inserción de batería de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de inserción de batería de test!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//InsertarBateriaTest

        function ObtenerBateriaTest($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            BT_CODE, 
                            BT_DENOMINACION, 
                            BT_DESCRIPCION
                        FROM 
                            baterias_tests 
                        WHERE 
                            BT_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de obtención de batería de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de obtención de batería de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de obtención de batería de test!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de obtención de batería de test!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['BT_CODE']           = $id;
                                $arrayRegistro['BT_DENOMINACION']   = $denominacion;
                                $arrayRegistro['BT_DESCRIPCION']    = $descripcion;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ObtenerBateriaTest

        function InsertarContenidoBateria($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "INSERT INTO union_tests_baterias_tests VALUES (?,?,?)";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de inserción de contenido de batería de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de inserción de contenido de batería de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de inserción de contenido de batería de test!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//InsertarContenidoBateria

        function ObtenerTestsBateria($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            TS_CODE, 
                            TS_DENOMINACION, 
                            TS_DESCRIPCION
                        FROM 
                            tests, union_tests_baterias_tests 
                        WHERE 
                            union_tests_baterias_tests.EXT_TS_CODE = tests.TS_CODE
                        AND
                            union_tests_baterias_tests.EXT_BT_CODE = ? ORDER BY union_tests_baterias_tests.ORDEN";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de obtención del contenido de la batería de tests!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de obtención del contenido de la batería de tests!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de obtención del contenido de la batería de tests!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de obtención del contenido de la batería de tests!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['TS_CODE']           = $id;
                                $arrayRegistro['TS_DENOMINACION']   = $denominacion;
                                $arrayRegistro['TS_DESCRIPCION']    = $descripcion;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ObtenerTestsBateria

        function EliminarBateriaTest($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM baterias_tests WHERE BT_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de batería de tests!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de batería de tests!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarBateriaTest

        function ActualizarBateria($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "UPDATE baterias_tests SET   BT_DENOMINACION = ?,
                                                BT_DESCRIPCION = ?
                                                WHERE BT_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de actualización de batería de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de actualización de batería de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de actualización de batería test!';
                    }//if
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarBateria

        function EliminarContenidoBateria($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM union_tests_baterias_tests WHERE EXT_BT_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de contenido de batería de tests!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de contenido de batería de tests!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarContenidoBateria

        function ObtenerAsignacionesAlumno($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            BT_CODE, 
                            BT_DENOMINACION, 
                            BT_DESCRIPCION,
                            FECHA_ASIGNACION,
                            FECHA_INICIO,
                            FECHA_FIN,
                            EJECUCION,
                            CALIFICACION
                        FROM 
                            baterias_tests, union_alumnos_baterias_tests 
                        WHERE 
                            union_alumnos_baterias_tests.EXT_BT_CODE = baterias_tests.BT_CODE
                        AND
                            union_alumnos_baterias_tests.EXT_USR_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de obtención de la asignación del alumno!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de obtención de la asignación del alumno!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de obtención de la asignación del alumno!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result(  $id,
                                                                $denominacion,
                                                                $descripcion,
                                                                $fechaAsignacion,
                                                                $fechaInicio,
                                                                $fechaFin,
                                                                $ejecucion,
                                                                $calificacion
                                                                ))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de obtención de la asignación del alumno!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['BT_CODE']           = $id;
                                $arrayRegistro['BT_DENOMINACION']   = $denominacion;
                                $arrayRegistro['BT_DESCRIPCION']    = $descripcion;
                                $arrayRegistro['FECHA_ASIGNACION']  = $fechaAsignacion;
                                $arrayRegistro['FECHA_INICIO']      = $fechaInicio;
                                $arrayRegistro['FECHA_FIN']         = $fechaFin;
                                $arrayRegistro['EJECUCION']         = $ejecucion;
                                $arrayRegistro['CALIFICACION']      = $calificacion;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ObtenerAsignacionesAlumno

        function EliminarAsignaciones($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "DELETE FROM union_alumnos_baterias_tests WHERE EXT_USR_CODE = " . $parametros[0];

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la sentencia de eliminación de asignaciones!';
            }//if
            else
            {
                //Se ejecuta la consulta
                if (!$consulta_preparada->execute())
                {
                    $this->ret['dato'] = 'Error al ejecutar la sentencia de eliminación de asignaciones!';
                }//if
                else
                {
                    $this->ret['resultado'] = $this->conexion->insert_id;
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if              
        }//EliminarAsignaciones

        function ActualizarAsignacionesAlumno($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "INSERT INTO union_alumnos_baterias_tests VALUES (?,?,?,?,?,?,?)";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de actualización de asignaciones!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de actualización de asignaciones!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de actualización de asignaciones!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarAsignacionesAlumno

        function ActualizarEjecucion($parametros, $aux)
        {
            $this->ret['resultado'] = 0;

            $sql = "";

            if ($aux = 0)
            {
                if (count($parametros) == 6)
                {
                    $sql = "UPDATE union_alumnos_baterias_tests
                    SET
                        FECHA_FIN = ?,
                        EJECUCION = ?,
                        CALIFICACION = ?
                    WHERE
                        EXT_USR_CODE = ?
                        AND
                        EXT_BT_CODE = ?";
                }//if
                else
                {
                    $sql = "UPDATE union_alumnos_baterias_tests
                    SET
                        EJECUCION = ?,
                        CALIFICACION = ?
                    WHERE
                        EXT_USR_CODE = ?
                        AND
                        EXT_BT_CODE = ?";
                }//else
            }//if
            else
            {
                if (count($parametros) == 7)
                {
                    $sql = "UPDATE union_alumnos_baterias_tests
                    SET
                        FECHA_INICIO = ?,
                        FECHA_FIN = ?,
                        EJECUCION = ?,
                        CALIFICACION = ?
                    WHERE
                        EXT_USR_CODE = ?
                        AND
                        EXT_BT_CODE = ?";
                }//if
                else
                {
                    $sql = "UPDATE union_alumnos_baterias_tests
                    SET
                        FECHA_INICIO = ?,
                        EJECUCION = ?,
                        CALIFICACION = ?
                    WHERE
                        EXT_USR_CODE = ?
                        AND
                        EXT_BT_CODE = ?";
                }//else
            }//else

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de actualización de ejecución!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de actualización de ejecución!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de actualización de ejecución!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ActualizarEjecucion

        function ComprobarMedio($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            EXT_TS_CODE 
                        FROM 
                            union_tests_medios 
                        WHERE 
                            EXT_MD_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de comprobación de medio!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de comprobación de medio!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de comprobación de medio!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result($id))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de comprobación de medio!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['EXT_TS_CODE'] = $id;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ComprobarMedio

        function ComprobarTest($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            EXT_BT_CODE 
                        FROM 
                            union_tests_baterias_tests 
                        WHERE 
                            EXT_TS_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de comprobación de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de comprobación de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de comprobación de test!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result($id))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de comprobación de test!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['EXT_BT_CODE'] = $id;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ComprobarTest

        function ComprobarBateria($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            EXT_USR_CODE 
                        FROM 
                            union_alumnos_baterias_tests 
                        WHERE 
                            EXT_BT_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de comprobación de batería de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de comprobación de batería de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de comprobación de batería de test!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result($id))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de comprobación de batería de test!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['EXT_USR_CODE'] = $id;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ComprobarBateria

        function ComprobarEjecucionBateria($parametros)
        {
            $arrayRecordset = array();
            $this->ret['resultado'] = 0;

            $sql = "    SELECT 
                            FECHA_INICIO 
                        FROM 
                            union_alumnos_baterias_tests 
                        WHERE 
                            EXT_BT_CODE = ? AND EXT_USR_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de comprobación de ejecución de batería de test!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de comprobación de ejecución de batería de test!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de comprobación de ejecución de batería de test!';
                    }//if
                    else
                    {
                        //Se enlazan las variables para los campos del resultado
                        if (!$consulta_preparada->bind_result($fecha_inicio))
                        {
                            $this->ret['dato'] = 'Error al retornar valores de la consulta de comprobación de ejecución de batería de test!';
                        }//if
                        else
                        {
                            //Se obtienen los datos
                            while ($consulta_preparada->fetch())
                            {
                                $arrayRegistro = array();
                                $arrayRegistro['FECHA_INICIO'] = $fecha_inicio;

                                array_push($arrayRecordset, $arrayRegistro);
                            }//while
                        }//else
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if
            return $arrayRecordset;
        }//ComprobarEjecucionBateria

        function ResetEjecucion($parametros)
        {
            $this->ret['resultado'] = 0;

            $sql = "UPDATE union_alumnos_baterias_tests
                    SET
                        FECHA_INICIO = ?,
                        FECHA_FIN = ?,
                        EJECUCION = ?,
                        CALIFICACION = ?
                    WHERE
                        EXT_USR_CODE = ?
                        AND
                        EXT_BT_CODE = ?";

            //Se prepara la consulta
            $consulta_preparada = $this->conexion->prepare($sql);
            if (!$consulta_preparada)
            {
                $this->ret['dato'] = 'Error al preparar la consulta de reset de ejecución!';
            }//if
            else
            {
                if (!$consulta_preparada->bind_param(...$parametros))
                {
                    $this->ret['dato'] = 'Error al enlazar parámetro en la consulta de reset de ejecución!';
                }//if     
                else
                {
                    //Se ejecuta la consulta
                    if (!$consulta_preparada->execute())
                    {
                        $this->ret['dato'] = 'Error al ejecutar la consulta de reset de ejecución!';
                    }//if
                    else
                    {
                        $this->ret['resultado'] = $this->conexion->insert_id;
                    }//else
                }//else
            }//else
            if ($consulta_preparada)
            {
                $consulta_preparada->close();
            }//if     
        }//ResetEjecucion
    };
?>
