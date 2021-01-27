/////////////////////////////////////////////////////////////////////////////////////////////////
//                Archivo de implementación de la página acceso a ATENEA                       //
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

function Factoria(tipoElemento, atributos, texto)
{
    //CREACIÓN DEL NODO DEL ELEMENTO
    let nodoElemento = document.createElement(tipoElemento);
    //CREACIÓN DE LOS ATRIBUTOS
    atributos.forEach(function(dataAtributo)
                        {
                            let nodoAtributo = document.createAttribute(dataAtributo[0]);
                            nodoAtributo.value = dataAtributo[1];
                            nodoElemento.setAttributeNode(nodoAtributo);
                        });
    //CREACIÓN DEL TEXTO DEL ELEMENTO
    let nodoTextoElemento = document.createTextNode(texto);
    nodoElemento.appendChild(nodoTextoElemento);
    //Se entrega el elemento creado
    return nodoElemento;
}//Factoria

$(document).ready(function(){
    //Path relativo a la carpeta de archivos php
    let pathPHP = "../Atenea/Controllers/";

    //Usuario en curso
    let usuarioObjetivo = -1;
    let nombreUsuario   = "";
    let claveUsuario    = "";
    let claveMaestra    = $("#clave_maestra").val();

    //Bandera que establece si está previsto el cambio de clave activo por parte del usuario
    let cambioClave = false;
    let emailObjetivo = "";

    //Se oculta la sección de actualización de la clave
    $("#reset_clave").css("display", "none");

    $("#login_boton_entrar").click(function(){
        //Se obtienen los datos insertos por el usuario
        nombreUsuario   = $("#login_nombre_usuario").val();
        claveUsuario    = $("#login_clave_usuario").val();

        //No se permiten campos vacíos
        if ((nombreUsuario == "")||(claveUsuario == ""))
        {
            alert("¡No se permiten campos vacíos!\nPor favor, completa todos los campos.");
            ResetLogin(5);
            return;
        }//if

        //Se comprueba el login del usuario
        var op = "VALIDAR_LOGIN";
        var param = [nombreUsuario, claveUsuario];

        $.ajax({
            method: "POST",
            url: pathPHP + "LoginController.php",
            data:   {   operacion: op,
                        parametros: param
                    },
            success: function(respuesta)
                    {
                        //Extracción de los datos del JSON de respuesta en un array
                        var resultado = JSON.parse(respuesta);

                        switch (resultado["resultado"])
                        {
                            case -1:
                                {
                                    /*
                                        LOGIN INCORRECTO.
                                        CAUSA: usuario correcto, clave incorrecta.
                                    */
                                    if (claveUsuario == claveMaestra)
                                    {
                                        //El usuario ha insertado la clave maestra pero esa no es su clave
                                        //Puede que el usuario desee cambiarla
                                        ResetLogin(4);
                                    }//if
                                    else
                                    {
                                        //El usuario se ha equivocado de clave y no ha insertado la maestra
                                        ResetLogin(0);
                                    }//else
                                    break;
                                }
                            case 0:
                                {
                                    //ERRORES
                                    if (resultado["dato"] == "")
                                    {
                                        //Error de usuario
                                        ResetLogin(1);
                                    }//if
                                    else
                                    {
                                        //Error en la consulta
                                        alert("¡Se ha producido un error de acceso!\n Por favor, vuelva a intentarlo y si el error persiste contacte con los administradores del sitio");
                                        ResetLogin(2);
                                    }//else
                                    break;
                                }
                            case 1:
                                {
                                    //LOGIN CORRECTO
                                    var datosUsuario = resultado["dato"].split('|');
                                    //Se identifica al usuario para usos posteriores
                                    usuarioObjetivo = datosUsuario[0];

                                    if (claveUsuario == claveMaestra)
                                    {
                                        /*
                                            El usuario ha insertado la clave maestra y se trata de su primer acceso.
                                            Hay que indicarle al usuario que debe personalizarla para poder acceder.
                                        */
                                        ResetLogin(3);
                                    }//if
                                    else
                                    {
                                        //Se procede a abrir la sesión desde una llamada ajax
                                        var param = [nombreUsuario, usuarioObjetivo];
                                        $.ajax({
                                            method: "POST",
                                            url: "./php/abrirSesion.php",
                                            data:   {   parametros: param
                                                    },
                                            success: function(respuesta)
                                                    {
                                                        //Se redirige a su página en función del perfil
                                                        if (datosUsuario[1] == 'ADMINISTRADOR')
                                                        {
                                                            //Acceso de un ADMINISTRADOR
                                                            window.location.href = "./Views/AdministradorView.php";
                                                        }//if
                                                        else
                                                        {
                                                            //Acceso de un ALUMNO
                                                            window.location.href = "./Views/AlumnoView.php";
                                                        }//else
                                                    },
                                            error: function(jqxhr, status, exception)
                                                    {
                                                        alert('Exception:', exception);
                                                    }
                                            });
                                    }//else
                                    break;
                                }
                        }//switch
                    },
            error: function(jqxhr, status, exception)
                    {
                        alert('Exception:', exception);
                    }
            });
    });

    $("#login_boton_reset_pass").click(function(){
        $("#mensaje").remove();
        $(".email").remove();

        var divCont = Factoria("div", [["class", "col-12 bloque email"],["id", "mensaje"]], "");
                divCont.appendChild(Factoria("p", [["id", "mensajes"]], "¿Ha olvidado su clave? Inserte su usuario y la dirección de correo que proporcionó cuando se dió de alta. Luego rellene la nueva clave."));
            $("#btn_volver").parent().before(divCont);
            
            divCont = Factoria("div", [["class", "col-12 bloque email"]], "");
                divCont.appendChild(Factoria("h4", [[]], "Email"));
                divCont.appendChild(Factoria("input", [["type", "email"],["id", "email"]], ""));
            $("#btn_volver").parent().before(divCont);

            divCont = Factoria("div", [["class", "col-12 bloque_boton primero email"]], "");
                var botonEnviar = Factoria("button",   [["type", "button"],
                                                        ["id", "btn_email"],
                                                        ["class", "boton_login"]], "Enviar email");
                divCont.appendChild(botonEnviar);
            $("#btn_volver").parent().before(divCont);
            
            botonEnviar.addEventListener("click", OnClickEnviar);

        $("#login_formulario form div:not(:first-child").css("display", "none");
        $("#reset_clave div:first-child").css("display", "none");
        $("#reset_clave div:nth-child(2)").css("display", "none");
        $("#reset_clave div:nth-child(3)").css("display", "none");
        $("#reset_clave").css("display", "block");
    });

    $("#btn_reset_clave").click(function(){
        //Se comprueba si el cambio de clave obedece a decisión del usuario o a primer acceso
        if (cambioClave)
        {
            //Decisión del usuario
                //Se obtienen las entradas para la nueva clave
                var nuevaClave = $("#nueva_clave").val();
                var nueva_Clave2 = $("#nueva_clave2").val();
                //Se obtiene el nombre de usuario
                var usuario = $("#login_nombre_usuario").val();

                //Se comprueba que las claves no están vacías
                if (nuevaClave == "")
                {
                    alert("¡No está permitido registrar la clave vacía!\nPor favor, ingresa una clave.");
                    return;
                }//if

                //Se comprueba que la nueva clave no es la maestra
                if (nuevaClave == claveMaestra)
                {
                    //No se permite establecer como clave privada a la clave maestra
                    alert("¡No está permitido usar la clave maestra como clave privada!");
                }//if
                else
                {
                    //Se comprueba la consistencia de las entradas
                    if (nuevaClave === nueva_Clave2)
                    {
                        //Se procede a actualizar la clave para el usuario
                        var op = "ACTUALIZAR_CLAVE_POR_USUARIO";
                        var param = ['sss', nuevaClave, usuario, emailObjetivo];
                
                        $.ajax({
                            method: "POST",
                            url: pathPHP + "LoginController.php",
                            data:   {   operacion: op,
                                        parametros: param
                                    },
                            success: function(respuesta)
                                    {
                                        //Extracción de los datos del JSON de respuesta en un array
                                        var resultado = JSON.parse(respuesta);

                                        if (resultado == 1)
                                        {
                                            //Se redirige a la página de login
                                            alert("Clave actualizada.\nAhora puede acceder al sistema con su clave privada");
                                        }//if
                                        else
                                        {
                                            //No se ha podido cambiar la clave
                                            alert("¡Error en el cambio de clave!");
                                        }//else
                                        ResetLogin(5);
                                    },
                            error: function(jqxhr, status, exception)
                                    {
                                        alert('Exception:', exception);
                                    }
                            });
                    }//if
                    else
                    {
                        //Entradas inconsistentes
                        alert("¡Las claves no coinciden!");
                    }//else
                }//else
        }//if
        else
        {
            //Primer acceso
            //Se comprueba la existencia de usuario objetivo
            if (usuarioObjetivo != -1)
            {
                //Se obtienen las entradas para la nueva clave
                var nuevaClave = $("#nueva_clave").val();
                var nueva_Clave2 = $("#nueva_clave2").val();

                //Se comprueba que las claves no están vacías
                if (nuevaClave == "")
                {
                    alert("¡No está permitido registrar la clave vacía!\nPor favor, ingresa una clave.");
                    return;
                }//if

                //Se comprueba que la nueva clave no es la maestra
                if (nuevaClave == claveMaestra)
                {
                    //No se permite establecer como clave privada a la clave maestra
                    alert("¡No está permitido usar la clave maestra como clave privada!");
                }//if
                else
                {
                    //Se comprueba la consistencia de las entradas
                    if (nuevaClave === nueva_Clave2)
                    {
                        //Se procede a actualizar la clave para el usuario
                        var op = "ACTUALIZAR_CLAVE";
                        var param = ['si', nuevaClave, usuarioObjetivo];
                
                        $.ajax({
                            method: "POST",
                            url: pathPHP + "LoginController.php",
                            data:   {   operacion: op,
                                        parametros: param
                                    },
                            success: function(respuesta)
                                    {
                                        //Extracción de los datos del JSON de respuesta en un array
                                        var resultado = JSON.parse(respuesta);

                                        //Se redirige a la página de login
                                        alert("Clave actualizada.\nAhora puede acceder al sistema con su clave privada");
                                        ResetLogin(5);
                                    },
                            error: function(jqxhr, status, exception)
                                    {
                                        alert('Exception:', exception);
                                    }
                            });
                    }//if
                    else
                    {
                        //Entradas inconsistentes
                        alert("¡Las claves no coinciden!");
                    }//else
                }//else
            }//if
        }//else
        $("#nueva_clave").val("");
        $("#nueva_clave2").val("");
    });

    function ResetLogin(estado)
    {
        switch (estado)
        {
            case 0: //error de clave
            case 1: //error de usuario
            {
                $("#mensaje").remove();
                $(".email").remove();

                var divCont = Factoria("div", [["class", "col-12 bloque"],["id", "mensaje"]], "");
                    divCont.appendChild(Factoria("p", [["id", "mensajes"]], "¡El usuario o la contraseña son incorrectos! Inténtelo de nuevo."));
                $("#login_boton_entrar").parent().before(divCont);

                $("#mensajes").css("color", "red");

                $("#login_nombre_usuario").val("");
                $("#login_clave_usuario").val("");
                $("#login_formulario").css("display", "block");
                $("#reset_clave").css("display", "none");

                break;
            }
            case 2: //error de consulta
            {
                $("#mensaje").remove();
                $(".email").remove();
                break;
            }
            case 3: //primer acceso
            {
                $("#mensaje").remove();

                var divCont = Factoria("div", [["class", "col-12 bloque"],["id", "mensaje"]], "");
                    divCont.appendChild(Factoria("p", [["id", "mensajes"]], "¡No es posible el acceso con la clave maestra! Debe crear una clave personalizada y usarla para acceder."));
                $("#nueva_clave").parent().before(divCont);

                $("#mensajes").css("color", "red");

                $("#login_formulario form").css("display", "none");
                $("#nueva_clave").val("");
                $("#nueva_clave2").val("");
                $("#reset_clave div:first-child").css("display", "block");
                $("#reset_clave div:nth-child(2)").css("display", "block");
                $("#reset_clave div:nth-child(3)").css("display", "block");
                $("#reset_clave").css("display", "block");

                break;
            }
            case 4: //cambio de clave
            {
                $("#mensaje").remove();
                $(".email").remove();

                var divCont = Factoria("div", [["class", "col-12 bloque email"],["id", "mensaje"]], "");
                        divCont.appendChild(Factoria("p", [["id", "mensajes"]], "¿Desea modificar su clave? Inserte la dirección de correo que proporcionó cuando se dió de alta. Recibirá un correo con un vínculo para cambiar la clave."));
                    $("#btn_volver").parent().before(divCont);
                    
                    divCont = Factoria("div", [["class", "col-12 bloque email"]], "");
                        divCont.appendChild(Factoria("input", [["type", "email"],["id", "email"]], ""));
                    $("#btn_volver").parent().before(divCont);

                    divCont = Factoria("div", [["class", "col-12 bloque_boton primero email"]], "");
                        var botonEnviar = Factoria("button",   [["type", "button"],
                                                                ["id", "btn_email"],
                                                                ["class", "boton_login"]], "Enviar email");
                        divCont.appendChild(botonEnviar);
                    $("#btn_volver").parent().before(divCont);
                    
                    botonEnviar.addEventListener("click", OnClickEnviar);

                $("#login_formulario form").css("display", "none");
                $("#reset_clave div:first-child").css("display", "none");
                $("#reset_clave div:nth-child(2)").css("display", "none");
                $("#reset_clave div:nth-child(3)").css("display", "none");
                $("#reset_clave").css("display", "block");

                break;
            }
            case 5: //acceso normal
            {
                $("#login_nombre_usuario").val("");
                $("#login_clave_usuario").val("");
                $("#mensaje").remove();
                $(".email").remove();
                $("#login_formulario form").css("display", "block");
                $("#login_formulario form div:not(:first-child").css("display", "block");
                $("#reset_clave").css("display", "none");
                break;
            }
        }//switch
    }//ResetLogin

    $("#btn_volver").click(function(){
        ResetLogin(5);
    });

    function OnClickEnviar()
    {
        //Comprobar la dirección de email entregada
        var usuario = $("#login_nombre_usuario").val();
        emailObjetivo = $("#email").val();
        //Se consulta el correo desde una llamada ajax
        if (usuario != "")
        {
            $.ajax({
                method: "POST",
                url: pathPHP + "MediosController.php",
                data:   {   operacion: 'OBTENER_EMAIL',
                            parametros: ['s', usuario]
                        },
                success: function(respuesta)
                        {
                            var resultado = JSON.parse(respuesta);
                            
                            if (resultado[0]["USR_EMAIL"] != emailObjetivo)
                            {
                                alert("¡El usuario " + usuario + " no tiene registada esa dirección de correo!\nInserta la dirección de correo que entregaste al darte de alta.\nSi no la conoces, contacta con el departamento de administración.");
                            }//if
                            else
                            {
                                /*
                                    El procedimiento correcto sería enviar un correo a la dirección de email con un vínculo a nuestro sitio donde
                                    el usuario cambiaría la clave. Una operativa para hacerlo sería enviar por ajax una solicitud para enviar el 
                                    mail desde PHP a través de la función mail().
                                    No podemos hacerlo porque para poder entregar un vínculo a nuestro sitio sería necesario que estuviera alojado
                                    en un web hosting y no en localhost.
                                    Por esto, para poder completar el cambio de clave se implementa sobre este propio login sin hacer uso del email.
                                */
                               $("#reset_clave div:first-child").css("display", "block");
                               $("#reset_clave div:nth-child(2)").css("display", "block");
                               $("#reset_clave div:nth-child(3)").css("display", "block");
                               $(".email").remove();
                               cambioClave = true;
                            }//else
                        },
                error: function(jqxhr, status, exception)
                        {
                            alert('Exception:', exception);
                        }
                });
        }//if
    }//OnClickEnviar
});