/////////////////////////////////////////////////////////////////////////////////////////////////
//       Archivo de implementación del diálogo de configuración de datos de los usuarios       //
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

//El código JavaScript se ejecutará en el momento en el que se haya cargado la estructura de la página
//Se usa JQuery pues si no habría que usar window.onload
$(document).ready(function(){

    let pathPHP = "../Controllers/";

    /////////////////////////////////////////////////////////////
    //                FUNCIONES Y OPERACIONES                  //
    /////////////////////////////////////////////////////////////

    function InsertarNuevoUsuario()
    {
       //Se obtienen los datos
            //NOMBRE DE USUARIO
            var nombreUsuario = $('#DlgUsuario-nombreUsuario').val();
            //CLAVE
            var clave = "ATENEA";
            //EMAIL
            var email = $('#DlgUsuario-email').val();
            //NOMBRE
            var nombre = $('#DlgUsuario-nombre').val();
            //APELLIDO
            var apellidos = $('#DlgUsuario-apellidos').val();
            //DIRECCIÓN
            var direccion = $('#DlgUsuario-direccion').val();
            //TELÉFONO
            var telefono = $('#DlgUsuario-telefono').val();
            //CÓDIGO POSTAL
            var cp = $('#DlgUsuario-codigoPostal').val();
            //FOTO
            var foto = $('#FUSR_label_foto').text();
            if (foto == "No se ha seleccionado ningún archivo...")
            {
                foto = "";
            }//if
            else
            {
                foto = nombreUsuario + "." + foto.split(".")[1];
            }//else
            //FECHA DE NACIMIENTO
            var fechaNacimiento = $('#DlgUsuario-fechaNacimiento').val();
            //FECHA DE ALTA
            var fechaActual = new Date();
            var fechaAlta = fechaActual.getFullYear() + '-' + fechaActual.getMonth() + '-' + fechaActual.getDate() + ' ' + fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();
            //PERFIL
            var perfil = "ADMINISTRADOR";
            if ($('#perfilAlumno').is(':checked'))
            {
                perfil = "ALUMNO";
            }//if

        //Se ordena la inserción por AJAX
            var ID;
            $.ajax({
                        method: "POST",
                        url: pathPHP + "UsuariosController.php",
                        data:   {   operacion: 'INSERTAR',
                                    parametros: [   'ssssssssssss',
                                                    nombreUsuario,
                                                    clave,
                                                    perfil,
                                                    nombre,
                                                    apellidos,
                                                    direccion,
                                                    cp,
                                                    telefono,
                                                    email,
                                                    fechaNacimiento,
                                                    fechaAlta,
                                                    foto
                                                ]
                                },
                        success: function(respuesta)
                            {
                                //Se obtiene el id del usuario recién insertado
                                ID = respuesta;
                            },
                        error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });        
            //Se sube la foto al servidor mediante AJAX si se ha cargado foto
            if (foto != "")
            {
                var formData = new FormData();
                var editableFoto = $('#FUSR_file_foto_usuario');
                formData.append('fotoUsuario',  editableFoto[0].files[0]);
                formData.append('nombre', nombreUsuario);
            
                $.ajax({
                        //La comunicación con el servidor será mediante POST
                        method: 'POST',
                        //Se indica el archivo php que subirá la foto al servidor
                        url: '../php/subirFoto.php',
                        data: formData,
                        contentType: false,
                        cache: false,
                        processData:false,
                        success: function(respuesta)
                            {
                                if (respuesta != 1)
                                {
                                    alert(respuesta);
                                }//else
                            }
                        });
            }//if    
    }//InsertarNuevoUsuario

    function ModificarDatosUsuario(operacion)
    {
       //Se obtienen los datos
            //NOMBRE DE USUARIO
            var nombreUsuario = $('#DlgUsuario-nombreUsuario').val();
            //EMAIL
            var email = $('#DlgUsuario-email').val();
            //NOMBRE
            var nombre = $('#DlgUsuario-nombre').val();
            //APELLIDO
            var apellidos = $('#DlgUsuario-apellidos').val();
            //DIRECCIÓN
            var direccion = $('#DlgUsuario-direccion').val();
            //TELÉFONO
            var telefono = $('#DlgUsuario-telefono').val();
            //CÓDIGO POSTAL
            var cp = $('#DlgUsuario-codigoPostal').val();
            //FOTO
            var foto = $('#FUSR_label_foto').text();
            if ((foto == "No se ha seleccionado ningún archivo...")||(foto == ""))
            {
                foto = "";
            }//if
            else
            {
                foto = nombreUsuario + "." + foto.split(".")[1];
            }//else
            //FECHA DE NACIMIENTO
            var fechaNacimiento = $('#DlgUsuario-fechaNacimiento').val();
            //FECHA DE ALTA
            var fechaActual = new Date();
            var fechaAlta = fechaActual.getFullYear() + '-' + fechaActual.getMonth() + '-' + fechaActual.getDate() + ' ' + fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();
            //PERFIL
            var perfil = "ADMINISTRADOR";
            if ($('#perfilAlumno').is(':checked'))
            {
                perfil = "ALUMNO";
            }//if

        //Se ordena la actualización por AJAX
            var ID;
            $.ajax({
                        method: "POST",
                        url: pathPHP + "UsuariosController.php",
                        data:   {   operacion: 'EDITAR',
                                    parametros: [   'ssssssssssss',
                                                    nombreUsuario,
                                                    perfil,
                                                    nombre,
                                                    apellidos,
                                                    direccion,
                                                    cp,
                                                    telefono,
                                                    email,
                                                    fechaNacimiento,
                                                    fechaAlta,
                                                    foto,
                                                    operacion
                                                ]
                                },
                        success: function(respuesta)
                            {
                                //Se obtiene el id del usuario recién insertado
                                ID = respuesta;
                            },
                        error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });        
            //Se sube la foto al servidor mediante AJAX si ha cambiado
            if (foto != "")
            {
                var editableFoto = $('#FUSR_file_foto_usuario');
                if (editableFoto[0].files[0])
                {
                    var formData = new FormData();
                    formData.append('fotoUsuario',  editableFoto[0].files[0]);
                    formData.append('nombre', nombreUsuario);
                
                    $.ajax({
                            //La comunicación con el servidor será mediante POST
                            method: 'POST',
                            //Se indica el archivo php que subirá la foto al servidor
                            url: '../php/subirFoto.php',
                            data: formData,
                            contentType: false,
                            cache: false,
                            processData:false,
                            success: function(respuesta)
                                {
                                    if (respuesta != 1)
                                    {
                                        alert(respuesta);
                                    }//else
                                }
                            });
                }//if
            }//if    
    }//ModificarDatosUsuario

    /////////////////////////////////////////////////////////////
    //                MANEJADORES DE EVENTOS                   //
    /////////////////////////////////////////////////////////////

    //BOTÓN DE INSERTAR NUEVO USUARIO
    $('#FUSR_btn_InsertarUsuario').click(function(){
        //Recurrir al DOM para saber qué es lo que hay que hacer
        var operacion = $("#ID_USR").val();

        if (operacion != -1)
        {
            ModificarDatosUsuario(operacion);
        }//if
        else
        {
            InsertarNuevoUsuario();
        }//else
        location.href="../Views/AdministradorView.php";
    })

    $("#FUSR_file_foto_usuario").change(function(){
        //Obtenemos el archivo de la foto desde el input file
        let foto = document.getElementById("FUSR_file_foto_usuario").files[0];
        var peso = foto.size / 1024;
        //Se hace una comprobación de la idoneidad del formato del archivo para asegurar que se trata de una imagen
        //También se comprueba el tamaño para no exceder los 2MB que admite el servidor en la tranferencia
        if ((foto.type != "image/jpeg") && (foto.type != "image/jpg") && (foto.type != "image/png"))
        {
            alert("Formato de archivo no admitido!\nLa foto debe ser jpeg, jpg o png");
        }//if
        else if (peso >= 2048)
        {
            alert("El tamaño máximo del archivo debe ser 2MB!\nReduzca su tamaño");
        }//else if
        else
        {
            //Se instancia un objeto FileReader para leer el archivo
            let reader = new FileReader();
            //Leemos el archivo como URL
            /*
                readAsDataURL devuelve una cadena que puede ser insertada en el atributo url de una etiqueta
                HTML tal como el atributo src de un img. En ese caso, se mostrará la imagen de igual forma que si
                se hubiera escrito una dirección en el atributo src
            */
            reader.readAsDataURL(foto);
            /*
                La carga del archivo por el FileReader se realiza asíncronamente por lo que disponemos de un
                manejador de evento para que cuando se termine de cargar el archivo se ejecuten las acciones
                que necesitamos
            */
            reader.onload = function(e){
                //Una vez leído el archivo de imagen, ésta se encuentra en formato URL en el atributo result
                //Esta sentencia, efectivamente, dibuja la imagen dentro del elemento img
                $("#FUSR_imagen_foto_usuario").attr('src', e.target.result);
            };
            var nombre = $('#FUSR_file_foto_usuario').val().replace(/[A-Za-z]:\\fakepath\\/i, '');
            $('#FUSR_label_foto').text(nombre);
        }//else
    })

    //BOTÓN DE SELECCIONAR FOTO
    $('#FUSR_boton_seleccionar_foto').click(function(){
        $('#FUSR_file_foto_usuario').click();
    })

    //BOTÓN DE QUITAR LA FOTO
    $('#FUSR_boton_quitar_foto').click(function(){
        $("#FUSR_imagen_foto_usuario").attr('src', "../media/Usuarios/silueta_usuario.png");
        $('#FUSR_label_foto').text("");
    })

    $('#FUSR_btn_Cancelar').click(function(){
        location.href="../Views/AdministradorView.php";
    })
});