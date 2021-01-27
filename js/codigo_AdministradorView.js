/////////////////////////////////////////////////////////////////////////////////////////////////
//            Archivo de implementación de la página del usuario Administrador                 //
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

//El código JavaScript se ejecutará en el momento en el que se haya cargado la estructura de la página
//Se usa JQuery pues si no habría que usar window.onload
$(document).ready(function(){
    //Path relativo a la carpeta de archivos php
    let pathPHP = "../Controllers/";

    //Colores
    let colorFondoFilaResaltada = 'rgb(218, 251, 255)';
    let colorTextoFilaResaltada = 'black';
    let colorFondoFilaNormal = 'rgb(255, 246, 218)';
    let colorTextoFilaNormal = 'black';
    let colorFondoEntradaMenuPrincipal = 'rgb(73, 73, 73)';
    let colorFondoEntradaMenuPrincipalSeleccionado = '#47a0ff';
    let colorFondoEntradaMenuMedios = 'rgb(73, 73, 73)';
    let colorFondoEntradaMenuMediosSeleccionado = '#47a0ff';

    //Usuario conectado obtenido a través de la variable de sesión
    let usuarioConectado = $("#usuario_conectado").val();

    //Arrays con los datos actualmente seleccionados
    usuarioActual   = new Array();
    textoActual     = new Array();
    audioActual     = new Array();
    testActual      = new Array();
    alumnoActual    = new Array();

    let imagenActual = -1;
    let videoActual = -1;
    let bateriaActual = -1;

    //Variable usada en los timeouts
    let timer;

    //Banderas de control de carga de los formularios para optimizar las consultas a la BD
    let inicializadosTextos         = false;
    let inicializadasImagenes       = false;
    let inicializadosVideos         = false;
    let inicializadosAudios         = false;
    let inicializadosTests          = false;
    let inicializadosBateriasTests  = false;
    let inicializadosPlanes         = false;

    //Reproductor de audio actualmente en operación
    let filaEnReproduccion = -1;
    //Bandera para determinar si se ha ordenado la pausa por código
    let pausaOrdenada = false;

    //Elemento de test en curso
    let elementoTestEnCurso = null;

    //Bandera para controlar la previsualización de un vídeo
    let videoprevis = false;

    //Bandera que establece cuál es la opción de test que se está editando
    let opcionActual = "";
    let cartaImagenOpcionSeleccionada = null;

    //Modo de trabajo en curso
    let modoTrabajo = "NAVEGACIÓN";
    //Área de trabajo en curso
    let areaTrabajo = "USUARIOS";

    let modoTest = "NAVEGACIÓN";
    let submodoTest = "NAVEGACIÓN";
    let modoBateria = "NAVEGACIÓN";
    let modoPlanes = "NAVEGACIÓN";

    //Colección de imágenes
    coleccionImagenes = new Map();
    //Colección de vídeos
    coleccionVideos = new Map();

    //En la carga de la página se ordena la inicialización de sus contenidos
    Inicializar(); 

    /////////////////////////////////////////////////////////////
    //                FUNCIONES Y OPERACIONES                  //
    /////////////////////////////////////////////////////////////
    //Declaración del objeto Imagen que contiene los datos de las imágenes y maneja las cartas de su representación visual
    function Imagen(codigo = "", denominacion = "", descripcion = "", ruta = "")
    {
        this.codigo = codigo;
        this.denominacion = denominacion;
        this.descripcion = descripcion;
        this.ruta = ruta;

        this.CrearCarta = CrearCarta;
        this.OnClickCard = OnClickCard;
        this.OnClickImagen = OnClickImagen;
        this.OnChangeImagen = OnChangeImagen;
        this.OnClickBtnIzdo = OnClickBtnIzdo;
        this.OnClickBtnDcho = OnClickBtnDcho;
    }//Imagen

   //Declaración del objeto Video que contiene los datos de los vídeps y maneja las cartas de su representación visual
   function Video(codigo = "", denominacion = "", descripcion = "", ruta = "")
   {
       this.codigo = codigo;
       this.denominacion = denominacion;
       this.descripcion = descripcion;
       this.ruta = ruta;

       this.CrearCarta = CrearCarta;
       this.OnClickVideoCard = OnClickVideoCard;
       this.OnClickVideo = OnClickVideo;
       this.OnChangeVideo = OnChangeVideo;
      // this.OnPlayVideo = OnPlayVideo;
       this.OnClickBtnIzdoVideo = OnClickBtnIzdoVideo;
       this.OnClickBtnDchoVideo = OnClickBtnDchoVideo;
       //this.OnVideoMouseEnter = OnVideoMouseEnter;
       //this.OnVideoMouseLeave = OnVideoMouseLeave;
   }//Video

   //Obtiene los datos del usuario conectado y los muestra en el área superior
   function InsertarDatosUsuario(codigo)
   {
       //Se obtienen los datos del usuario conectado
       var op = "OBTENER_DATOS_USUARIO";
       var param = ['i', codigo];

       $.ajax({
           method: "POST",
           url: pathPHP + "MediosController.php",
           data:   {   operacion: op,
                       parametros: param
                   },
           success: function(respuesta)
                   {
                       //Extracción de los datos del JSON de respuesta en un array
                       var datosUsuario = JSON.parse(respuesta);
                       
                       if (datosUsuario.length == 1)
                       {
                           $("#ADM_nombre").text(datosUsuario[0]["USR_NOMBRE"] + " " + datosUsuario[0]["USR_APELLIDOS"]);
                       }//if
                   },
           error: function(jqxhr, status, exception)
                   {
                       alert('Exception:', exception);
                   }
           });
   }//InsertarDatosUsuario

    //Crea una nueva carta para la imagen y la muestra en pantalla
    function CrearCarta(elemento, editable)
    {
        if (elemento == "IMAGEN")
        {
            var codigo, denominacion, descripcion, imagen, ver_editables, ver_controles;
            var textoBtnIzdo, textoBtnDcho;
            if (editable)
            {
                codigo = "";
                denominacion = "";
                descripcion = "";
                imagen = "../media/Imagenes/Oficina-ordenada-simplificando-1280x720.jpg";
                ver_controles = "ocultar";
                ver_editables = "ver";
                textoBtnIzdo = "Insertar";
                textoBtnDcho = "Cancelar";
            }//if
            else
            {
                codigo = this.codigo;
                denominacion = this.denominacion;
                descripcion = this.descripcion;
                imagen = "../media/Imagenes/" + this.ruta;
                ver_controles = "ver";
                ver_editables = "ocultar";
                textoBtnIzdo = "Editar";
                textoBtnDcho = "Eliminar";
            }//else
            //CARTA
            var divCard = Factoria("div",   [["class", "card"],
                                            ["id", "cardCode"],
                                            ["style", "width: 18rem"]], "");
                //CÓDIGO DE LA IMAGEN (OCULTO)
                var inputCod = Factoria("input", [["type", "hidden"]], codigo);
                divCard.appendChild(inputCod);
                //IMAGEN
                var imagenCard = Factoria("img",    [["src", imagen],
                                                    ["class", "card-img-top"],
                                                    ["id", "visor_imagen_card"],
                                                    ["alt", ""]], "");
                divCard.appendChild(imagenCard);
                //SELECTOR DEL ARCHIVO DE LA IMAGEN (OCULTO)
                var inputSelImg = Factoria("input", [["type", "file"],
                                                    ["name", "imagen_card"],
                                                    ["id", "imagen_card"],
                                                    ["class", "ocultar"]], "");
                divCard.appendChild(inputSelImg);
                //CUERPO DE LA CARTA
                var divCardBody = Factoria("div", [["class", "card-body"]], "");
                divCard.appendChild(divCardBody);
                    //NOMBRE
                    var h5Den = Factoria("h5", [["class", "card-title " + ver_controles]], denominacion);
                    divCardBody.appendChild(h5Den);
                    //DESCRIPCIÓN
                    var pDesc = Factoria("p", [["class", "card-text " + ver_controles]], descripcion);
                    divCardBody.appendChild(pDesc);
                    //EDITABLE DEL NOMBRE
                    var inputDen = Factoria("input",    [["type", "text"],
                                                        ["name", "imagen_denominacion"],
                                                        ["id", "imagen_denominacion"],
                                                        ["class", "row col-12 " + ver_editables],
                                                        ["value", denominacion]], "");
                    divCardBody.appendChild(inputDen);
                    //EDITABLE DE LA DESCRIPCIÓN
                    var textareaDesc = Factoria("textarea", [["name", "imagen_descripcion"],
                                                            ["id", "imagen_descripcion"],
                                                            ["class", "row col-12 " + ver_editables],
                                                            ["cols", "30"],
                                                            ["rows", "10"],
                                                            ["value", descripcion]], "");
                    divCardBody.appendChild(textareaDesc);
                    //BOTONES
                    var divBotones = Factoria("div", [["class", "row justify-content-between carta_contenedor_botones"]], "");
                    divCardBody.appendChild(divBotones);
                        //BOTÓN IZQUIERDO
                        var buttonIzdo = Factoria("button", [["type", "button"],
                                                            ["id", "btn_izdo_imagen"],
                                                            ["class", "btn btn-secondary"]], textoBtnIzdo);
                        divBotones.appendChild(buttonIzdo);
                        //BOTÓN DERECHO
                        var buttonDcho = Factoria("button", [["type", "button"],
                                                            ["id", "btn_dcho_imagen"],
                                                            ["class", "btn btn-secondary"]], textoBtnDcho);
                        divBotones.appendChild(buttonDcho);

            var self = this;

            divCard.addEventListener("click", function(){self.OnClickCard(this, self)});
            imagenCard.addEventListener("click", function(){self.OnClickImagen(this, self)});
            inputSelImg.addEventListener("change", function(){self.OnChangeImagen(this, self)});
            buttonIzdo.addEventListener("click", function(e){self.OnClickBtnIzdo(e, this, self)});
            buttonDcho.addEventListener("click", function(e){self.OnClickBtnDcho(e, this, self)});

            $("#contenedor_cartas_imagenes").append(divCard);
        }//if
        else if (elemento == "VIDEO")
        {
            var codigo, denominacion, descripcion, video, ver_editables, ver_controles;
            var textoBtnIzdo, textoBtnDcho;
            if (editable)
            {
                codigo = "";
                denominacion = "";
                descripcion = "";
                video = "../media/Videos/Oficina-ordenada-simplificando-1280x720.jpg";
                ver_controles = "ocultar";
                ver_editables = "ver";
                textoBtnIzdo = "Insertar";
                textoBtnDcho = "Cancelar";
            }//if
            else
            {
                codigo = this.codigo;
                denominacion = this.denominacion;
                descripcion = this.descripcion;
                video = "../media/Videos/" + this.ruta;
                ver_controles = "ver";
                ver_editables = "ocultar";
                textoBtnIzdo = "Editar";
                textoBtnDcho = "Eliminar";
            }//else
            //CARTA
            var divCard = Factoria("div",   [["class", "card"],
                                            ["id", "cardCode"],
                                            ["style", "width: 18rem"]], "");
                //CÓDIGO DEL VÍDEO (OCULTO)
                var inputCod = Factoria("input", [["type", "hidden"]], codigo);
                divCard.appendChild(inputCod);
                //VÍDEO
                var videoCard = Factoria("video",   [["src", video],
                                                    ["controls", "true"],
                                                    ["preload", "metadata"],
                                                    ["class", "card-img-top"],
                                                    ["id", "visor_video_card"],
                                                    ["alt", ""],
                                                    ["style", "height: 200px"]], "");
                divCard.appendChild(videoCard);
                //SELECTOR DEL ARCHIVO DEL VÍDEO (OCULTO)
                var inputSelVid = Factoria("input", [["type", "file"],
                                                    ["name", "video_card"],
                                                    ["id", "video_card"],
                                                    ["class", "ocultar"]], "");
                divCard.appendChild(inputSelVid);
                //CUERPO DE LA CARTA
                var divCardBody = Factoria("div", [["class", "card-body"]], "");
                divCard.appendChild(divCardBody);
                    //NOMBRE
                    var h5Den = Factoria("h5", [["class", "card-title " + ver_controles]], denominacion);
                    divCardBody.appendChild(h5Den);
                    //DESCRIPCIÓN
                    var pDesc = Factoria("p", [["class", "card-text " + ver_controles]], descripcion);
                    divCardBody.appendChild(pDesc);
                    //EDITABLE DEL NOMBRE
                    var inputDen = Factoria("input",    [["type", "text"],
                                                        ["name", "video_denominacion"],
                                                        ["id", "video_denominacion"],
                                                        ["class", "row col-12 " + ver_editables],
                                                        ["value", denominacion]], "");
                    divCardBody.appendChild(inputDen);
                    //EDITABLE DE LA DESCRIPCIÓN
                    var textareaDesc = Factoria("textarea", [["name", "video_descripcion"],
                                                            ["id", "video_descripcion"],
                                                            ["class", "row col-12 " + ver_editables],
                                                            ["cols", "30"],
                                                            ["rows", "10"],
                                                            ["value", descripcion]], "");
                    divCardBody.appendChild(textareaDesc);
                    //BOTONES
                    var divBotones = Factoria("div", [["class", "row justify-content-between carta_contenedor_botones"]], "");
                    divCardBody.appendChild(divBotones);
                        //BOTÓN IZQUIERDO
                        var buttonIzdo = Factoria("button", [["type", "button"],
                                                            ["id", "btn_izdo_video"],
                                                            ["class", "btn btn-secondary"]], textoBtnIzdo);
                        divBotones.appendChild(buttonIzdo);
                        //BOTÓN DERECHO
                        var buttonDcho = Factoria("button", [["type", "button"],
                                                            ["id", "btn_dcho_video"],
                                                            ["class", "btn btn-secondary"]], textoBtnDcho);
                        divBotones.appendChild(buttonDcho);
           
            var self = this;

            divCard.addEventListener("click", function(){self.OnClickVideoCard(this, self)});
            videoCard.addEventListener("click", function(){self.OnClickVideo(this, self)});
            //videoCard.addEventListener("mouseenter", function(){self.OnVideoMouseEnter(this, self)});
            //videoCard.addEventListener("mouseleave", function(){self.OnVideoMouseLeave(this, self)});
            //videoCard.addEventListener("play", function(){self.OnPlayVideo(this, self)});
            inputSelVid.addEventListener("change", function(){self.OnChangeVideo(this, self)});
            buttonIzdo.addEventListener("click", function(e){self.OnClickBtnIzdoVideo(e, this, self)});
            buttonDcho.addEventListener("click", function(e){self.OnClickBtnDchoVideo(e, this, self)});

            $("#contenedor_cartas_videos").append(divCard);
        }//else if
    }//CrearCarta

    function Inicializar()
    {
        //Carga de los datos del usuario conectado
        InsertarDatosUsuario(usuarioConectado);
        //Inicializaciones de los menús de las diferentes secciones de la página
        //Se marca la entrada de menú principal correspondiente a la gestión de usuarios
        $("#barra_nav li:first-child").css("background-color", colorFondoEntradaMenuPrincipalSeleccionado);
        //Se marca la entrada del menú de gestión de medios correspondiente a la gestión de textos
        $("#barra_nav_medios li:first-child").css("background-color", colorFondoEntradaMenuMediosSeleccionado);

        //Visualizaciones por defecto
        //Secciones principales - se visualiza por defecto la gestión de usuarios
        $("#usuarios_registrados").css("display", "block");
        $("#medios").css("display", "none");
        $("#tests").css("display", "none");
        $("#baterias").css("display", "none");
        $("#planes").css("display", "none");
        //Sección de medios - se visualiza por defecto la gestión de textos
        $("#textos").css("display", "block");
        $("#imagenes").css("display", "none");
        $("#videos").css("display", "none");
        $("#audios").css("display", "none");

        //Se ocultan inicialmente los botones de asignación de medios a tests
        $("#btn_adjuntar_texto").css("display", "none");
        $("#btn_adjuntar_imagen").css("display", "none");
        $("#btn_adjuntar_video").css("display", "none");
        $("#btn_adjuntar_audio").css("display", "none");

        //Se carga la tabla de usuarios
        Filtrar();
    }//Inicializar

    function DesactivarControles(elemento, activar)
    {
        switch (elemento)
        {
            case "textos":
                {
                    $("#texto_nombre").attr("readonly", activar);
                    $("#texto_descripcion").attr("readonly", activar);
                    $("#texto_contenido").attr("readonly", activar);
                    break;
                }
            case "audios":
                {
                    $("#audio_nombre").attr("readonly", activar);
                    $("#audio_descripcion").attr("readonly", activar);
                    break;
                }
        }//switch
    }//DesactivarControles

    function Filtrar()
    {
        var perfil, nombre, apellido;

        $("#USR_tabla tbody .USR_fila_registro_usuario").remove();

        //obtener el estado de los controles de filtrado
        //PERFIL
        if ($('#filtroPerfilAdministradores').prop('checked'))
        {
            perfil = 'ADMINISTRADOR';
        }//if
        else
        {
            perfil = 'ALUMNO';
        }//else
        //NOMBRE
        nombre = '%';
        //APELLIDO
        apellido = '%';

        $.ajax({
                method: "POST",
                url: pathPHP + "UsuariosController.php",
                data:   {   operacion: 'FILTRAR',
                            parametros: ['sss', perfil, nombre, apellido]
                        },
                success: function(respuesta)
                        {
                            //Extracción de los datos del JSON de respuesta en un array
                            var usuarios = JSON.parse(respuesta);
                            //Cargar la tabla de artículos con los resultados
                            CargarTabla("usuarios", usuarios);
                        },
                error: function(jqxhr, status, exception)
                        {
                            alert('Exception:', exception);
                        }
                });
    }//Filtrar

    function CargarTabla(tabla, datos)
    {
        //Borrar la tabla
        //Rellenar la tabla
        datos.forEach(function(registro){
            var tr = Factoria("tr", [["class", "USR_fila_registro_usuario"]], "");
            var td, ruta_foto;

            tr.addEventListener("click", OnClickTablaUsuarios);
            //ID
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_codigo"]], registro["USR_CODE"]));
            //FOTO
            /*
            Si existe un nombre para la foto del usuario se genera el path desde el repositorio de fotos
            */
            td = Factoria("td", [["class", "USR_col USR_col_foto"]], "");
            if (registro["USR_FOTO"] != "No foto")
            {
                ruta_foto = "../media/Usuarios/" + registro["USR_FOTO"];
                td.appendChild(Factoria("img", [["src", ruta_foto],
                                                ["class", "foto_usuario_inline"]], ""));
            }//if
            else
            {
                td.appendChild(Factoria("img", [["src", ""],
                                                ["class", "foto_usuario_inline"]], ""));
            }//else            
            tr.appendChild(td);
            //NOMBRE
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_nombre"]], registro["USR_NOMBRE"]));
            //APELLIDOS
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_apellidos"]], registro["USR_APELLIDOS"]));
            //NOMBRE DE USUARIO
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_usuario"]], registro["USR_NOMBRE_USUARIO"]));
            //EMAIL
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_email"]], registro["USR_EMAIL"]));
            //FECHA DE ALTA
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_fechaAlta"]], registro["USR_FECHA_ALTA"]));
            //DIRECCIÓN
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_direccion"]], registro["USR_DIRECCION"]));
            //CÓDIGO POSTAL
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_cp"]], registro["USR_CODIGO_POSTAL"]));
            //TELÉFONO
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_telefono"]], registro["USR_TELEFONO"]));
            //FECHA DE NACIMIENTO
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_fechaNac"]], registro["USR_FECHA_NACIMIENTO"]));
            //NOMBRE DEL ARCHIVO DE FOTO
            tr.appendChild(Factoria("td", [["class", "USR_col USR_col_fotoArchivo"]], registro["USR_FOTO"]));
            //BOTÓN DE EDICIÓN
            var td = tr.appendChild(Factoria("td", [["class", "USR_col USR_col_btn_editar"]], ""));
                botonEditar = Factoria("button",    [["type", "button"],
                                                    /*["id", "btn_editar_usuario"],*/
                                                    ["class", "btn btn-primary"]], "Editar");
                botonEditar.addEventListener("click", OnClickEditarUsuario);
                td.appendChild(botonEditar);                         
            //BOTÓN DE ELIMINACIÓN
            td = tr.appendChild(Factoria("td", [["class", "USR_col USR_col_btn_eliminar"]], ""));
                botonEliminar = Factoria("button",  [["type", "button"],
                                                    /*["id", "btn_eliminar_usuario"],*/
                                                    ["class", "btn btn-dark btn_eliminar_usuario"]], "Eliminar");
                botonEliminar.addEventListener("click", OnClickEliminarUsuario);
                td.appendChild(botonEliminar);

            $("#USR_tabla").append(tr);

            //La columna con el nombre del archivo de la foto no se muestra
            $("#USR_col_enc_fotoArchivo").css("display", "none");
            $(".USR_col_fotoArchivo").css("display", "none");
        })
    }//CargarTabla

    function SeleccionarFilaTabla(tabla, campos)
    {
        switch (tabla)
        {
            case "usuarios":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#USR_tabla tbody td').css({  'color': colorTextoFilaNormal,
                                                    'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    usuarioActual = [];

                    for (let cont = 0; cont < campos.length - 2; cont++)
                    {
                        //Se resalta la fila seleccionada
                        $(campos[cont]).css({   'color': colorTextoFilaResaltada,
                                                'background-color': colorFondoFilaResaltada});
                        usuarioActual.push($(campos[cont]).text());
                    }//for
                    break;
                }
            case "textos":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#tabla_textos tbody td').css({   'color': colorTextoFilaNormal,
                                                        'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    textoActual = [];

                    for (let cont = 0; cont < campos.length - 2; cont++)
                    {
                    //Se resalta la fila seleccionada
                    $(campos[cont]).css({   'color': colorTextoFilaResaltada,
                                            'background-color': colorFondoFilaResaltada});
                    textoActual.push($(campos[cont]).text());
                    }//for
                    CargarControles("textos");
                    break;
                }
            case "audios":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#tabla_audios tbody td').css({   'color': colorTextoFilaNormal,
                                                        'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    audioActual = [];

                    for (let cont = 0; cont < campos.length - 2; cont++)
                    {
                    //Se resalta la fila seleccionada
                    $(campos[cont]).css({   'color': colorTextoFilaResaltada,
                                            'background-color': colorFondoFilaResaltada});
                    audioActual.push($(campos[cont]).text());
                    }//for
                    //CargarControles("audios");
                    break;
                }
            case "tests":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#tabla_tests tbody td').css({    'color': colorTextoFilaNormal,
                                                        'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    testActual = [];

                    for (let cont = 0; cont < campos.length - 2; cont++)
                    {
                    //Se resalta la fila seleccionada
                    $(campos[cont]).css({   'color': colorTextoFilaResaltada,
                                            'background-color': colorFondoFilaResaltada});
                    testActual.push($(campos[cont]).text());
                    }//for
                    CargarControles("test");
                    break;
                }
        }//switch
    }//SeleccionarFilaTabla

    function SeleccionarFilaTablaCodigo(tabla, codigo)
    {
        switch (tabla)
        {
            case "textos":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#tabla_textos tbody td').css({   'color': colorTextoFilaNormal,
                                                        'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    textoActual = [];

                    var coleccion = $("#tabla_textos tbody tr");
                    for (let cont = 1; cont < coleccion.length; cont++)
                    {
                        if (coleccion[cont].children[0].innerText == codigo)
                        {
                            for (let celdas = 0; celdas < coleccion[cont].children.length - 2; celdas++)
                            {
                                //Se resalta la fila seleccionada
                                $(coleccion[cont].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                            'background-color': colorFondoFilaResaltada});
                                textoActual.push($(coleccion[cont].children[celdas]).text());
                            }//for
                        }//if
                    }//for
                    break;
                }
            case "audios":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#tabla_audios tbody td').css({   'color': colorTextoFilaNormal,
                                                        'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    audioActual = [];

                    var coleccion = $("#tabla_audios tbody tr");
                    for (let cont = 1; cont < coleccion.length; cont++)
                    {
                        if (coleccion[cont].children[0].innerText == codigo)
                        {
                            for (let celdas = 0; celdas < coleccion[cont].children.length - 2; celdas++)
                            {
                                //Se resalta la fila seleccionada
                                $(coleccion[cont].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                            'background-color': colorFondoFilaResaltada});
                                audioActual.push($(coleccion[cont].children[celdas]).text());
                            }//for
                        }//if
                    }//for
                    break;
                }
            case "tests":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#tabla_tests tbody td').css({    'color': colorTextoFilaNormal,
                                                        'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    testActual = [];

                    var coleccion = $("#tabla_tests tbody tr");
                    for (let cont = 1; cont < coleccion.length; cont++)
                    {
                        if (coleccion[cont].children[0].innerText == codigo)
                        {
                            for (let celdas = 0; celdas < coleccion[cont].children.length - 2; celdas++)
                            {
                                //Se resalta la fila seleccionada
                                $(coleccion[cont].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                            'background-color': colorFondoFilaResaltada});
                                testActual.push($(coleccion[cont].children[celdas]).text());
                            }//for
                        }//if
                    }//for
                    CargarControles("test");
                    break;
                }
            case "alumnos":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#PF_tabla_alumnos td').css({ 'color': colorTextoFilaNormal,
                                                    'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    alumnoActual = [];

                    var coleccion = $("#PF_tabla_alumnos tr");
                    for (let cont = 1; cont < coleccion.length; cont++)
                    {
                        if (coleccion[cont].children[0].innerText == codigo)
                        {
                            for (let celdas = 0; celdas < coleccion[cont].children.length - 1; celdas++)
                            {
                                //Se resalta la fila seleccionada
                                $(coleccion[cont].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                            'background-color': colorFondoFilaResaltada});
                                alumnoActual.push($(coleccion[cont].children[celdas]).text());
                            }//for
                        }//if
                    }//for
                    break;
                }
        }//switch
    }//SeleccionarFilaTablaCodigo

    function SeleccionarFilaTablaPosicion(tabla, pos)
    {
        switch (tabla)
        {
            case "textos":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#tabla_textos tbody td').css({   'color': colorTextoFilaNormal,
                                                        'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la marca seleccionada
                    textoActual = [];

                    var coleccion = $("#tabla_textos tbody tr");
                    for (let cont = 0; cont < coleccion[pos].children.length - 2; cont++)
                    {
                        //Se resalta la fila seleccionada
                        $(coleccion[pos].children[cont]).css({  'color': colorTextoFilaResaltada,
                                                                'background-color': colorFondoFilaResaltada});
                        textoActual.push($(coleccion[pos].children[cont]).text());
                    }//for
                    CargarControles("textos");
                    break;
                }
            case "audios":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#tabla_audios tbody td').css({   'color': colorTextoFilaNormal,
                                                        'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la marca seleccionada
                    audioActual = [];

                    var coleccion = $("#tabla_audios tbody tr");
                    for (let cont = 0; cont < coleccion[pos].children.length - 2; cont++)
                    {
                        //Se resalta la fila seleccionada
                        $(coleccion[pos].children[cont]).css({  'color': colorTextoFilaResaltada,
                                                                'background-color': colorFondoFilaResaltada});
                        audioActual.push($(coleccion[pos].children[cont]).text());
                    }//for
                    //CargarControles("audios");
                    break;
                }
            case "tests":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#tabla_tests tbody td').css({   'color': colorTextoFilaNormal,
                                                       'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la marca seleccionada
                    testActual = [];

                    var coleccion = $("#tabla_tests tbody tr");
                    for (let cont = 0; cont < coleccion[pos].children.length - 2; cont++)
                    {
                        //Se resalta la fila seleccionada
                        $(coleccion[pos].children[cont]).css({  'color': colorTextoFilaResaltada,
                                                                'background-color': colorFondoFilaResaltada});
                        testActual.push($(coleccion[pos].children[cont]).text());
                    }//for
                    CargarControles("test");
                    break;
                }
            case "alumnos":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#PF_tabla_alumnos td').css({ 'color': colorTextoFilaNormal,
                                                    'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    alumnoActual = [];

                    var coleccion = $("#PF_tabla_alumnos tr");
                    for (let cont = 0; cont < coleccion[pos].children.length - 1; cont++)
                    {
                        //Se resalta la fila seleccionada
                        $(coleccion[pos].children[cont]).css({  'color': colorTextoFilaResaltada,
                                                                'background-color': colorFondoFilaResaltada});
                        alumnoActual.push($(coleccion[pos].children[cont]).text());
                    }//for
                    //Se elimina cualquier tabla de asignación de baterías de tests previa y se crea con las asignaciones para el alumno actual
                    $("#TA_contenedor_tabla").remove();
                    $("#contenedor_planes").append(CrearTablaAsignaciones(alumnoActual[0]));
                    break;
                }
        }//switch        
    }//SeleccionarFilaTablaPosicion

    function FiltrarMedia(tipo)
    {
        var op, param, tabla;

        switch (tipo)
        {
            case 'TEXTO':
                {
                    op = "FILTRAR_TEXTOS";
                    param = ['s', 'TEXTO'];
                    tabla = 'textos';
                    break;
                }
            case 'IMAGEN':
                {
                    op = "FILTRAR_IMAGENES";
                    param = ['s', 'IMAGEN'];
                    tabla = 'imágenes';
                    break;
                }
            case 'VIDEO':
                {
                    op = "FILTRAR_VIDEOS";
                    param = ['s', 'VIDEO'];
                    tabla = 'vídeos';
                    break;
                }
            case 'AUDIO':
                {
                    op = "FILTRAR_AUDIOS";
                    param = ['s', 'AUDIO'];
                    tabla = 'audios';
                    break;
                }
        }//switch

        $.ajax({
            method: "POST",
            url: pathPHP + "MediosController.php",
            data:   {   operacion: op,
                        parametros: param
                    },
            success: function(respuesta)
                    {
                        //Extracción de los datos del JSON de respuesta en un array
                        var mediosObtenidos = JSON.parse(respuesta);
                        if (mediosObtenidos.length == 0)
                        {
                            return;
                        }//if
                        //Cargar la tabla de medios correspondiente
                        switch (tabla)
                        {
                            case 'textos':
                                {
                                    CargarTablaTextos(mediosObtenidos);
                                    SeleccionarFilaTablaPosicion("textos", 1);
                                    break;
                                }
                            case 'imágenes':
                                {
                                    CrearColeccionImagenes(mediosObtenidos);
                                    break;
                                }
                            case 'vídeos':
                                {
                                    CrearColeccionVideos(mediosObtenidos);
                                    break;
                                }
                            case 'audios':
                                {
                                    CargarTablaAudios(mediosObtenidos);
                                    SeleccionarFilaTablaPosicion("audios", 1);
                                    break;
                                }
                        }//switch
                    },
            error: function(jqxhr, status, exception)
                    {
                        alert('Exception:', exception);
                    }
            });

        //$("#tabla_usuarios tbody .fila_registro_usuario").remove();
    }//FiltrarMedia

    function FiltrarTests()
    {
        var op = "FILTRAR_TESTS";
        var param = ['i', '1'];

        $.ajax({
            method: "POST",
            url: pathPHP + "MediosController.php",
            data:   {   operacion: op,
                        parametros: param
                    },
            success: function(respuesta)
                    {
                        //Extracción de los datos del JSON de respuesta en un array
                        var testsObtenidos = JSON.parse(respuesta);
                        //Cargar la tabla de tests
                        CargarTablaTests(testsObtenidos);
                        if (testsObtenidos)
                        {
                            SeleccionarFilaTablaPosicion("tests", 1);
                        }//if
                    },
            error: function(jqxhr, status, exception)
                    {
                        alert('Exception:', exception);
                    }
            });
    }//FiltrarTests

    function CargarControles(elemento)
    {
        switch (elemento)
        {
            case "textos":
                {
                    if (textoActual.length == 0)
                    {
                        //Se limpian los controles
                        $("#texto_nombre").val("");
                        $("#texto_descripcion").val("");
                        $("#texto_contenido").val("");
                    }//if
                    else
                    {
                        $("#texto_nombre").val(textoActual[1]);
                        $("#texto_descripcion").val(textoActual[2]);

                        $.ajax({
                            method: "POST",
                            url: pathPHP + "MediosController.php",
                            data:   {   operacion: 'FILTRAR_CONTENIDO',
                                        parametros: ['s', textoActual[0]]
                                    },
                            success: function(respuesta)
                                    {
                                        //Extracción de los datos del JSON de respuesta en un array
                                        var usuarios = JSON.parse(respuesta);
                                        $("#texto_contenido").val(usuarios[0]["MD_VALOR"]);
                                    },
                            error: function(jqxhr, status, exception)
                                    {
                                        alert('Exception:', exception);
                                    }
                            });
                    }//else
                    break;
                }
            case "audios":
                {
                    $("#audio_nombre").val(audioActual[1]);
                    $("#audio_descripcion").val(audioActual[2]);

                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: 'FILTRAR_CONTENIDO',
                                    parametros: ['s', audioActual[0]]
                                },
                        success: function(respuesta)
                                {
                                    //Extracción de los datos del JSON de respuesta en un array
                                    var audios = JSON.parse(respuesta);
                                    $("#audio_contenido").val(audios[0]["MD_VALOR"]);
                                },
                        error: function(jqxhr, status, exception)
                                {
                                    alert('Exception:', exception);
                                }
                        });

                    break;
                }
            case "test":
                {
                    $("#contenedor_test #test_denominacion").val(testActual[1]);

                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: 'FILTRAR_CONTENIDO_TEST',
                                    parametros: ['s', testActual[0]]
                                },
                        success: function(respuesta)
                                {
                                    //Extracción de los datos del JSON de respuesta en un array
                                    var test = JSON.parse(respuesta);

                                    $("#contenedor_test #test_descripcion").val(test[0]["TS_DESCRIPCION"]);
                                    $("#contenedor_encabezado #texto_test").val(test[0]["TS_ENUNCIADO"]);
                                    $("#contenedor_opciones #test_opcion1").val(test[0]["TS_OP1_TXT"]);
                                    $("#contenedor_opciones #test_opcion2").val(test[0]["TS_OP2_TXT"]);
                                    $("#contenedor_opciones #test_opcion3").val(test[0]["TS_OP3_TXT"]);
                                    $("#contenedor_opciones #test_opcion4").val(test[0]["TS_OP4_TXT"]);
                                    $("#contenedor_opciones input:radio[id = opcion" + test[0]["TS_RESPUESTA"] + "]").prop("checked", true);

                                    //CARGA DE LA IMAGEN DE LA OPCIÓN 1
                                    //Se elimina cualquier imagen previa
                                    $("#contenedor_opciones #imagen_opcion1").attr("src", "");
                                    if (test[0]["TS_OP1_IMG"] != null)
                                    {
                                        $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'OBTENER_IMAGEN_OPCION',
                                                        parametros: ['s', test[0]["TS_OP1_IMG"]]
                                                    },
                                            success: function(respuesta)
                                                    {
                                                        //Extracción de los datos del JSON de respuesta en un array
                                                        var imgopc = JSON.parse(respuesta);
                    
                                                        $("#contenedor_opciones #imagen_opcion1").attr("src", "../media/Tests/" + imgopc[0]["IOT_RUTA"]);
                                                    },
                                            error: function(jqxhr, status, exception)
                                                    {
                                                        alert('Exception:', exception);
                                                    }
                                            });
                                    }//if
                                    //CARGA DE LA IMAGEN DE LA OPCIÓN 2
                                    //Se elimina cualquier imagen previa
                                    $("#contenedor_opciones #imagen_opcion2").attr("src", "");
                                    if (test[0]["TS_OP2_IMG"] != null)
                                    {
                                        $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'OBTENER_IMAGEN_OPCION',
                                                        parametros: ['s', test[0]["TS_OP2_IMG"]]
                                                    },
                                            success: function(respuesta)
                                                    {
                                                        //Extracción de los datos del JSON de respuesta en un array
                                                        var imgopc = JSON.parse(respuesta);
                    
                                                        $("#contenedor_opciones #imagen_opcion2").attr("src", "../media/Tests/" + imgopc[0]["IOT_RUTA"]);
                                                    },
                                            error: function(jqxhr, status, exception)
                                                    {
                                                        alert('Exception:', exception);
                                                    }
                                            });
                                    }//if
                                    //CARGA DE LA IMAGEN DE LA OPCIÓN 3
                                    //Se elimina cualquier imagen previa
                                    $("#contenedor_opciones #imagen_opcion3").attr("src", "");
                                    if (test[0]["TS_OP3_IMG"] != null)
                                    {
                                        $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'OBTENER_IMAGEN_OPCION',
                                                        parametros: ['s', test[0]["TS_OP3_IMG"]]
                                                    },
                                            success: function(respuesta)
                                                    {
                                                        //Extracción de los datos del JSON de respuesta en un array
                                                        var imgopc = JSON.parse(respuesta);
                    
                                                        $("#contenedor_opciones #imagen_opcion3").attr("src", "../media/Tests/" + imgopc[0]["IOT_RUTA"]);
                                                    },
                                            error: function(jqxhr, status, exception)
                                                    {
                                                        alert('Exception:', exception);
                                                    }
                                            });
                                    }//if
                                    //CARGA DE LA IMAGEN DE LA OPCIÓN 4
                                    //Se elimina cualquier imagen previa
                                    $("#contenedor_opciones #imagen_opcion4").attr("src", "");
                                    if (test[0]["TS_OP4_IMG"] != null)
                                    {
                                        $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'OBTENER_IMAGEN_OPCION',
                                                        parametros: ['s', test[0]["TS_OP4_IMG"]]
                                                    },
                                            success: function(respuesta)
                                                    {
                                                        //Extracción de los datos del JSON de respuesta en un array
                                                        var imgopc = JSON.parse(respuesta);
                    
                                                        $("#contenedor_opciones #imagen_opcion4").attr("src", "../media/Tests/" + imgopc[0]["IOT_RUTA"]);
                                                    },
                                            error: function(jqxhr, status, exception)
                                                    {
                                                        alert('Exception:', exception);
                                                    }
                                            });
                                    }//if

                                    if (modoTest == "NAVEGACIÓN")
                                    {
                                        $("#contenedor_test #test_denominacion").prop("readonly", true);
                                        $("#contenedor_test #test_descripcion").prop("readonly", true);
                                        $("#contenedor_encabezado #texto_test").prop("readonly", true);
                                        $("#contenedor_encabezado #btn_insertar_elemento").css("visibility", "hidden");

                                        $("#contenedor_opciones #test_opcion1").prop("readonly", true);
                                        $("#contenedor_opciones #test_opcion2").prop("readonly", true);
                                        $("#contenedor_opciones #test_opcion3").prop("readonly", true);
                                        $("#contenedor_opciones #test_opcion4").prop("readonly", true);

                                        $(".contenedor_radio_opcion input:radio").prop("disabled", true);

                                        $(".mini_barra_herramientas_opcion").css("display", "none");
                                    }//if

                                    //CARGA DE LOS ELEMENTOS DEL ENCABEZADO
                                    $.ajax({
                                        method: "POST",
                                        url: pathPHP + "MediosController.php",
                                        data:   {   operacion: 'FILTRAR_CONTENIDO_ENCABEZADO',
                                                    parametros: ['s', testActual[0]]
                                                },
                                        success: function(respuesta)
                                                {
                                                    //Extracción de los datos del JSON de respuesta en un array
                                                    var encabezado = JSON.parse(respuesta);
                                                    
                                                    //Se elimina cualquier conjunto de encabezados previos
                                                    $(".contenedor_elemento_encabezado").remove();

                                                    encabezado.forEach(function(elemento){
                                                        var contenedorElementoEncabezado;
                                                        if (modoTest == "NAVEGACIÓN")
                                                        {
                                                            contenedorElementoEncabezado = InsertarElementoEncabezado(false);
                                                        }//if
                                                        else
                                                        {
                                                            contenedorElementoEncabezado = InsertarElementoEncabezado(true);
                                                        }//else

                                                        var medioAdjunto = Factoria("div", [["class", "contenedor_medio"],["id", "contenedor_medio"]], "");
                                                        var medioCodigo, medioContenido, cont;

                                                        switch (elemento["MD_TIPO"])
                                                        {
                                                            case "TEXTO":
                                                                {
                                                                    medioCodigo = Factoria("input", [["type", "hidden"],["id", "medio_texto_codigo"]], elemento["MD_CODE"]);
                                                                    medioAdjunto.appendChild(medioCodigo);
                                                                    medioContenido = Factoria("p", [["class", "col-12 medio_texto"],["id", "medio_texto"]], elemento["MD_VALOR"]);
                                                                    medioAdjunto.appendChild(medioContenido);
                                                                    break;
                                                                }
                                                            case "IMAGEN":
                                                                {
                                                                    medioCodigo = Factoria("input", [["type", "hidden"],["id", "medio_imagen_codigo"]], elemento["MD_CODE"]);
                                                                    medioAdjunto.appendChild(medioCodigo);
                                                                    cont = Factoria("div", [["class", "col-12 posicionador"]], "");
                                                                        medioContenido = Factoria("img", [["src", "../media/Imagenes/" + elemento["MD_RUTA"]],["class", "foto"],["id", "visor_imagen_card"],["alt", ""]], "");                                                                    
                                                                        cont.appendChild(medioContenido);
                                                                    medioAdjunto.appendChild(cont);
                                                                    break;
                                                                }
                                                            case "VIDEO":
                                                                {
                                                                    medioCodigo = Factoria("input", [["type", "hidden"],["id", "medio_video_codigo"]], elemento["MD_CODE"]);
                                                                    medioAdjunto.appendChild(medioCodigo);
                                                                    cont = Factoria("div", [["class", "col-12 posicionador"]], "");
                                                                        medioContenido = Factoria("video", [["src", "../media/Videos/" + elemento["MD_RUTA"]],["controls", "true"],["preload", "metadata"],["class", "foto"],["id", "visor_video_card"],["alt", ""]], "");
                                                                        cont.appendChild(medioContenido);
                                                                    medioAdjunto.appendChild(cont);
                                                                    break;
                                                                }
                                                            case "AUDIO":
                                                                {
                                                                    medioCodigo = Factoria("input", [["type", "hidden"],["id", "medio_audio_codigo"]], elemento["MD_CODE"]);
                                                                    medioAdjunto.appendChild(medioCodigo);
                                                                    medioContenido = Factoria("audio", [["src", "../media/Audio/" + elemento["MD_RUTA"]],["controls", "true"],["class", "col-12"],["id", "audio_player"],["alt", ""]], "");
                                                                    medioAdjunto.appendChild(medioContenido);
                                                                    break;
                                                                }
                                                        }//switch

                                                        $(contenedorElementoEncabezado).append(medioAdjunto);
                                                    })
                                                },
                                        error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });
                                },
                        error: function(jqxhr, status, exception)
                                {
                                    alert('Exception:', exception);
                                }
                        });

                    break;
                }
        }//switch
    }//CargarControles

    function CargarTablaTests(recordset)
    {
        //Rellenar la tabla
        recordset.forEach(function(registro){
        NuevaFilaTest(registro);
        })       
    }//CargarTablaTests

    function CargarTablaTextos(recordset)
    {
        //Borrar la tabla
        //Rellenar la tabla
        recordset.forEach(function(registro){
        NuevaFilaTexto(registro);
        })       
    }//CargarTablaTextos

    function CargarTablaAudios(recordset)
    {
        //Borrar la tabla
        //Rellenar la tabla
        recordset.forEach(function(registro){
        NuevaFilaAudio(registro);
        })       
    }//CargarTablaAudios

    function NuevaFilaTest(datos)
    {
        var tr = Factoria("tr", [["class", "fila_registro_test"]], "");
            
        tr.addEventListener("click", OnClickTablaTests);
        //ID
        tr.appendChild(Factoria("td", [["class", "tabla_tests_col tabla_tests_col_codigo"]], datos["TS_CODE"]));
        //DENOMINACIÓN
        tr.appendChild(Factoria("td", [["class", "tabla_tests_col tabla_tests_col_nombre"]], datos["TS_DENOMINACION"]));
        //BOTÓN DE EDICIÓN
        var td = tr.appendChild(Factoria("td", [["class", "tabla_tests_col tabla_tests_col_btn_editar"]], ""));
            botonEditarTest = Factoria("button",    [["type", "button"],
                                                    ["class", "btn btn-primary"]], "Editar");
            botonEditarTest.addEventListener("click", function(e){OnClickEditarTest(e);});
            td.appendChild(botonEditarTest);
        //BOTÓN DE ELIMINACIÓN
        var td = tr.appendChild(Factoria("td", [["class", "tabla_tests_col tabla_tests_col_btn_eliminar"]], ""));
            botonEliminarTest = Factoria("button",  [["type", "button"],
                                                    ["class", "btn btn-dark btn_eliminar_test"]], "Eliminar");
            botonEliminarTest.addEventListener("click", OnClickEliminarTest);
            td.appendChild(botonEliminarTest);

        $("#tabla_tests").append(tr);        
    }//NuevaFilaTest

    function NuevaFilaTexto(datos)
    {
        var tr = Factoria("tr", [["class", "fila_registro_texto"]], "");
            
        tr.addEventListener("click", OnClickTablaTextos);
        //ID
        tr.appendChild(Factoria("td", [["class", "tabla_textos_col tabla_textos_col_codigo"]], datos["MD_CODE"]));
        //DENOMINACIÓN
        tr.appendChild(Factoria("td", [["class", "tabla_textos_col tabla_textos_col_nombre"]], datos["MD_DENOMINACION"]));
        //DESCRIPCIÓN
        tr.appendChild(Factoria("td", [["class", "tabla_textos_col tabla_textos_col_descripcion"]], datos["MD_DESCRIPCION"]));
        //BOTÓN DE EDICIÓN
        var td = tr.appendChild(Factoria("td", [["class", "tabla_textos_col tabla_textos_col_btn_editar"]], ""));
            botonEditar = Factoria("button",    [["type", "button"],
                                                ["class", "btn btn-primary"]], "Editar");
            botonEditar.addEventListener("click", function(e){OnClickEditarTexto(e)});
            td.appendChild(botonEditar);                                                 
        //BOTÓN DE ELIMINACIÓN
        td = tr.appendChild(Factoria("td", [["class", "tabla_textos_col tabla_textos_col_btn_eliminar"]], ""));
            botonEliminar = Factoria("button",  [["type", "button"],
                                                ["class", "btn btn-dark btn_eliminar_texto"]], "Eliminar");
            botonEliminar.addEventListener("click", function(e){OnClickEliminarTexto(e)});
            td.appendChild(botonEliminar);

        $("#tabla_textos").append(tr);
    }//NuevaFilaTexto

    function NuevaFilaAudio(datos)
    {
        var tr = Factoria("tr", [["class", "fila_registro_audio"]], "");
            
        tr.addEventListener("click", OnClickTablaAudios);
        //ID
            tr.appendChild(Factoria("td", [["class", "tabla_audios_col tabla_audios_col_codigo"]], datos["MD_CODE"]));
        //DENOMINACIÓN
            var celdaNombre = Factoria("td", [["class", "tabla_audios_col tabla_audios_col_nombre"]], datos["MD_DENOMINACION"]);
                /*var editableNombre = Factoria("input", [["type", "text"],
                                                        ["name", "audio_denominacion"],
                                                        ["id", "audio_denominacion"],
                                                        ["class", "row col-12 audio_denominacion"]], "");
        
                celdaNombre.appendChild(editableNombre);*/
            tr.appendChild(celdaNombre);
        //DESCRIPCIÓN
            var celdaDescripcion = Factoria("td", [["class", "tabla_audios_col tabla_audios_col_descripcion"]], datos["MD_DESCRIPCION"]);
                /*var editableDescripcion = Factoria("input",[["type", "text"],
                                                            ["name", "audio_descripcion"],
                                                            ["id", "audio_descripcion"],
                                                            ["class", "row col-12 audio_descripcion"]], "");
        
                celdaDescripcion.appendChild(editableDescripcion);*/
            tr.appendChild(celdaDescripcion);
        //PLAYER
            var audio = "../media/Audio/" + datos["MD_RUTA"];
            var celdaPlayer = Factoria("td", [["class", "tabla_audios_col tabla_audios_col_player"]], "");
                var audioControl = Factoria("audio",   [["src", audio],
                                                        ["controls", "true"],
                                                        ["id", "audio_player"],
                                                        ["class", "audio_player"],
                                                        ["alt", ""]], "");
                audioControl.addEventListener("play", function(){OnClickAudioPlayer(this)});
                audioControl.addEventListener("pause", function(){OnPausedAudioPlayer(this)});
                audioControl.addEventListener("ended", function(){OnEndedAudioPlayer(this)});
                celdaPlayer.appendChild(audioControl);
                //SELECTOR ARCHIVO AUDIO
                var inputSelAud = Factoria("input",[["type", "file"],
                                                    ["name", "audio_file"],
                                                    ["id", "audio_file"],
                                                    ["class", "audio_file"]], datos["MD_RUTA"]);
                $(inputSelAud).css("display", "none");
                inputSelAud.addEventListener("change", function(){OnChangeAudio(this)});
                celdaPlayer.appendChild(inputSelAud);
            tr.appendChild(celdaPlayer);
        //BOTÓN IZQUIERDO
            var td = tr.appendChild(Factoria("td", [["class", "tabla_audios_col tabla_audios_col_btn_izdo"]], ""));
                botonIzdo = Factoria("button",  [["type", "button"],
                                                ["class", "btn btn-primary"]], "Editar");
                botonIzdo.addEventListener("click", function(e){OnClickBtnIzdoAudio(e);});   
                td.appendChild(botonIzdo);                              
        //BOTÓN DERECHO
            var td = tr.appendChild(Factoria("td", [["class", "tabla_audios_col tabla_audios_col_btn_dcho"]], ""));
                botonDcho = Factoria("button",  [["type", "button"],
                                                ["class", "btn btn-dark btn_eliminar_audio"]], "Eliminar");
                botonDcho.addEventListener("click", function(e){OnClickBtnDchoAudio(e);});   
                td.appendChild(botonDcho);

        $("#tabla_audios").append(tr);
    }//NuevaFilaAudio

    function InsertarFilaAudioInsercion()
    {
        var tr = Factoria("tr", [["class", "fila_registro_audio"]], "");
            
        tr.addEventListener("click", OnClickTablaAudios);
        //ID
            tr.appendChild(Factoria("td", [["class", "tabla_audios_col tabla_audios_col_codigo"]], ""));
        //DENOMINACIÓN
            var celdaNombre = Factoria("td", [["class", "tabla_audios_col tabla_audios_col_nombre"]], "");
                var editableNombre = Factoria("input", [["type", "text"],
                                                        ["name", "audio_denominacion"],
                                                        ["id", "audio_denominacion"],
                                                        ["class", "row col-12 audio_denominacion"]], "");
            
                celdaNombre.appendChild(editableNombre);
            tr.appendChild(celdaNombre);
        //DESCRIPCIÓN
            var celdaDescripcion = Factoria("td", [["class", "tabla_audios_col tabla_audios_col_descripcion"]], "");
                var editableDescripcion = Factoria("input", [["type", "text"],
                                                            ["name", "audio_descripcion"],
                                                            ["id", "audio_descripcion"],
                                                            ["class", "row col-12 audio_descripcion"]], "");
            
                celdaDescripcion.appendChild(editableDescripcion);
            tr.appendChild(celdaDescripcion);
        //PLAYER
            var audio = "";
            var celdaPlayer = Factoria("td", [["class", "tabla_audios_col tabla_audios_col_player"]], "");
                var audioControl = Factoria("audio",   [["src", audio],
                                                        ["controls", "true"],
                                                        ["id", "audio_player"],
                                                        ["class", "audio_player"],
                                                        ["alt", ""]], "");
                audioControl.addEventListener("play", function(){OnClickAudioPlayer(this)});
                audioControl.addEventListener("pause", function(){OnPausedAudioPlayer(this)});
                audioControl.addEventListener("ended", function(){OnEndedAudioPlayer(this)});
                celdaPlayer.appendChild(audioControl);
                //SELECTOR ARCHIVO AUDIO
                var inputSelAud = Factoria("input",[["type", "file"],
                                                    ["name", "audio_file"],
                                                    ["id", "audio_file"],
                                                    ["class", "audio_file"]], "");
                inputSelAud.addEventListener("change", function(){OnChangeAudio(this)});
                celdaPlayer.appendChild(inputSelAud);
            tr.appendChild(celdaPlayer);
        //BOTÓN IZQUIERDO
        var td = tr.appendChild(Factoria("td", [["class", "tabla_audios_col tabla_audios_col_btn_izdo"]], ""));
            botonIzdo = Factoria("button",  [["type", "button"],
                                            ["class", "btn btn-primary"]], "Insertar");
            botonIzdo.addEventListener("click", function(e){OnClickBtnIzdoAudio(e);});     
            td.appendChild(botonIzdo);                         
        //BOTÓN DERECHO
        var td = tr.appendChild(Factoria("td", [["class", "tabla_audios_col tabla_audios_col_btn_dcho"]], ""));
            botonDcho = Factoria("button",  [["type", "button"],
                                            ["class", "btn btn-dark btn_eliminar_audio"]], "Cancelar");
            botonDcho.addEventListener("click", function(e){OnClickBtnDchoAudio(e);});
            td.appendChild(botonDcho);

        $("#tabla_audios").append(tr);
    }//InsertarFilaAudioInsercion

    function EstablecerModoTrabajo(modo)
    {
        //Se cambia el modo de trabajo
        modoTrabajo = modo;
        switch(modo)
        {
            case 'NAVEGACIÓN':
                {
                    //Se activa el menú principal
                    $("#barra_nav").removeClass("desactivar");
                    //Se activa el menú secundario
                    $("#barra_nav_medios").removeClass("desactivar");

                    if (areaTrabajo == "TEXTOS")
                    {
                        //Se cambia el aspecto de la tabla de textos para indicar que está operativa
                        $("#tabla_textos_contenedor").removeClass("desactivar");
                        //Se deshabilita la edición de los controles del formulario de textos
                        DesactivarControles("textos", true);
                        //Se cambia el texto del botón de insertar
                        $("#btn_insertar_texto").text("Añadir nuevo texto");
                        //Se oculta el botón de cancelar
                        $("#btn_cancelar_insertar_texto").css("display", "none");
                        //Se selecciona el texto actual
                        CargarControles("textos");
                    }//if  
                    else if (areaTrabajo == "IMÁGENES")
                    {
                        //Se habilitan las cartas
                        $("#contenedor_cartas_imagenes").children().removeClass("desactivar");
                        //Se cambia el texto del botón de insertar
                        $("#btn_insertar_imagen").text("Añadir nueva imagen");
                    }//else if
                    else if (areaTrabajo == "VÍDEOS")
                    {
                        //Se habilitan las cartas
                        $("#contenedor_cartas").children().removeClass("desactivar");
                        //Se cambia el texto del botón de insertar
                        $("#btn_insertar_video").text("Añadir nuevo vídeo");
                    }//else if
                    else if (areaTrabajo == "AUDIOS")
                    {
                        //Se cambia el texto del botón de insertar
                        $("#btn_insertar_audio").text("Añadir nuevo audio");

                        var coleccion = $("#tabla_audios tbody tr");
                        for (let cont = 1; cont < coleccion.length; cont++)
                        {
                            if (coleccion[cont].children[0].innerText == audioActual[0])
                            {
                                //DENOMINACIÓN
                                $(coleccion[cont].children[1]).text(audioActual[1]);
                                //DESCRIPCIÓN
                                $(coleccion[cont].children[2]).text(audioActual[2]);
                                //PLAYER
                                var audio = "../media/Audio/" + audioActual[3];
                                $($(coleccion[cont].children[3]).children("audio")).attr("src", audio);
                                //SELECTOR ARCHIVO AUDIO
                                $($(coleccion[cont].children[3]).children("input")).text(audioActual[3]);
                                $($(coleccion[cont].children[3]).children("input")).css("display", "none");
                                //Se cambia el texto de los botones
                                $($(coleccion[cont].children[4]).children("button")).text("Editar");
                                $($(coleccion[cont].children[5]).children("button")).text("Eliminar");
                            }//if
                            else
                            {
                                //Se activa la fila
                                $(coleccion[cont]).removeClass("desactivar");
                                //Se habilitan los botones
                                $($(coleccion[cont].children[4]).children("button")).prop("disabled", false);
                                $($(coleccion[cont].children[5]).children("button")).prop("disabled", false);
                            }//else
                        }//for
                        //Se selecciona la fila recién inserta
                        SeleccionarFilaTablaCodigo("audios", audioActual[0]);
                    }//else if  
                    break;
                }
            case 'INSERCIÓN':
                {
                    //Se desactiva el menú principal
                    $("#barra_nav").addClass("desactivar");
                    //Se desactiva el menú secundario
                    $("#barra_nav_medios").addClass("desactivar");

                    if (areaTrabajo == "TEXTOS")
                    {
                        //Se cambia el aspecto de la tabla de textos para indicar que no está operativa
                        $("#tabla_textos_contenedor").addClass("desactivar");
                        //Se habilita la edición de los controles del formulario de textos
                        DesactivarControles("textos", false);
                        //Se cambia el texto del botón de insertar
                        $("#btn_insertar_texto").text("Insertar nuevo texto");
                        //Se muestra el botón de cancelación de la inserción de nuevo texto
                        $("#btn_cancelar_insertar_texto").css("display", "block");
                        //Se limpian los controles
                        $("#texto_nombre").val("");
                        $("#texto_descripcion").val("");
                        $("#texto_contenido").val("");
                    }//if
                    else if (areaTrabajo == "IMÁGENES")
                    {
                        //Se desactivan todas las cartas existentes
                        $("#contenedor_cartas_imagenes").children().addClass("desactivar");
                        //Se cambia el texto del botón de insertar
                        $("#btn_insertar_imagen").text("Insertar nueva imagen");
                        //Se ordena la creación de un nuevo objeto Imagen
                        CrearInsertarImagen();
                    }//else if
                    else if (areaTrabajo == "VÍDEOS")
                    {
                        //Se desactivan todas las cartas existentes
                        $("#contenedor_cartas").children().addClass("desactivar");
                        //Se cambia el texto del botón de insertar
                        $("#btn_insertar_video").text("Insertar nuevo vídeo");
                        //Se ordena la creación de un nuevo objeto Video
                        CrearInsertarVideo();
                    }//else if
                    else if (areaTrabajo == "AUDIOS")
                    {
                        //Se desactiva el botón de insertar nuevo audio
                        $("#btn_insertar_audio").addClass("desactivar");
                        //Desactivar las filas de la tabla
                        var coleccion = $("#tabla_audios tbody tr");
                        for (let cont = 1; cont < coleccion.length; cont++)
                        {
                            //Se desactiva la fila
                            $(coleccion[cont]).addClass("desactivar");
                            //Se inhabilitan los botones
                            $($(coleccion[cont].children[4]).children("button")).prop("disabled", true);
                            $($(coleccion[cont].children[5]).children("button")).prop("disabled", true);
                        }//for
                        //Insertar una nueva fila en la tabla de audios al final en modo inserción
                        InsertarFilaAudioInsercion();
                        


/*
                        //Se cambia el aspecto de la tabla de audios para indicar que no está operativa
                        $("#tabla_audios_contenedor").addClass("desactivar");
                        //Se habilita la edición de los controles del formulario de audios
                        DesactivarControles("audios", false);
                        //Se cambia el texto del botón de insertar
                        $("#btn_insertar_audio").text("Insertar nuevo audio");
                        //Se limpian los controles
                        $("#audio_nombre").val("");
                        $("#audio_descripcion").val("");
*/                        
                    }//else if
                    break;
                }
            case 'EDICIÓN':
                {
                    //Se desactiva el menú principal
                    $("#barra_nav").addClass("desactivar");
                    //Se desactiva el menú secundario
                    $("#barra_nav_medios").addClass("desactivar");

                    if (areaTrabajo == "TEXTOS")
                    {
                        //Se cambia el aspecto de la tabla de textos para indicar que no está operativa
                        $("#tabla_textos_contenedor").addClass("desactivar");
                        //Se habilita la edición de los controles del formulario de textos
                        DesactivarControles("textos", false);
                        //Se cambia el texto del botón de insertar
                        $("#btn_insertar_texto").text("Modificar texto");
                        //Se muestra el botón de cancelación de la edición
                        $("#btn_cancelar_insertar_texto").css("display", "block");
                    }//if
                    else if (areaTrabajo == "IMÁGENES")
                    {
                        //Se desactiva el botón de inserción
                        $("#btn_insertar_texto").addClass("desactivar");
                        //Se desactivan todas las cartas existentes
                        $("#contenedor_cartas_imagenes").children().addClass("desactivar");

                    }//else if
                    else if (areaTrabajo == "VÍDEOS")
                    {
                        //Se desactiva el botón de inserción
                        $("#btn_insertar_texto").addClass("desactivar");
                        //Se desactivan todas las cartas existentes
                        $("#contenedor_cartas_videos").children().addClass("desactivar");

                    }//else if
                    else if (areaTrabajo == "AUDIOS")
                    {
                        //Se desactiva el botón de insertar nuevo audio
                        $("#btn_insertar_audio").addClass("desactivar");
                        //Se pone la fila actual en edición
                        var coleccion = $("#tabla_audios tbody tr");
                        for (let cont = 1; cont < coleccion.length; cont++)
                        {
                            if (coleccion[cont].children[0].innerText == audioActual[0])
                            {
                                //DENOMINACIÓN
                                var editableNombre = Factoria("input", [["type", "text"],
                                                                        ["name", "audio_denominacion"],
                                                                        ["id", "audio_denominacion"],
                                                                        ["class", "row col-12 audio_denominacion"]], "");
                                $(editableNombre).val(audioActual[1]);
                                $(coleccion[cont].children[1]).text("");
                                coleccion[cont].children[1].appendChild(editableNombre);
                                //DESCRIPCIÓN
                                var editableDescripcion = Factoria("input",[["type", "text"],
                                                                            ["name", "audio_descripcion"],
                                                                            ["id", "audio_descripcion"],
                                                                            ["class", "row col-12 audio_descripcion"]], "");
                                $(editableDescripcion).val(audioActual[2]);
                                $(coleccion[cont].children[2]).text("");
                                coleccion[cont].children[2].appendChild(editableDescripcion);
                                //SELECTOR ARCHIVO AUDIO
                                $($(coleccion[cont].children[3]).children("input")).css("display", "block");

                                //Se cambia el texto de los botones
                                $($(coleccion[cont].children[4]).children("button")).text("Aceptar");
                                $($(coleccion[cont].children[5]).children("button")).text("Cancelar");
                            }//if
                            else
                            {
                                //Se desactiva la fila
                                $(coleccion[cont]).addClass("desactivar");
                                //Se inhabilitan los botones
                                $($(coleccion[cont].children[4]).children("button")).prop("disabled", true);
                                $($(coleccion[cont].children[5]).children("button")).prop("disabled", true);
                            }//else
                        }//for
                    }//else if
                    break;
                }
        }//switch
    }//EstablecerModoTrabajo

    function CrearColeccionImagenes(mediosObtenidos)
    {
        mediosObtenidos.forEach(function(imagen){
            //Creación de un objeto Imagen
            var objImagen = new Imagen(imagen["MD_CODE"], imagen["MD_DENOMINACION"], imagen["MD_DESCRIPCION"], imagen["MD_RUTA"]);
            //Se crea su carta
            objImagen.CrearCarta("IMAGEN", false);
            //Inserción del objeto en la colección
            coleccionImagenes.set(imagen["MD_CODE"], objImagen);
        });
    }//CrearColeccionImagenes

    function CrearColeccionVideos(mediosObtenidos)
    {
        mediosObtenidos.forEach(function(video){
            //Creación de un objeto Video
            var objVideo = new Video(video["MD_CODE"], video["MD_DENOMINACION"], video["MD_DESCRIPCION"], video["MD_RUTA"]);
            //Se crea su carta
            objVideo.CrearCarta("VIDEO", false);
            //Inserción del objeto en la colección
            coleccionVideos.set(video["MD_CODE"], objVideo);
        });
    }//CrearColeccionVideos

    function CrearInsertarImagen()
    {
        //Se crea un nuevo objeto Imagen
        var nuevaImagen = new Imagen();

        nuevaImagen.CrearCarta("IMAGEN", true);

    }//CrearInsertarImagen

    function CrearInsertarVideo()
    {
        //Se crea un nuevo objeto Video
        var nuevoVideo = new Video();

        nuevoVideo.CrearCarta("VIDEO", true);

    }//CrearInsertarVideo

    function ActivarAdjuntarMedio()
    {
        //Se activan los botones para adjuntar los diferentes medios posibles sobre el elemento de test
        //TEXTOS
            //Si hay medios de texto, habrá una fila en la tabla de textos seleccionada
            //Se activa el botón
            if (textoActual.length)
            {
                $("#btn_adjuntar_texto").css("display", "block");
            }//if
        //IMÁGENES
            //Si hay medios de imagen
            //Se activa el botón
            if (coleccionImagenes.size)
            {
                $("#btn_adjuntar_imagen").css("display", "block");
            }//if       
        //VÍDEOS
            //Si hay medios de vídeos
            //Se activa el botón
            if (coleccionVideos.size)
            {
                $("#btn_adjuntar_video").css("display", "block");
            }//if               
        //AUDIOS
            //Si hay medios de audio, habrá una fila en la tabla de audios seleccionada
            //Se activa el botón
            if (audioActual.length)
            {
                $("#btn_adjuntar_audio").css("display", "block");
            }//if
    }//ActivarAdjuntarMedio

    function ObtenerFechaHoraActual()
    {
        var fecha = new Date();
        var fechaHora = fecha.getFullYear() + "-" +
                        fecha.getMonth() + "-" +
                        fecha.getDate() + " " +
                        fecha.getHours() + ":" +
                        fecha.getMinutes() + ":" +
                        fecha.getSeconds();
        return fechaHora;
    }//ObtenerFechaHoraActual

    function Permiso(elemento, subelemento, codigo, evento, data)
    {
        //Dependiendo del elemento sobre el que se consulta
        switch (elemento)
        {
            case "MEDIO":
                {
                    //Comprobar si el medio se está usando en algún test
                    var op = "COMPROBAR_MEDIO";
                    var param = ['i', codigo];
            
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: op,
                                    parametros: param
                                },
                        success: function(respuesta)
                                {
                                    //Extracción de los datos del JSON de respuesta en un array
                                    var resultado = JSON.parse(respuesta);
                                    if (resultado.length == 0)
                                    {
                                        //No está siendo utilizado en ningún test
                                        //Se puede eliminar
                                        //Se solicita confirmación para la eliminación
                                        switch (subelemento)
                                        {
                                            case "TEXTO":
                                                {
                                                    if (confirm("¿Desea eliminar el elemento de texto seleccionado?"))
                                                    {    
                                                        //Se ordena la eliminación
                                                        EliminarMedio("TEXTO", codigo, evento, data);   
                                                    }//if     
                                                    break;
                                                }
                                            case "IMAGEN":
                                                {
                                                    if (confirm("¿Desea eliminar esta imagen de la colección?"))
                                                    {
                                                        //Se ordena la eliminación
                                                        EliminarMedio("IMAGEN", codigo, evento, data);
                                                    }//if
                                                    break;
                                                }
                                            case "VÍDEO":
                                                {
                                                    if (confirm("¿Desea eliminar este vídeo de la colección?"))
                                                    {
                                                        //Se ordena la eliminación
                                                        EliminarMedio("VÍDEO", codigo, evento, data);
                                                    }//if
                                                    break;
                                                }
                                            case "AUDIO":
                                                {
                                                    if (confirm("¿Desea eliminar el elemento de audio seleccionado?"))
                                                    {    
                                                        //Se ordena la eliminación
                                                        EliminarMedio("AUDIO", codigo, evento, data);   
                                                    }//if     
                                                    break;
                                                }
                                        }//switch

                                    }//if
                                    else
                                    {
                                        var mensaje;
                                        //Está siendo usado luego no se puede eliminar
                                        switch (subelemento)
                                        {
                                            case "TEXTO":
                                                {
                                                    mensaje = "No es posible eliminar este texto porque está en uso en los tests";
                                                    break;
                                                }
                                            case "IMAGEN":
                                                {
                                                    mensaje = "No es posible eliminar esta imagen porque está en uso en los tests";
                                                    break;
                                                }
                                            case "VÍDEO":
                                                {
                                                    mensaje = "No es posible eliminar este vídeo porque está en uso en los tests";
                                                    break;
                                                }
                                            case "AUDIO":
                                                {
                                                    mensaje = "No es posible eliminar este audio porque está en uso en los tests";
                                                    break;
                                                }
                                        }//switch
                                        alert(mensaje);
                                    }//else
                                },
                        error: function(jqxhr, status, exception)
                                {
                                    alert('Exception:', exception);
                                }
                        });
                    break;
                }
            case "TEST":
                {
                    //Comprobar si el test se está usando en alguna batería
                    var op = "COMPROBAR_TEST";
                    var param = ['i', codigo];
            
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: op,
                                    parametros: param
                                },
                        success: function(respuesta)
                                {
                                    //Extracción de los datos del JSON de respuesta en un array
                                    var resultado = JSON.parse(respuesta);
                                    if (resultado.length == 0)
                                    {
                                        //No está siendo utilizado en ninguna batería
                                        //Se puede eliminar
                                        //Se solicita confirmación para la eliminación
                                        if (confirm("¿Desea eliminar el test seleccionado?"))
                                        {    
                                            //Se ordena la eliminación
                                            EliminarTest(codigo);   
                                        }//if     
                                    }//if
                                    else
                                    {
                                        var mensaje;
                                        //Está siendo usado luego no se puede eliminar
                                        mensaje = "No es posible eliminar este test porque está en uso en las baterías";
                                        alert(mensaje);
                                    }//else
                                },
                        error: function(jqxhr, status, exception)
                                {
                                    alert('Exception:', exception);
                                }
                        });
                    break;
                }
            case "BATERÍA":
                {
                    //Comprobar si la batería ha sido ya asignada a algún plan de formación
                    var op = "COMPROBAR_BATERÍA";
                    var param = ['i', codigo];
            
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: op,
                                    parametros: param
                                },
                        success: function(respuesta)
                                {
                                    //Extracción de los datos del JSON de respuesta en un array
                                    var resultado = JSON.parse(respuesta);
                                    if (resultado.length == 0)
                                    {
                                        //No ha sido asignada a ningún plan
                                        //Se puede eliminar
                                        //Se solicita confirmación para la eliminación
                                        if (confirm("¿Desea eliminar la batería seleccionada?"))
                                        {    
                                            //Se ordena la eliminación
                                            EliminarBateria(codigo);   
                                        }//if     
                                    }//if
                                    else
                                    {
                                        var mensaje;
                                        //Ha sido ya asignada luego no se puede eliminar
                                        mensaje = "No es posible eliminar esta batería porque ya ha sido asignada a algún plan de formación";
                                        alert(mensaje);
                                    }//else
                                },
                        error: function(jqxhr, status, exception)
                                {
                                    alert('Exception:', exception);
                                }
                        });
                    break;
                }
            case "PLAN":
                {
                    //Comprobar si ejecución de la batería ya se ha iniciado
                    var op = "COMPROBAR_EJECUCIÓN_BATERÍA";
                    var param = ['ii', codigo, alumnoActual[0]];
            
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: op,
                                    parametros: param
                                },
                        success: function(respuesta)
                                {
                                    //Extracción de los datos del JSON de respuesta en un array
                                    var resultado = JSON.parse(respuesta);
                                    if (resultado[0]["FECHA_INICIO"] == "0000-00-00 00:00:00")
                                    {
                                        //No ha comenzado su ejecución
                                        //Se puede retirar
                                        //Se solicita confirmación para la retirada
                                        if (confirm("¿Desea retirar la asignación para la batería seleccionada?"))
                                        {    
                                            //Se retira la batería
                                            //Se elimina la fila de la batería en cuestión de la tabla de asignación
                                            $(evento).parent().parent().remove();
                                        }//if     
                                    }//if
                                    else
                                    {
                                        var mensaje;
                                        //Ha sido ya asignada luego no se puede eliminar
                                        mensaje = "No es posible eliminar esta batería porque ya ha sido asignada a algún plan de formación";
                                        alert(mensaje);
                                    }//else
                                },
                        error: function(jqxhr, status, exception)
                                {
                                    alert('Exception:', exception);
                                }
                        });
                    break;
                }
        }//switch
    }//Permiso

    //Función que ordena la eliminación de un medio
    function EliminarMedio(medio, codigo, evento, data)
    {
        switch (medio)
        {
            case "TEXTO":
                {
                    //Se ordena la eliminación por AJAX
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: 'ELIMINAR_TEXTO',
                                    parametros: [codigo]
                                },
                        success: function(respuesta)
                            {
                                //Una vez eliminado el registro se elimina la fila de la tabla
                                var coleccion = $("#tabla_textos tbody tr");
                                for (let fila = 1; fila < coleccion.length; fila++)
                                {
                                    if (coleccion[fila].children[0].innerText == textoActual[0])
                                    {
                                        textoActual = [];
                                        if (fila < coleccion.length - 1)
                                        {
                                            //No se va a eliminar la última fila por lo que se seleccionará la siguiente
                                            for (let celdas = 0; celdas < coleccion[fila + 1].children.length - 2; celdas++)
                                            {
                                                //Se resalta la fila seleccionada
                                                $(coleccion[fila + 1].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                                                'background-color': colorFondoFilaResaltada});
                                                textoActual.push($(coleccion[fila + 1].children[celdas]).text());
                                            }//for
                                        }//if
                                        else
                                        {
                                            if (coleccion.length > 2)
                                            {
                                                //Se va a eliminar la última fila y hay más, luego se selecciona la anterior
                                                for (let celdas = 0; celdas < coleccion[fila - 1].children.length - 2; celdas++)
                                                {
                                                    //Se resalta la fila seleccionada
                                                    $(coleccion[fila - 1].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                                                    'background-color': colorFondoFilaResaltada});
                                                    textoActual.push($(coleccion[fila - 1].children[celdas]).text());
                                                }//for
                                            }//if
                                        }//else
                                        coleccion[fila].remove();
                                        CargarControles("textos");
                                        return;
                                    }//if
                                }//for


                            },
                        error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });        
                    break;
                }
            case "IMAGEN":
                {
                    //Se destruye la carta
                    $(evento).parent().parent().parent().remove();
                    //Se elimina del servidor el archivo de la imagen
                    $.ajax({
                            //La comunicación con el servidor será mediante POST
                            method: 'POST',
                            //Se indica el archivo php que eliminará la foto al servidor
                            url: '../php/eliminarImagen.php',
                            data:   { parametros: [data.ruta]
                                    },
                            success: function(respuesta)
                                {
                                    if (respuesta == 'FALSE')
                                    {
                                        alert("No se ha podido eliminar la imagen del servidor");
                                    }//if
                                }
                        });
                    //Se elimina el registro en la base de datos
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: 'ELIMINAR_IMAGEN',
                                    parametros: [data.codigo]
                                },
                        success: function(respuesta)
                            {
                            },
                        error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });        
                    //Se destruye el objeto Imagen
                    coleccionImagenes.delete(data.codigo);
                    //No hay imagen actual
                    imagenActual = -1;
                    break;
                }
            case "VÍDEO":
                {
                    //Se destruye la carta
                    $(evento).parent().parent().parent().remove();
                    //Se elimina del servidor el archivo del vídeo
                    $.ajax({
                            //La comunicación con el servidor será mediante POST
                            method: 'POST',
                            //Se indica el archivo php que eliminará el vídeo del servidor
                            url: '../php/eliminarVideo.php',
                            data:   { parametros: [data.ruta]
                                    },
                            success: function(respuesta)
                                {
                                    if (respuesta == 'FALSE')
                                    {
                                        alert("No se ha podido eliminar el vídeo del servidor");
                                    }//if
                                }
                        });
                    //Se elimina el registro en la base de datos
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: 'ELIMINAR_VIDEO',
                                    parametros: [data.codigo]
                                },
                        success: function(respuesta)
                            {
                            },
                        error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });        
                    //Se destruye el objeto Video
                    coleccionVideos.delete(data.codigo);
                    //No hay vídeo actual
                    videoActual = -1;
                    break;
                }
            case "AUDIO":
                {
                    //Se ordena la eliminación por AJAX
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: 'ELIMINAR_AUDIO',
                                    parametros: [codigo]
                                },
                        success: function(respuesta)
                            {
                                //Una vez eliminado el registro se elimina la fila de la tabla
                                var coleccion = $("#tabla_audios tbody tr");
                                for (let fila = 1; fila < coleccion.length; fila++)
                                {
                                    if (coleccion[fila].children[0].innerText == audioActual[0])
                                    {
                                        audioActual = [];
                                        if (fila < coleccion.length - 1)
                                        {
                                            //No se va a eliminar la última fila por lo que se seleccionará la siguiente
                                            for (let celdas = 0; celdas < coleccion[fila + 1].children.length - 2; celdas++)
                                            {
                                                //Se resalta la fila seleccionada
                                                $(coleccion[fila + 1].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                                                'background-color': colorFondoFilaResaltada});
                                                audioActual.push($(coleccion[fila + 1].children[celdas]).text());
                                            }//for
                                        }//if
                                        else
                                        {
                                            if (coleccion.length > 2)
                                            {
                                                //Se va a eliminar la última fila y hay más, luego se selecciona la anterior
                                                for (let celdas = 0; celdas < coleccion[fila - 1].children.length - 2; celdas++)
                                                {
                                                    //Se resalta la fila seleccionada
                                                    $(coleccion[fila - 1].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                                                    'background-color': colorFondoFilaResaltada});
                                                    audioActual.push($(coleccion[fila - 1].children[celdas]).text());
                                                }//for
                                            }//if
                                        }//else
                                        coleccion[fila].remove();
                                        //CargarControles("audios");
                                        return;
                                    }//if
                                }//for
                            },
                        error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });        
                    break;
                }
        }//switch
    }//EliminarMedio

    //Función que ordena la eliminación de un test
    function EliminarTest(codigo)
    {
        //Se ordena la eliminación por AJAX
        $.ajax({
            method: "POST",
            url: pathPHP + "MediosController.php",
            data:   {   operacion: 'ELIMINAR_TEST',
                        parametros: [codigo]
                    },
            success: function(respuesta)
                {
                    //Una vez eliminado el registro se elimina la fila de la tabla
                    var coleccion = $("#tabla_tests tbody tr");
                    for (let fila = 1; fila < coleccion.length; fila++)
                    {
                        if (coleccion[fila].children[0].innerText == testActual[0])
                        {
                            testActual = [];
                            if (fila < coleccion.length - 1)
                            {
                                //No se va a eliminar la última fila por lo que se seleccionará la siguiente
                                for (let celdas = 0; celdas < coleccion[fila + 1].children.length - 2; celdas++)
                                {
                                    //Se resalta la fila seleccionada
                                    $(coleccion[fila + 1].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                                    'background-color': colorFondoFilaResaltada});
                                    testActual.push($(coleccion[fila + 1].children[celdas]).text());
                                }//for
                            }//if
                            else
                            {
                                if (coleccion.length > 2)
                                {
                                    //Se va a eliminar la última fila y hay más, luego se selecciona la anterior
                                    for (let celdas = 0; celdas < coleccion[fila - 1].children.length - 2; celdas++)
                                    {
                                        //Se resalta la fila seleccionada
                                        $(coleccion[fila - 1].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                                        'background-color': colorFondoFilaResaltada});
                                        testActual.push($(coleccion[fila - 1].children[celdas]).text());
                                    }//for
                                }//if
                            }//else
                            coleccion[fila].remove();
                            CargarControles("test");
                            return;
                        }//if
                    }//for
                },
            error: function(jqxhr, status, exception)
                {
                    alert('Exception:', exception);
                }
        });        
    }//EliminarTest

    //Función que ordena la eliminación de una batería de test
    function EliminarBateria(codigo)
    {
        //Se ordena la eliminación por AJAX
        $.ajax({
            method: "POST",
            url: pathPHP + "MediosController.php",
            data:   {   operacion: 'ELIMINAR_BATERÍA_TEST',
                        parametros: [codigo]
                    },
            success: function(respuesta)
                {
                    //Una vez eliminado el registro se elimina la fila de la tabla
                    var coleccion = $("#BT_tabla_baterias_tests tr");
                    for (let fila = 1; fila < coleccion.length; fila++)
                    {
                        if (coleccion[fila].children[0].innerText == bateriaActual)
                        {
                            /*
                            //testActual = [];
                            if (fila < coleccion.length - 1)
                            {
                                //No se va a eliminar la última fila por lo que se seleccionará la siguiente
                                for (let celdas = 0; celdas < coleccion[fila + 1].children.length - 2; celdas++)
                                {
                                    //Se resalta la fila seleccionada
                                    $(coleccion[fila + 1].children[celdas]).css({   'font-weight':'200',
                                                                                    'color': colorTextoFilaResaltada,
                                                                                    'background-color': colorFondoFilaResaltada});
                                    //testActual.push($(coleccion[fila + 1].children[celdas]).text());
                                }//for
                            }//if
                            else
                            {
                                if (coleccion.length > 2)
                                {
                                    //Se va a eliminar la última fila y hay más, luego se selecciona la anterior
                                    for (let celdas = 0; celdas < coleccion[fila - 1].children.length - 2; celdas++)
                                    {
                                        //Se resalta la fila seleccionada
                                        $(coleccion[fila - 1].children[celdas]).css({   'font-weight':'200',
                                                                                        'color': colorTextoFilaResaltada,
                                                                                        'background-color': colorFondoFilaResaltada});
                                        //testActual.push($(coleccion[fila - 1].children[celdas]).text());
                                    }//for
                                }//if
                            }//else*/
                            coleccion[fila].remove();
                            $("#TT_contenedor_tabla_tests").remove();
                            bateriaActual = -1;
                            //CargarControles("test");
                            return;
                        }//if
                    }//for
                },
            error: function(jqxhr, status, exception)
                {
                    alert('Exception:', exception);
                }
        });        
    }//EliminarBateria

    /////////////////////////////////////////////////////////////
    //                MANEJADORES DE EVENTOS                   //
    /////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////
        //---------   EVENTOS DE GESTIÓN DE USUARIOS   ------------//
        /////////////////////////////////////////////////////////////
   
            //Pulsación sobre la entrada del menú principal GESTIÓN DE USUARIOS
            $("#barra_nav li:first-child > a").click(function(){
                //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                if (modoTrabajo == "NAVEGACIÓN")
                {
                    //Se actualiza el área de trabajo en curso
                    areaTrabajo = "USUARIOS";
                    //Se visualiza la sección de la gestión de usuarios
                    $("#usuarios_registrados").css("display", "block");
                    $("#medios").css("display", "none");
                    $("#tests").css("display", "none");
                    $("#baterias").css("display", "none");
                    $("#planes").css("display", "none");

                    //Se marca la entrada de menú correspondiente a esta página
                    $("#barra_nav li").css("background-color", colorFondoEntradaMenuPrincipal);
                    $("#barra_nav li:first-child").css("background-color", colorFondoEntradaMenuPrincipalSeleccionado);
                }//if
                //Se evita el link
                return false;
            })

            //Pulsación sobre la tabla de usuarios
            function OnClickTablaUsuarios()
            {
                //Selección del nodo tr sobre el que se ha hecho click
                let hijos = $(this).children();
                if (hijos[0].nodeName != 'TH')
                {
                    SeleccionarFilaTabla("usuarios", hijos);
                }//if       
            }//OnClickTablaUsuarios

            //Pulsación sobre el botón de Filtrado de usuarios Administradores/Alumnos
            $('#filtrar').click(function(){
                Filtrar();
                //Se evita el submit
                return false;
            })

            //Pulsación sobre el botón de Editar de los registros de la tabla de usuarios
            function OnClickEditarUsuario()
            {
                //var usr_cod = $($(this).parent().parent().children()[0]).text();
                var usr_cod = $($(this).parent().siblings()[0]).text();
                $("#ID_USR").val(usr_cod);
                $('#btn_editar_insertar_usuario').click();
            }//OnClickEditarUsuario

            //Pulsación sobre el botón de Eliminar de los registros de la tabla de usuarios
            function OnClickEliminarUsuario()
            {
                var usr_cod = $($(this).parent().siblings()[0]).text();
                var usr_foto = $($(this).parent().siblings()[11]).text();

                //Se ordena la eliminación por AJAX
                $.ajax({
                    method: "POST",
                    url: pathPHP + "UsuariosController.php",
                    data:   {   operacion: 'ELIMINAR',
                                parametros: [usr_cod]
                            },
                    success: function(respuesta)
                        {
                        },
                    error: function(jqxhr, status, exception)
                        {
                            alert('Exception:', exception);
                        }
                });        
                //Se elimina la foto al servidor mediante AJAX
                $.ajax({
                    //La comunicación con el servidor será mediante POST
                    method: 'POST',
                    //Se indica el archivo php que eliminará la foto al servidor
                    url: '../php/eliminarFoto.php',
                    data:   { parametros: [usr_foto]
                            },
                    success: function(respuesta)
                        {
                            if (respuesta == 'FALSE')
                            {
                                alert("No se ha podido eliminar la foto del usuario del servidor");
                            }//if
                            //Se recarga la tabla para mostrar el nuevo usuario
                            Filtrar();
                        }
                });        
            }//OnClickEliminarUsuario

        /////////////////////////////////////////////////////////////
        //---------    EVENTOS DE GESTIÓN DE MEDIOS    ------------//
        /////////////////////////////////////////////////////////////

            //Pulsación sobre la entrada del menú principal GESTIÓN DE MEDIOS
            $("#barra_nav li:nth-child(2) > a").click(function(){
                //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                if (modoTrabajo == "NAVEGACIÓN")
                {
                    //Se actualiza el área de trabajo en curso
                    areaTrabajo = "TEXTOS";
                    //Se oculta el botón de cancelar la inserción
                    $("#btn_cancelar_insertar_texto").css("display", "none");
                    //Se desactivan los controles del formulario
                    DesactivarControles("textos", true);
                    //Se comprueba si es necesario lanzar la consulta de textos
                    if (!inicializadosTextos)
                    {
                        FiltrarMedia('TEXTO');
                        inicializadosTextos = true;
                    }//if
                    //Se visualiza la sección de la gestión de medios
                    $("#usuarios_registrados").css("display", "none");
                    $("#medios").css("display", "block");
                    $("#tests").css("display", "none");
                    $("#baterias").css("display", "none");
                    $("#planes").css("display", "none");

                    //Se marca la entrada de menú correspondiente a esta página
                    $("#barra_nav li").css("background-color", colorFondoEntradaMenuPrincipal);
                    $("#barra_nav li:nth-child(2)").css("background-color", colorFondoEntradaMenuPrincipalSeleccionado);
                }//if
                //Se evita el link
                return false;
            })
                /////////////////////////////////////////////////////////////
                //---------    EVENTOS DE GESTIÓN DE TEXTOS    ------------//
                /////////////////////////////////////////////////////////////

                    //Pulsación sobre la entrada del menú TEXTOS
                    $("#barra_nav_medios li:first-child > a").click(function(){
                        //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            //Se actualiza el área de trabajo en curso
                            areaTrabajo = "TEXTOS";
                            //Se visualiza la sección de la gestión de textos
                            $("#textos").css("display", "block");
                            $("#imagenes").css("display", "none");
                            $("#videos").css("display", "none");
                            $("#audios").css("display", "none");

                            //Se marca la entrada de menú correspondiente a esta página
                            $("#barra_nav_medios li").css("background-color", colorFondoEntradaMenuMedios);
                            $("#barra_nav_medios li:first-child").css("background-color", colorFondoEntradaMenuMediosSeleccionado);
                        }//if
                        //Se evita el link
                        return false;
                    })

                    //Pulsación sobre la tabla de textos
                    function OnClickTablaTextos()
                    {
                        //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            //Selección del nodo tr sobre el que se ha hecho click
                            let hijos = $(this).children();
                            if (hijos[0].nodeName != 'TH')
                            {
                                SeleccionarFilaTabla("textos", hijos);
                            }//if     
                        }//if  
                    }//OnClickTablaTextos

                    //Pulsación sobre el botón de Editar de los registros de la tabla de textos
                    function OnClickEditarTexto(e)
                    {
                        //Se evita que se propague el evento click al pulsar sobre el botón
                        e.stopPropagation();
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            //Hay que comprobar si la fila sobre la que se ha hecho click está seleccionada
                            //y si no, hay que seleccionarla para actualizar el elemento sobre el que se desea actuar
                            var cod = $($(e.target).parent().siblings()[0]).text();
                            if (cod != textoActual[0])
                            {
                                SeleccionarFilaTabla("textos", $(e.target).parent().parent().children());
                            }//if
                            EstablecerModoTrabajo("EDICIÓN");
                        }//if
                    }//OnClickEditarTexto

                    //Pulsación sobre el botón de Eliminar de los registros de la tabla de textos
                    function OnClickEliminarTexto(e)
                    {
                        //Se evita que se propague el evento click al pulsar sobre el botón
                        e.stopPropagation();
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            //Hay que comprobar si la fila sobre la que se ha hecho click está seleccionada
                            //y si no, hay que seleccionarla para actualizar el elemento sobre el que se desea actuar
                            var cod = $($(e.target).parent().siblings()[0]).text();
                            if (cod != textoActual[0])
                            {
                                SeleccionarFilaTabla("textos", $(e.target).parent().parent().children());
                            }//if
                            /*
                                Se solicita permiso para eliminar el texto.
                                Si está en uso en algún test no se permitirá la eliminación
                                Si se permite, entonces se pide confirmación de la eliminación al usuario
                                Finalmente si todo es favorable, se elimina
                            */
                            Permiso("MEDIO", "TEXTO", textoActual[0], null, null);
                        }//if
                    }//OnClickEliminarTexto

                    //Pulsación sobre el botón de Insertar nuevo texto
                    $("#btn_insertar_texto").click(function(){
                        if (modoTrabajo == "INSERCIÓN")
                        {
                            //Se solicita confirmación de la inserción
                            if (confirm("¿Desea insertar el nuevo texto?"))
                            {
                                //Se inserta el nuevo texto en la base de datos
                                //Se obtienen los datos
                                //DENOMINACIÓN
                                var denominacion = $('#texto_nombre').val();
                                //DESCRIPCIÓN
                                var descripcion = $("#texto_descripcion").val();
                                //TIPO
                                var tipo = "TEXTO";
                                //CONTENIDO
                                var contenido = $('#texto_contenido').val();

                                //Se ordena la inserción por AJAX
                                $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'INSERTAR_TEXTO',
                                                        parametros: [   'ssss',
                                                                        tipo,
                                                                        denominacion,
                                                                        descripcion,
                                                                        contenido
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    var res = JSON.parse(respuesta);
                                                    //Se añade la nueva fila a la tabla
                                                    NuevaFilaTexto(res[0]);
                                                    SeleccionarFilaTablaCodigo("textos", res[0]["MD_CODE"]);
                                                    EstablecerModoTrabajo("NAVEGACIÓN");
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });        
                            }//if
                            else
                            {
                                return;
                            }//else
                        }//if
                        else if (modoTrabajo == "EDICIÓN")
                        {
                            //Se solicita confirmación de la edición
                            if (confirm("¿Desea actualizar el texto?"))
                            {
                                //Se actualiza el texto en la base de datos
                                //Se obtienen los datos
                                //CÓDIGO
                                var id = textoActual[0];
                                //DENOMINACIÓN
                                var denominacion = $('#texto_nombre').val();
                                //DESCRIPCIÓN
                                var descripcion = $("#texto_descripcion").val();
                                //CONTENIDO
                                var contenido = $('#texto_contenido').val();

                                //Se ordena la actualización por AJAX
                                $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'EDITAR_TEXTO',
                                                        parametros: [   'ssss',
                                                                        denominacion,
                                                                        descripcion,
                                                                        contenido,
                                                                        id
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    var res = JSON.parse(respuesta);
                                                    //Se actualizan los valores en la tabla
                                                    textoActual = [];

                                                    var coleccion = $("#tabla_textos tbody tr");
                                                    for (let cont = 1; cont < coleccion.length; cont++)
                                                    {
                                                        if (coleccion[cont].children[0].innerText == id)
                                                        {
                                                            $(coleccion[cont].children[0]).text(res[0]["MD_CODE"]);
                                                            textoActual.push(res[0]["MD_CODE"]);
                                                            $(coleccion[cont].children[1]).text(res[0]["MD_DENOMINACION"]);
                                                            textoActual.push(res[0]["MD_DENOMINACION"]);
                                                            $(coleccion[cont].children[2]).text(res[0]["MD_DESCRIPCION"]);
                                                            textoActual.push(res[0]["MD_DESCRIPCION"]);
                                                        }//if
                                                    }//for
                                                    EstablecerModoTrabajo("NAVEGACIÓN");
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });        
                            }//if
                            else
                            {
                                return;
                            }//else                            
                        }//if
                        else
                        {
                            //Se cambia el modo de trabajo a INSERCIÓN
                            EstablecerModoTrabajo("INSERCIÓN");
                        }//else
                    })

                    //Pulsación sobre el botón de Cancelar la operación de inserción
                    $("#btn_cancelar_insertar_texto").click(function(){
                        //Se cambia el modo de trabajo a NAVEGACIÓN
                        EstablecerModoTrabajo("NAVEGACIÓN");
                    })

                    //Pulsación sobre el botón para adjuntar el texto actualmente seleccionado al test en curso
                    $("#btn_adjuntar_texto").click(function(){
                        //Se solicita confirmación
                        if (confirm("¿Desea adjuntar el texto actualmente seleccionado al elemento del test en curso?\nCaso de existir ya un elemento será sustituido"))
                        {
                            //Se obtiene el contenido del texto actual
                            var txt = $("#texto_contenido").val();
                            //Se borra el medio existente
                            if ($(elementoTestEnCurso).find("div").length > 1)
                            {
                                $(elementoTestEnCurso).find("div").last().remove();
                            }//if
                            //Se crea un medio adjunto nuevo
                            var medioAdjunto = Factoria("div", [["class", "contenedor_medio"],["id", "contenedor_medio"]], "");
                            var medioCodigo = Factoria("input", [["type", "hidden"],["id", "medio_texto_codigo"]], textoActual[0]);
                            var medioTexto = Factoria("p", [["class", "medio_texto"],["id", "medio_texto"]], txt);
                            medioAdjunto.appendChild(medioCodigo);
                            medioAdjunto.appendChild(medioTexto);

                            $(elementoTestEnCurso).append(medioAdjunto);
                        }//if
                    })

                /////////////////////////////////////////////////////////////
                //--------    EVENTOS DE GESTIÓN DE IMÁGENES    -----------//
                /////////////////////////////////////////////////////////////

                    //Pulsación sobre la entrada del menú IMÁGENES
                    $("#barra_nav_medios li:nth-child(2) > a").click(function(){
                        //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            //Se actualiza el área de trabajo en curso
                            areaTrabajo = "IMÁGENES";
                            //Se oculta el botón de cancelar la inserción
                            $("#btn_cancelar_insertar_imagen").css("display", "none");
                            if (!inicializadasImagenes)
                            {
                                //Se crea el conjunto de objetos Imagen extrayendo los datos de la base de datos
                                FiltrarMedia('IMAGEN');
                                inicializadasImagenes = true;
                            }//if
                            //Se visualiza la sección de la gestión de imágenes
                            $("#textos").css("display", "none");
                            $("#imagenes").css("display", "block");
                            $("#videos").css("display", "none");
                            $("#audios").css("display", "none");

                            //Se marca la entrada de menú correspondiente a esta página
                            $("#barra_nav_medios li").css("background-color", colorFondoEntradaMenuMedios);
                            $("#barra_nav_medios li:nth-child(2)").css("background-color", colorFondoEntradaMenuMediosSeleccionado);
                        }//if
                        //Se evita el link
                        return false;
                    })

                    //Pulsación sobre el botón de Insertar nueva imagen
                    $("#btn_insertar_imagen").click(function(){
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            //Se cambia el modo de trabajo a INSERCIÓN
                            EstablecerModoTrabajo("INSERCIÓN");
                        }//if
                    })

                    //Pulsación sobre una carta
                    function OnClickCard(evento, objetoImagen)
                    {
                        if ((imagenActual == -1)||(imagenActual == ""))
                        {
                            //Se marca la carta actual
                            $(evento).css("border", "1px solid blue");
                            //Se actualiza la imagen actual
                            imagenActual = objetoImagen.codigo;      
                        }//if
                        else
                        {
                            if (coleccionImagenes.get(imagenActual).ruta != objetoImagen.ruta)
                            {
                                //La selección ha cambiado luego se desmarcan las cartas
                                $("#contenedor_cartas_imagenes").children().css("border", "0px");
                                //Se marca la carta actual
                                $(evento).css("border", "1px solid blue");
                                //Se actualiza la imagen actual
                                imagenActual = objetoImagen.codigo;      
                            }//if
                        }//else
                    }//OnClickCard

                    //Pulsación sobre la imagen
                    function OnClickImagen(evento, objetoImagen)
                    {
                        if ((modoTrabajo == "INSERCIÓN")||(modoTrabajo == "EDICIÓN"))
                        {
                            if ($(evento).parent().hasClass("desactivar") == false)
                            {
                                $(evento).next().click();
                            }//if
                        }//if
                    }//OnClickImagen

                    //Carga la imagen seleccionada por el usuario
                    function OnChangeImagen(evento, objetoImagen)
                    {
                        //Obtenemos el archivo de la foto desde el input file
                        let foto = evento.files[0];
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
                                $(evento).prev().attr('src', e.target.result);
                            };
                        }//else
                    }

                    //Pulsación sobre el botón izquierdo de la carta de una imagen
                    function OnClickBtnIzdo(e, evento, objetoImagen)
                    {
                        //Se evita la propagación del evento click
                        e.stopPropagation();
                        //Hay que comprobar si la carta a la que pertenece el botón sobre el que se ha hecho click
                        //está seleccionada. Si no, hay que seleccionarla
                        var cod = $($(evento).parent().parent().parent().children()[0]).text();
                        if (cod != imagenActual)
                        {
                            $("#contenedor_cartas_imagenes").children().css("border", "0px");
                            //Se marca la carta actual
                            $(evento).parent().parent().parent().css("border", "1px solid blue");
                            //Se actualiza la imagen actual
                            imagenActual = objetoImagen.codigo;
                        }//if
                        if (modoTrabajo == "INSERCIÓN")
                        {
                            //Solicitar confirmación de la inserción
                            if (confirm("¿Desea añadir el nuevo elemento?"))
                            {
                                //Obtener los valores introducidos por el usuario (denominación, descripción y el nombre del archivo de la imagen)
                                var tipo = "IMAGEN";
                                var denominacion = $(evento).parent().siblings("input").val();
                                var descripcion = $(evento).parent().siblings("textarea").val();
                                var nombreImagen = $(evento).parent().parent().siblings("#imagen_card").val().replace(/[A-Za-z]:\\fakepath\\/i, '');
                                //Crear y lanzar una query a la BD para insertar un nuevo registro con esos datos
                                //Se ordena la inserción por AJAX
                                $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'INSERTAR_IMAGEN',
                                                        parametros: [   'ssss',
                                                                        tipo,
                                                                        denominacion,
                                                                        descripcion,
                                                                        nombreImagen
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    //Se obtiene el id del usuario recién insertado
                                                    var res = JSON.parse(respuesta);
                                                    //Obtener el Código del registro recién insertado e introducirlo en el campo hidden de la carta
                                                    $(evento).parent().parent().siblings().first().text(res[0]["MD_CODE"]);
                                                    //Actualizar los datos del objeto Imagen (código, denominación, descripción y ruta)
                                                    objetoImagen.codigo = res[0]["MD_CODE"];
                                                    objetoImagen.denominacion = res[0]["MD_DENOMINACION"];
                                                    objetoImagen.descripcion = res[0]["MD_DESCRIPCION"];
                                                    objetoImagen.ruta = res[0]["MD_RUTA"];
                                                    //Añadir el objeto Imagen a la coleccion
                                                    coleccionImagenes.set(objetoImagen.codigo, objetoImagen);
                                                    //Cambiar el estado de la carta a modo visualización
                                                    $(evento).parent().siblings("h5").text(objetoImagen.denominacion);
                                                    $(evento).parent().siblings("p").text(objetoImagen.descripcion);
                                                    $(evento).parent().siblings("input").removeClass("ver");
                                                    $(evento).parent().siblings("input").addClass("ocultar");
                                                    $(evento).parent().siblings("textarea").removeClass("ver");
                                                    $(evento).parent().siblings("textarea").addClass("ocultar");
                                                    $(evento).parent().siblings("h5").removeClass("ocultar");
                                                    $(evento).parent().siblings("h5").addClass("ver");
                                                    $(evento).parent().siblings("p").removeClass("ocultar");
                                                    $(evento).parent().siblings("p").addClass("ver");
                                                    $(evento).text("Editar");
                                                    $(evento).next().text("Eliminar");
                                                    //Se establece la imagen actual
                                                    imagenActual = objetoImagen.codigo;
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });        
                                //Se sube la foto al servidor mediante AJAX si se ha cargado foto
                                if (nombreImagen != "")
                                {
                                    var formData = new FormData();
                                    var editableFoto = $(evento).parent().parent().siblings("#imagen_card");
                                    formData.append('imagen_card',  editableFoto[0].files[0]);
                                    formData.append('nombre', nombreImagen);
                                
                                    $.ajax({
                                            //La comunicación con el servidor será mediante POST
                                            method: 'POST',
                                            //Se indica el archivo php que subirá la foto al servidor
                                            url: '../php/subirImagen.php',
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

                                //Cambiar el estado del sitio a NAVEGACIÓN
                                EstablecerModoTrabajo("NAVEGACIÓN");
                            }//if
                        }//if
                        else if (modoTrabajo == "EDICIÓN")
                        {
                            //Solicitar confirmación de la actualización
                            if (confirm("¿Desea actualizar el elemento?"))
                            {
                                //Bandera que señaliza si el usuario ha modificado la imagen pues habrá que subir el archivo al servidor
                                var subirImagen = false;
                                //Obtener el código de la imagen a actualizar
                                //Al ser una actualización el código no cambia pues no es accesible al usuario
                                var codigo = objetoImagen.codigo;
                                //Obtener los valores introducidos por el usuario (denominación, descripción y el nombre del archivo de la imagen)
                                var denominacion = $(evento).parent().siblings("input").val();
                                var descripcion = $(evento).parent().siblings("textarea").val();
                                var nombreImagen = $(evento).parent().parent().siblings("#imagen_card").val().replace(/[A-Za-z]:\\fakepath\\/i, '');
                                if (nombreImagen == "")
                                {
                                    //Al ser vacía la cadena indica que el usuario no ha modificado la imagen, por lo que se vuelve a guardar la ruta existente
                                    nombreImagen = objetoImagen.ruta;
                                }//if
                                else
                                {
                                    //Se señala que será necesario subir al servidor la nueva imagen
                                    subirImagen = true;
                                }//else
                                //Crear y lanzar una query a la BD para actualizar el registro en curso
                                //Se ordena la inserción por AJAX
                                $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'EDITAR_IMAGEN',
                                                        parametros: [   'ssss',
                                                                        denominacion,
                                                                        descripcion,
                                                                        nombreImagen,
                                                                        codigo
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    //Se obtienen los datos del nuevo registro modificado
                                                    //Se podrían usuar los datos que se han enviado a la consulta pero de esta forma nos aseguramos
                                                    //de que cargamos los que están en la base de datos
                                                    var res = JSON.parse(respuesta);
                                                    //Actualizar los datos del objeto Imagen (denominación, descripción y ruta)
                                                    objetoImagen.denominacion = res[0]["MD_DENOMINACION"];
                                                    objetoImagen.descripcion = res[0]["MD_DESCRIPCION"];
                                                    objetoImagen.ruta = res[0]["MD_RUTA"];
                                                    //Cambiar el estado de la carta a modo visualización
                                                    $(evento).parent().siblings("h5").text(objetoImagen.denominacion);
                                                    $(evento).parent().siblings("p").text(objetoImagen.descripcion);
                                                    $(evento).parent().siblings("input").removeClass("ver");
                                                    $(evento).parent().siblings("input").addClass("ocultar");
                                                    $(evento).parent().siblings("textarea").removeClass("ver");
                                                    $(evento).parent().siblings("textarea").addClass("ocultar");
                                                    $(evento).parent().siblings("h5").removeClass("ocultar");
                                                    $(evento).parent().siblings("h5").addClass("ver");
                                                    $(evento).parent().siblings("p").removeClass("ocultar");
                                                    $(evento).parent().siblings("p").addClass("ver");
                                                    $(evento).text("Editar");
                                                    $(evento).next().text("Eliminar");
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });        
                                //Se sube la foto al servidor mediante AJAX si se ha cambiado la foto
                                //Se debería eliminar antes del servidor la imagen anterior para no dejar archivos obsoletos
                                if (subirImagen)
                                {
                                    var formData = new FormData();
                                    var editableFoto = $(evento).parent().parent().siblings("#imagen_card");
                                    formData.append('imagen_card',  editableFoto[0].files[0]);
                                    formData.append('nombre', nombreImagen);
                                
                                    $.ajax({
                                            //La comunicación con el servidor será mediante POST
                                            method: 'POST',
                                            //Se indica el archivo php que subirá la foto al servidor
                                            url: '../php/subirImagen.php',
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

                                //Cambiar el estado del sitio a NAVEGACIÓN
                                EstablecerModoTrabajo("NAVEGACIÓN");
                            }//if
                        }//else if
                        else if (modoTrabajo == "NAVEGACIÓN")
                        {
                            EstablecerModoTrabajo("EDICIÓN");
                            //Se activa la carta actual
                            $(evento).parent().parent().parent().removeClass("desactivar");
                            //Se obtiene el código de la imagen
                            var code = parseInt($(evento).parent().parent().siblings().first().text());
                            //Se muestra el input de la denominación
                            $(evento).parent().siblings("input").addClass("ver");
                            $(evento).parent().siblings("input").removeClass("ocultar");
                            //Se carga el input de denominación
                            $(evento).parent().siblings("input").val(coleccionImagenes.get(code).denominacion);
                            //Se muestra el textarea de la descripción
                            $(evento).parent().siblings("textarea").addClass("ver");
                            $(evento).parent().siblings("textarea").removeClass("ocultar");
                            //Se carga el textarea de la descripción
                            $(evento).parent().siblings("textarea").val(coleccionImagenes.get(code).descripcion);
                            //Se oculta el h5 de la denominación
                            $(evento).parent().siblings("h5").addClass("ocultar");
                            $(evento).parent().siblings("h5").removeClass("ver");
                            //Se oculta el párrafo de la descripción
                            $(evento).parent().siblings("p").addClass("ocultar");
                            $(evento).parent().siblings("p").removeClass("ver");
                            //Se cambia el texto del botón izquierdo
                            $(evento).text("Aceptar");
                            //Se cambia el texto del botón derecho
                            $(evento).next().text("Cancelar");
                        }//else if
                    }//OnClickBtnIzdo

                    //Pulsación sobre el botón derecho de la carta de una imagen
                    function OnClickBtnDcho(e, evento, objetoImagen)
                    {
                        //Se evita la propagación del evento click
                        e.stopPropagation();
                        //Hay que comprobar si la carta a la que pertenece el botón sobre el que se ha hecho click
                        //está seleccionada. Si no, hay que seleccionarla
                        var cod = $($(evento).parent().parent().parent().children()[0]).text();
                        if (cod != imagenActual)
                        {
                            $("#contenedor_cartas_imagenes").children().css("border", "0px");
                            //Se marca la carta actual
                            $(evento).parent().parent().parent().css("border", "1px solid blue");
                            //Se actualiza la imagen actual
                            imagenActual = objetoImagen.codigo;
                        }//if

                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            /*
                                Se solicita permiso para eliminar la imagen.
                                Si está en uso en algún test no se permitirá la eliminación
                                Si se permite, entonces se pide confirmación de la eliminación al usuario
                                Finalmente si todo es favorable, se elimina
                            */
                           Permiso("MEDIO", "IMAGEN", imagenActual, evento, objetoImagen);
                        }//if
                        else if (modoTrabajo == "INSERCIÓN")
                        {
                            //Se aborta la creación de una nueva imagen
                            if (confirm("¿Desea abortar la inserción de la nueva imagen?"))
                            {
                                //Se elimina la carta recién creada
                                $(evento).parent().parent().parent().remove();
                                //Se elimina el objeto Imagen creado
                                objetoImagen = null;
                                //Se cambia el modo a NAVEGACIÓN
                                EstablecerModoTrabajo("NAVEGACIÓN");
                            }//if
                        }//else if
                        else if (modoTrabajo == "EDICIÓN")
                        {
                            //Se aborta la edición en curso
                            if (confirm("¿Desea abortar la modificación de la imagen?"))
                            {
                                //Se restituyen los datos de la carta
                                //Imagen
                                var imagen = "../media/Imagenes/" + objetoImagen.ruta;
                                $(evento).parent().parent().siblings("#visor_imagen_card").attr("src", imagen);
                                $(evento).parent().siblings("h5").text(objetoImagen.denominacion);
                                $(evento).parent().siblings("p").text(objetoImagen.descripcion);
                                $(evento).parent().siblings("input").removeClass("ver");
                                $(evento).parent().siblings("input").addClass("ocultar");
                                $(evento).parent().siblings("textarea").removeClass("ver");
                                $(evento).parent().siblings("textarea").addClass("ocultar");
                                $(evento).parent().siblings("h5").removeClass("ocultar");
                                $(evento).parent().siblings("h5").addClass("ver");
                                $(evento).parent().siblings("p").removeClass("ocultar");
                                $(evento).parent().siblings("p").addClass("ver");
                                $(evento).text("Eliminar");
                                $(evento).prev().text("Editar");
                                //Se cambia el modo a NAVEGACIÓN
                                EstablecerModoTrabajo("NAVEGACIÓN");
                            }//if
                        }//else if
                    }//OnClickBtnDcho

                    //Pulsación sobre el botón para adjuntar la imagen actualmente seleccionada al test en curso
                    $("#btn_adjuntar_imagen").click(function(){
                        //Se solicita confirmación
                        if (confirm("¿Desea adjuntar la imagen actualmente seleccionada al elemento del test en curso?\nCaso de existir ya un elemento será sustituido"))
                        {
                            var img = "../media/Imagenes/" + coleccionImagenes.get(imagenActual).ruta;
                            //Se borra el medio existente
                            if ($(elementoTestEnCurso).find("div").length > 1)
                            {
                                $(elementoTestEnCurso).find("div").last().remove();
                            }//if
                            //Se crea un medio adjunto nuevo
                            var medioAdjunto = Factoria("div", [["class", "contenedor_medio centrar"],["id", "contenedor_medio"]], "");
                            var medioCodigo = Factoria("input", [["type", "hidden"],["id", "medio_imagen_codigo"]], imagenActual);
                            var medioImagen = Factoria("img", [["src", img],["class", "foto"],["id", "visor_imagen_card"],["alt", ""]], "");

                            medioAdjunto.appendChild(medioCodigo);
                            medioAdjunto.appendChild(medioImagen);

                            $(elementoTestEnCurso).append(medioAdjunto);
                        }//if                        
                    })

                /////////////////////////////////////////////////////////////
                //---------    EVENTOS DE GESTIÓN DE VÍDEOS    ------------//
                /////////////////////////////////////////////////////////////

                    //Pulsación sobre la entrada del menú VÍDEOS
                    $("#barra_nav_medios li:nth-child(3) > a").click(function(){
                        //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            //Se actualiza el área de trabajo en curso
                            areaTrabajo = "VÍDEOS";
                            //Se oculta el botón de cancelar la inserción
                            $("#btn_cancelar_insertar_video").css("display", "none");
                            if (!inicializadosVideos)
                            {
                                //Se crea el conjunto de objetos Video extrayendo los datos de la base de datos
                                FiltrarMedia('VIDEO');
                                inicializadosVideos = true;
                            }//if
                            //Se visualiza la sección de la gestión de vídeos
                            $("#textos").css("display", "none");
                            $("#imagenes").css("display", "none");
                            $("#videos").css("display", "block");
                            $("#audios").css("display", "none");

                            //Se marca la entrada de menú correspondiente a esta página
                            $("#barra_nav_medios li").css("background-color", colorFondoEntradaMenuMedios);
                            $("#barra_nav_medios li:nth-child(3)").css("background-color", colorFondoEntradaMenuMediosSeleccionado);
                        }//if
                        //Se evita el link
                        return false;
                    })

                    //Pulsación sobre el botón de Insertar nuevo vídeo
                    $("#btn_insertar_video").click(function(){
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            //Se cambia el modo de trabajo a INSERCIÓN
                            EstablecerModoTrabajo("INSERCIÓN");
                        }//if
                    })

                    //Pulsación sobre una carta de vídeo
                    function OnClickVideoCard(evento, objetoVideo)
                    {
                        if ((videoActual == -1)||(videoActual ==""))
                        {
                            //Se marca la carta actual
                            $(evento).css("border", "1px solid blue");
                            //Se actualiza el vídeo actual
                            videoActual = objetoVideo.codigo;      
                        }//if
                        else
                        {
                            if (coleccionVideos.get(videoActual).ruta != objetoVideo.ruta)
                            {
                                //La selección ha cambiado luebo se desmarcan las cartas
                                $("#contenedor_cartas_videos").children().css("border", "0px");
                                //Se marca la carta actual
                                $(evento).css("border", "1px solid blue");
                                //Se actualiza la imagen actual
                                videoActual = objetoVideo.codigo;      
                            }//if
                        }//else
                    }//OnClickVideoCard

                    //Pulsación sobre el vídeo
                    function OnClickVideo(evento, objetoVideo)
                    {
                        if ((modoTrabajo == "INSERCIÓN")||(modoTrabajo == "EDICIÓN"))
                        {
                            if ($(evento).parent().hasClass("desactivar") == false)
                            {
                                $(evento).next().click();
                            }//if
                        }//if
                    }//OnClickVideo

                    //Carga el vídeo seleccionado por el usuario
                    function OnChangeVideo(evento, objetoVideo)
                    {
                        //Obtenemos el archivo del vídeo desde el input file
                        let video = evento.files[0];
                        var peso = video.size / 1024;
                        //Se hace una comprobación de la idoneidad del formato del archivo para asegurar que se trata de un vídeo
                        //También se comprueba el tamaño para no exceder los 2MB que admite el servidor en la tranferencia
                        if ((video.type != "video/mp4") && (video.type != "video/ogg") && (video.type != "video/webm") && (video.type != "video/avi"))
                        {
                            alert("Formato de archivo no admitido!\nEl vídeo debe ser mp4, ogg, webm o avi");
                        }//if
                        else if (peso >= 512000)
                        {
                            alert("El tamaño máximo del archivo debe ser 500MB!\nReduzca su tamaño");
                        }//else if
                        else
                        {
                            //Se instancia un objeto FileReader para leer el archivo
                            let reader = new FileReader();
                            //Leemos el archivo como URL
                            /*
                                readAsDataURL devuelve una cadena que puede ser insertada en el atributo url de una etiqueta
                                HTML tal como el atributo src de un video. En ese caso, se mostrará el vídeo de igual forma que si
                                se hubiera escrito una dirección en el atributo src
                            */
                            reader.readAsDataURL(video);
                            /*
                                La carga del archivo por el FileReader se realiza asíncronamente por lo que disponemos de un
                                manejador de evento para que cuando se termine de cargar el archivo se ejecuten las acciones
                                que necesitamos
                            */
                            reader.onload = function(e){
                                //Una vez leído el archivo del vídeo, éste se encuentra en formato URL en el atributo result
                                //Esta sentencia, efectivamente, dibuja el vídeo dentro del elemento video
                                $(evento).prev().attr('src', e.target.result + "#t=0.5");
                            };
                        }//else
                    }

/*                    //Cuando el ratón entra en un vídeo
                    function OnVideoMouseEnter(evento, objetoVideo)
                    {
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            
                            evento.controls = true;
                            //Se visualizan los 5 segundos primeros del vídeo sin audio
                            var fuente = $(evento).attr("src");
                            //$(evento).attr("src", fuente + "#t=,5");
                            evento.src = fuente + "#t=,5";
                            evento.muted = true;
                            evento.play();
                            videoprevis = true;
                        }//if
                    }//OnVideoMouseEnter

                    //Cuando el ratón sale de un vídeo
                    function OnVideoMouseLeave(evento, objetoVideo)
                    {
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            evento.controls = false;
                            var fuente = $(evento).attr("src");
                            $(evento).attr("src", fuente.split("#")[0]);
                            evento.muted = false;
                            videoprevis = false;
                            //evento.pause();
                        }//if
                    }//OnVideoMouseLeave

                    function OnPlayVideo(evento, objetoVideo)
                    {
                        if (videoprevis)
                        {
                            var b = 0;
                        }//if
                        var a = evento;
                    }//OnPlayVideo
*/
                    //Pulsación sobre el botón izquierdo de la carta de un vídeo
                    function OnClickBtnIzdoVideo(e, evento, objetoVideo)
                    {
                        //Se evita la propagación del evento click
                        e.stopPropagation();
                        //Hay que comprobar si la carta a la que pertenece el botón sobre el que se ha hecho click
                        //está seleccionada. Si no, hay que seleccionarla
                        var cod = $($(evento).parent().parent().parent().children()[0]).text();
                        if (cod != videoActual)
                        {
                            $("#contenedor_cartas_videos").children().css("border", "0px");
                            //Se marca la carta actual
                            $(evento).parent().parent().parent().css("border", "1px solid blue");
                            //Se actualiza la imagen actual
                            videoActual = objetoVideo.codigo;
                        }//if
                        if (modoTrabajo == "INSERCIÓN")
                        {
                            //Solicitar confirmación de la inserción
                            if (confirm("¿Desea añadir el nuevo elemento?"))
                            {
                                //Obtener los valores introducidos por el usuario (denominación, descripción y el nombre del archivo del vídeo)
                                var tipo = "VIDEO";
                                var denominacion = $(evento).parent().siblings("input").val();
                                var descripcion = $(evento).parent().siblings("textarea").val();
                                var nombreVideo = $(evento).parent().parent().siblings("#video_card").val().replace(/[A-Za-z]:\\fakepath\\/i, '');
                                //Crear y lanzar una query a la BD para insertar un nuevo registro con esos datos
                                //Se ordena la inserción por AJAX
                                $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'INSERTAR_VIDEO',
                                                        parametros: [   'ssss',
                                                                        tipo,
                                                                        denominacion,
                                                                        descripcion,
                                                                        nombreVideo
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    //Se obtiene el id del usuario recién insertado
                                                    var res = JSON.parse(respuesta);
                                                    //Obtener el Código del registro recién insertado e introducirlo en el campo hidden de la carta
                                                    //$(evento).parent().parent().siblings("#cardCode").val(res[0]["MD_CODE"]);
                                                    $(evento).parent().parent().siblings().first().text(res[0]["MD_CODE"]);
                                                    //Actualizar los datos del objeto Video (código, denominación, descripción y ruta)
                                                    objetoVideo.codigo = res[0]["MD_CODE"];
                                                    objetoVideo.denominacion = res[0]["MD_DENOMINACION"];
                                                    objetoVideo.descripcion = res[0]["MD_DESCRIPCION"];
                                                    objetoVideo.ruta = res[0]["MD_RUTA"];
                                                    //Añadir el objeto Video a la coleccion
                                                    coleccionVideos.set(objetoVideo.codigo, objetoVideo);
                                                    //Cambiar el estado de la carta a modo visualización
                                                    $(evento).parent().siblings("h5").text(objetoVideo.denominacion);
                                                    $(evento).parent().siblings("p").text(objetoVideo.descripcion);
                                                    $(evento).parent().siblings("input").removeClass("ver");
                                                    $(evento).parent().siblings("input").addClass("ocultar");
                                                    $(evento).parent().siblings("textarea").removeClass("ver");
                                                    $(evento).parent().siblings("textarea").addClass("ocultar");
                                                    $(evento).parent().siblings("h5").removeClass("ocultar");
                                                    $(evento).parent().siblings("h5").addClass("ver");
                                                    $(evento).parent().siblings("p").removeClass("ocultar");
                                                    $(evento).parent().siblings("p").addClass("ver");
                                                    $(evento).text("Editar");
                                                    $(evento).next().text("Eliminar");
                                                    //Se establece el vídeo actual
                                                    videoActual = objetoVideo.codigo;
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });        
                                //Se sube el vídeo al servidor mediante AJAX si se ha cargado uno
                                if (nombreVideo != "")
                                {
                                    var formData = new FormData();
                                    var editableVideo = $(evento).parent().parent().siblings("#video_card");
                                    var a = editableVideo[0];
                                    var b = a.files[0];
                                    formData.append('video_card',  editableVideo[0].files[0]);
                                    formData.append('nombre', nombreVideo);
                                
                                    $.ajax({
                                            //La comunicación con el servidor será mediante POST
                                            method: 'POST',
                                            //Se indica el archivo php que subirá el vídeo al servidor
                                            url: '../php/subirVideo.php',
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

                                //Cambiar el estado del sitio a NAVEGACIÓN
                                EstablecerModoTrabajo("NAVEGACIÓN");
                            }//if
                        }//if
                        else if (modoTrabajo == "EDICIÓN")
                        {
                            //Solicitar confirmación de la actualización
                            if (confirm("¿Desea actualizar el elemento?"))
                            {
                                //Bandera que señaliza si el usuario ha modificado el vídeo pues habrá que subir el archivo al servidor
                                var subirVideo = false;
                                //Obtener el código del vídeo a actualizar
                                //Al ser una actualización el código no cambia pues no es accesible al usuario
                                var codigo = objetoVideo.codigo;
                                //Obtener los valores introducidos por el usuario (denominación, descripción y el nombre del archivo del vídeo)
                                var denominacion = $(evento).parent().siblings("input").val();
                                var descripcion = $(evento).parent().siblings("textarea").val();
                                var nombreVideo = $(evento).parent().parent().siblings("#video_card").val().replace(/[A-Za-z]:\\fakepath\\/i, '');
                                if (nombreVideo == "")
                                {
                                    //Al ser vacía la cadena indica que el usuario no ha modificado el vídeo, por lo que se vuelve a guardar la ruta existente
                                    nombreVideo = objetoVideo.ruta;
                                }//if
                                else
                                {
                                    //Se señala que será necesario subir al servidor el nuevo vídeo
                                    subirVideo = true;
                                }//else
                                //Crear y lanzar una query a la BD para actualizar el registro en curso
                                //Se ordena la inserción por AJAX
                                $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'EDITAR_VIDEO',
                                                        parametros: [   'ssss',
                                                                        denominacion,
                                                                        descripcion,
                                                                        nombreVideo,
                                                                        codigo
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    //Se obtienen los datos del nuevo registro modificado
                                                    //Se podrían usuar los datos que se han enviado a la consulta pero de esta forma nos aseguramos
                                                    //de que cargamos los que están en la base de datos
                                                    var res = JSON.parse(respuesta);
                                                    //Actualizar los datos del objeto Video (denominación, descripción y ruta)
                                                    objetoVideo.denominacion = res[0]["MD_DENOMINACION"];
                                                    objetoVideo.descripcion = res[0]["MD_DESCRIPCION"];
                                                    objetoVideo.ruta = res[0]["MD_RUTA"];
                                                    //Cambiar el estado de la carta a modo visualización
                                                    $(evento).parent().siblings("h5").text(objetoVideo.denominacion);
                                                    $(evento).parent().siblings("p").text(objetoVideo.descripcion);
                                                    $(evento).parent().siblings("input").removeClass("ver");
                                                    $(evento).parent().siblings("input").addClass("ocultar");
                                                    $(evento).parent().siblings("textarea").removeClass("ver");
                                                    $(evento).parent().siblings("textarea").addClass("ocultar");
                                                    $(evento).parent().siblings("h5").removeClass("ocultar");
                                                    $(evento).parent().siblings("h5").addClass("ver");
                                                    $(evento).parent().siblings("p").removeClass("ocultar");
                                                    $(evento).parent().siblings("p").addClass("ver");
                                                    $(evento).text("Editar");
                                                    $(evento).next().text("Eliminar");
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });        
                                //Se sube el vídeo al servidor mediante AJAX si se ha cambiado
                                //Se debería eliminar antes del servidor el vídeo anterior para no dejar archivos obsoletos
                                if (subirVideo)
                                {
                                    var formData = new FormData();
                                    var editableVideo = $(evento).parent().parent().siblings("#video_card");
                                    formData.append('video_card',  editableVideo[0].files[0]);
                                    formData.append('nombre', nombreVideo);
                                
                                    $.ajax({
                                            //La comunicación con el servidor será mediante POST
                                            method: 'POST',
                                            //Se indica el archivo php que subirá el vídeo al servidor
                                            url: '../php/subirVideo.php',
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

                                //Cambiar el estado del sitio a NAVEGACIÓN
                                EstablecerModoTrabajo("NAVEGACIÓN");
                            }//if
                        }//else if
                        else if (modoTrabajo == "NAVEGACIÓN")
                        {
                            EstablecerModoTrabajo("EDICIÓN");
                            //Se activa la carta actual
                            $(evento).parent().parent().parent().removeClass("desactivar");
                            //Se obtiene el código del vídeo
                            var code = parseInt($(evento).parent().parent().siblings().first().text());
                            //Se muestra el input de la denominación
                            $(evento).parent().siblings("input").addClass("ver");
                            $(evento).parent().siblings("input").removeClass("ocultar");
                            //Se carga el input de denominación
                            $(evento).parent().siblings("input").val(coleccionVideos.get(code).denominacion);
                            //Se muestra el textarea de la descripción
                            $(evento).parent().siblings("textarea").addClass("ver");
                            $(evento).parent().siblings("textarea").removeClass("ocultar");
                            //Se carga el textarea de la descripción
                            $(evento).parent().siblings("textarea").val(coleccionVideos.get(code).descripcion);
                            //Se oculta el h5 de la denominación
                            $(evento).parent().siblings("h5").addClass("ocultar");
                            $(evento).parent().siblings("h5").removeClass("ver");
                            //Se oculta el párrafo de la descripción
                            $(evento).parent().siblings("p").addClass("ocultar");
                            $(evento).parent().siblings("p").removeClass("ver");
                            //Se cambia el texto del botón izquierdo
                            $(evento).text("Aceptar");
                            //Se cambia el texto del botón derecho
                            $(evento).next().text("Cancelar");
                        }//else if
                    }//OnClickBtnIzdoVideo

                    //Pulsación sobre el botón derecho de la carta de un vídeo
                    function OnClickBtnDchoVideo(e, evento, objetoVideo)
                    {
                        //Se evita la propagación del evento click
                        e.stopPropagation();
                        //Hay que comprobar si la carta a la que pertenece el botón sobre el que se ha hecho click
                        //está seleccionada. Si no, hay que seleccionarla
                        var cod = $($(evento).parent().parent().parent().children()[0]).text();
                        if (cod != videoActual)
                        {
                            $("#contenedor_cartas_videos").children().css("border", "0px");
                            //Se marca la carta actual
                            $(evento).parent().parent().parent().css("border", "1px solid blue");
                            //Se actualiza la imagen actual
                            videoActual = objetoVideo.codigo;
                        }//if
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            /*
                                Se solicita permiso para eliminar el vídeo.
                                Si está en uso en algún test no se permitirá la eliminación
                                Si se permite, entonces se pide confirmación de la eliminación al usuario
                                Finalmente si todo es favorable, se elimina
                            */
                           Permiso("MEDIO", "VÍDEO", videoActual, evento, objetoVideo);
                        }//if
                        else if (modoTrabajo == "INSERCIÓN")
                        {
                            //Se aborta la creación de un nuevo vídeo
                            if (confirm("¿Desea abortar la inserción del nuevo vídeo?"))
                            {
                                //Se elimina la carta recién creada
                                $(evento).parent().parent().parent().remove();
                                //Se elimina el objeto Video creado
                                objetoVideo = null;
                                //Se cambia el modo a NAVEGACIÓN
                                EstablecerModoTrabajo("NAVEGACIÓN");
                            }//if
                        }//else if
                        else if (modoTrabajo == "EDICIÓN")
                        {
                            //Se aborta la edición en curso
                            if (confirm("¿Desea abortar la modificación del vídeo?"))
                            {
                                //Se restituyen los datos de la carta
                                //Video
                                var video = "../media/Videos/" + objetoVideo.ruta;
                                $(evento).parent().parent().siblings("#visor_video_card").attr("src", video);
                                $(evento).parent().siblings("h5").text(objetoVideo.denominacion);
                                $(evento).parent().siblings("p").text(objetoVideo.descripcion);
                                $(evento).parent().siblings("input").removeClass("ver");
                                $(evento).parent().siblings("input").addClass("ocultar");
                                $(evento).parent().siblings("textarea").removeClass("ver");
                                $(evento).parent().siblings("textarea").addClass("ocultar");
                                $(evento).parent().siblings("h5").removeClass("ocultar");
                                $(evento).parent().siblings("h5").addClass("ver");
                                $(evento).parent().siblings("p").removeClass("ocultar");
                                $(evento).parent().siblings("p").addClass("ver");
                                $(evento).text("Eliminar");
                                $(evento).prev().text("Editar");
                                //Se cambia el modo a NAVEGACIÓN
                                EstablecerModoTrabajo("NAVEGACIÓN");
                            }//if
                        }//else if
                    }//OnClickBtnDchoVideo

                    //Pulsación sobre el botón para adjuntar el vídeo actualmente seleccionado al test en curso
                    $("#btn_adjuntar_video").click(function(){
                        //Se solicita confirmación
                        if (confirm("¿Desea adjuntar el vídeo actualmente seleccionado al elemento del test en curso?\nCaso de existir ya un elemento será sustituido"))
                        {
                            var vid = "../media/Videos/" + coleccionVideos.get(videoActual).ruta;
                            //Se borra el medio existente
                            if ($(elementoTestEnCurso).find("div").length > 1)
                            {
                                $(elementoTestEnCurso).find("div").last().remove();
                            }//if
                            //Se crea un medio adjunto nuevo
                            var medioAdjunto = Factoria("div", [["class", "contenedor_medio centrar"],["id", "contenedor_medio"]], "");
                            var medioCodigo = Factoria("input", [["type", "hidden"],["id", "medio_video_codigo"]], videoActual);
                            var medioVideo = Factoria("video", [["src", vid],["controls", "true"],["preload", "metadata"],["class", "foto"],["id", "visor_video_card"],["alt", ""]], "");
                            
                            medioAdjunto.appendChild(medioCodigo);
                            medioAdjunto.appendChild(medioVideo);

                            $(elementoTestEnCurso).append(medioAdjunto);
                        }//if                        
                    })

                /////////////////////////////////////////////////////////////
                //---------    EVENTOS DE GESTIÓN DE AUDIOS    ------------//
                /////////////////////////////////////////////////////////////

                    //Pulsación sobre la entrada del menú AUDIOS
                    $("#barra_nav_medios li:last-child > a").click(function(){
                        //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            //Se actualiza el área de trabajo en curso
                            areaTrabajo = "AUDIOS";
                            if (!inicializadosAudios)
                            {
                                //Se extrae el conjunto de audios de la base de datos
                                FiltrarMedia('AUDIO');
                                inicializadosAudios = true;
                            }//if
                            //Se visualiza la sección de la gestión de audios
                            $("#textos").css("display", "none");
                            $("#imagenes").css("display", "none");
                            $("#videos").css("display", "none");
                            $("#audios").css("display", "block");

                            //Se marca la entrada de menú correspondiente a esta página
                            $("#barra_nav_medios li").css("background-color", colorFondoEntradaMenuMedios);
                            $("#barra_nav_medios li:last-child").css("background-color", colorFondoEntradaMenuMediosSeleccionado);
                        }//if
                        //Se evita el link
                        return false;
                    })

                    //Pulsación sobre la tabla de audios
                    function OnClickTablaAudios()
                    {
                        //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            if (this.rowIndex >= 0)
                            {
                                //Selección del nodo tr sobre el que se ha hecho click
                                let hijos = $(this).children();
                                if (hijos[0].nodeName != 'TH')
                                {
                                    SeleccionarFilaTabla("audios", hijos);
                                    var coleccion = $("#tabla_audios tbody tr");
                                    for (let cont = 1; cont < coleccion.length; cont++)
                                    {
                                        if (coleccion[cont].children[0].innerText != hijos[0].innerText)
                                        {
                                            coleccion[cont].children[3].children[0].pause();
                                            pausaOrdenada = true;
                                            filaEnReproduccion = -1;
                                        }//if
                                    }//for

                                }//if     
                            }//if
                        }//if  
                    }//OnClickTablaAudios

                    //Carga el audio seleccionado por el usuario
                    function OnChangeAudio(evento, objetoAudio)
                    {
                        //Obtenemos el archivo del audio desde el input file
                        let audio = evento.files[0];
                        var peso = audio.size / 1024;
                        //Se hace una comprobación de la idoneidad del formato del archivo para asegurar que se trata de un audio
                        //También se comprueba el tamaño para no exceder los 500MB que admite el servidor en la tranferencia
                        if ( (audio.type != "audio/mp4") &&
                             (audio.type != "audio/ogg") &&
                             (audio.type != "audio/mp3") &&
                             (audio.type != "audio/aac") &&
                             (audio.type != "audio/mpeg"))
                        {
                            alert("Formato de archivo no admitido!\nEl audio debe ser mp3, mp4, AAC o Vorbis");
                        }//if
                        else if (peso >= 512000)
                        {
                            alert("El tamaño máximo del archivo debe ser 500MB!\nReduzca su tamaño");
                        }//else if
                        else
                        {
                            //Se instancia un objeto FileReader para leer el archivo
                            let reader = new FileReader();
                            //Leemos el archivo como URL
                            /*
                                readAsDataURL devuelve una cadena que puede ser insertada en el atributo url de una etiqueta
                                HTML tal como el atributo src de un audio. En ese caso, se mostrará el audio de igual forma que si
                                se hubiera escrito una dirección en el atributo src
                            */
                            reader.readAsDataURL(audio);
                            /*
                                La carga del archivo por el FileReader se realiza asíncronamente por lo que disponemos de un
                                manejador de evento para que cuando se termine de cargar el archivo se ejecuten las acciones
                                que necesitamos
                            */
                            reader.onload = function(e){
                                //Una vez leído el archivo del audio, éste se encuentra en formato URL en el atributo result
                                //Esta sentencia, efectivamente, presenta el audio dentro del elemento audio
                                $(evento).parent().children("audio").attr('src', e.target.result);
                            };
                        }//else
                    }

                    //Pulsación sobre el botón izquierdo de los registros de la tabla de audios
                    function OnClickBtnIzdoAudio(e)
                    {
                        //Se evita la propagación del evento click
                        e.stopPropagation();

                        var boton = e.target;
                        var celdaBoton = $(boton).parent();
                        var fila = $(celdaBoton).parent();

                        var id = $($(fila).children()[0]).text();

                        //Si el botón pulsado no pertenece a la fila actualmente seleccionada, se selecciona
                        if (id != audioActual[0])
                        {
                            SeleccionarFilaTabla("audios", $(fila).children());
                        }//if

                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            EstablecerModoTrabajo("EDICIÓN");
                        }//if
                        else if ((modoTrabajo == "INSERCIÓN")&&(id == ""))
                        {
                            //Se solicita confirmación de inserción
                            if (confirm("¿Desea subir a la base de datos el audio actual?"))
                            {
                                //Obtener los valores introducidos por el usuario (denominación, descripción y el nombre del archivo del audio)
                                var tipo = "AUDIO";

                                var celda = $(fila).children()[1];
                                var denominacion = $(celda).children("input").val();
                                celda = $(fila).children()[2];
                                var descripcion = $(celda).children("input").val();
                                celda = $(fila).children()[3];
                                var nombreAudio = $(celda).children("input").val().replace(/[A-Za-z]:\\fakepath\\/i, '');
 
                                //Crear y lanzar una query a la BD para insertar un nuevo registro con esos datos
                                //Se ordena la inserción por AJAX
                                $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'INSERTAR_AUDIO',
                                                        parametros: [   'ssss',
                                                                        tipo,
                                                                        denominacion,
                                                                        descripcion,
                                                                        nombreAudio
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    //Se obtiene el id del audio recién insertado
                                                    var res = JSON.parse(respuesta);
                                                    //Se establecen los valores como audio actual
                                                    audioActual = [];
                                                    audioActual[0] = res[0]["MD_CODE"];
                                                    audioActual[1] = res[0]["MD_DENOMINACION"];
                                                    audioActual[2] = res[0]["MD_DESCRIPCION"];
                                                    audioActual[3] = res[0]["MD_RUTA"];
                                                    //Se inserta el código
                                                    celda = $(fila).children()[0];
                                                    $(celda).text(audioActual[0]);

                                                    //Cambiar el estado del sitio a NAVEGACIÓN
                                                    EstablecerModoTrabajo("NAVEGACIÓN");
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });        
                                //Se sube el audio al servidor mediante AJAX si se ha cargado uno
                                if (nombreAudio != "")
                                {
                                    var formData = new FormData();
                                    celda = $(fila).children()[3];
                                    var editableAudio = $(celda).children("input");
                                    formData.append('audio_file',  editableAudio[0].files[0]);
                                    formData.append('nombre', nombreAudio);
                                
                                    $.ajax({
                                            //La comunicación con el servidor será mediante POST
                                            method: 'POST',
                                            //Se indica el archivo php que subirá el audio al servidor
                                            url: '../php/subirAudio.php',
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
                        }//else if
                        else if ((modoTrabajo == "EDICIÓN")&&(id == audioActual[0]))
                        {
                            //Se solicita confirmación de la edición
                            if (confirm("¿Desea actualizar el audio?"))
                            {
                                //Se actualiza el audio en la base de datos
                                //Se obtienen los datos
                                //CÓDIGO
                                var id = audioActual[0];
                                //DENOMINACIÓN
                                var celda = $(fila).children()[1];
                                var denominacion = $(celda).children("input").val();
                                //DESCRIPCIÓN
                                celda = $(fila).children()[2];
                                var descripcion = $(celda).children("input").val();
                                //AUDIO
                                celda = $(fila).children()[3];
                                var nombreAudio = $(celda).children("input").val().replace(/[A-Za-z]:\\fakepath\\/i, '');
                                if (nombreAudio == "")
                                {
                                    nombreAudio = audioActual[4];
                                }//if

                                //Se ordena la actualización por AJAX
                                $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'EDITAR_AUDIO',
                                                        parametros: [   'ssss',
                                                                        denominacion,
                                                                        descripcion,
                                                                        nombreAudio,
                                                                        id
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    var res = JSON.parse(respuesta);
                                                    //Se actualizan los valores del audio actual
                                                    audioActual = [];
                                                    audioActual[0] = res[0]["MD_CODE"];
                                                    audioActual[1] = res[0]["MD_DENOMINACION"];
                                                    audioActual[2] = res[0]["MD_DESCRIPCION"];
                                                    audioActual[3] = res[0]["MD_RUTA"];

                                                    EstablecerModoTrabajo("NAVEGACIÓN");
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });  
                            }//if
                            else
                            {
                                return;
                            }//else                            
                        }//else if
                    }//OnClickBtnIzdoAudio

                    //Pulsación sobre el botón derecho de los registros de la tabla de audios
                    function OnClickBtnDchoAudio(e)
                    {
                        //Se evita la propagación del evento click
                        e.stopPropagation();

                        var boton = e.target;
                        var celdaBoton = $(boton).parent();
                        var fila = $(celdaBoton).parent();

                        var id = $($(fila).children()[0]).text();

                        //Si el botón pulsado no pertenece a la fila actualmente seleccionada, se selecciona
                        if (id != audioActual[0])
                        {
                            SeleccionarFilaTabla("audios", $(fila).children());
                        }//if

                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            /*
                                Se solicita permiso para eliminar el audio.
                                Si está en uso en algún test no se permitirá la eliminación
                                Si se permite, entonces se pide confirmación de la eliminación al usuario
                                Finalmente si todo es favorable, se elimina
                            */
                           Permiso("MEDIO", "AUDIO", audioActual[0], null, null);
                        }//if
                        else if ((modoTrabajo == "EDICIÓN")&&(id == audioActual[0]))
                        {
                            //Se solicita confirmación para cancelar la actualización
                            if (confirm("¿Desea cancelar la edición del audio actual?"))
                            {
                                EstablecerModoTrabajo("NAVEGACIÓN");
                            }//if
                        }//else if
                        else if ((modoTrabajo == "INSERCIÓN")&&(id == ""))
                        {
                            //Se activa el menú principal
                            $("#barra_nav").removeClass("desactivar");
                            //Se activa el menú secundario
                            $("#barra_nav_medios").removeClass("desactivar");
                            //Eliminación de la fila de inserción
                            $("#tabla_audios tbody tr").last().remove();
                            //Activación de las filas de la tabla de audios
                            var coleccion = $("#tabla_audios tbody tr");
                            for (let cont = 1; cont < coleccion.length; cont++)
                            {
                                //Se activa la fila
                                $(coleccion[cont]).removeClass("desactivar");
                                //Se habilitan los botones
                                $($(coleccion[cont].children[4]).children("button")).prop("disabled", false);
                                $($(coleccion[cont].children[5]).children("button")).prop("disabled", false);
                            }//for
                            //Se selecciona la fila actual
                            SeleccionarFilaTablaCodigo("audios", audioActual[0]);
                            modoTrabajo = "NAVEGACIÓN";
                        }//else if
                    }//OnClickBtnDchoAudio

                    //Pulsación sobre el reproductor de audio
                    function OnClickAudioPlayer(evento)
                    {
                        var fila = $(evento).parent().parent();
                        var id = $($(fila).children()[0]).text();
                        if (id != audioActual[0])
                        {
                            /*
                            if (modoTrabajo != "NAVEGACIÓN")
                            {
                                //No se admite la reproducción si no se está en modo Navegación
                                evento.pause();
                                return;
                            }//if
                            */
                            //Detener cualquier otro reproductor si hay alguno
                            if (filaEnReproduccion != -1)
                            {
                                var reproductor = ObtenerReproductorDeFila(filaEnReproduccion);
                                pausaOrdenada = true;
                                reproductor.pause();
                            }//if
                            //Seleccionar la nueva fila
                            SeleccionarFilaTabla("audios", $(fila).children());
                        }//if
                        //Guardar el reproductor en curso
                        filaEnReproduccion = id;
                    }//OnClickAudioPlayer

                    function OnPausedAudioPlayer(evento)
                    {
                        if (!pausaOrdenada)
                        {
                            filaEnReproduccion = -1;
                        }//if
                    }//OnPausedAudioPlayer

                    function OnEndedAudioPlayer(evento)
                    {
                        filaEnReproduccion = -1;
                        pausaOrdenada = false;
                    }//OnEndedAudioPlayer

                    //Pulsación sobre el botón de Insertar nuevo audio
                    $("#btn_insertar_audio").click(function(){
                        if (modoTrabajo == "NAVEGACIÓN")
                        {
                            //Se cambia el modo de trabajo a INSERCIÓN
                            EstablecerModoTrabajo("INSERCIÓN");
                        }//if
                    })

                    //Función para obtener el reproductor de audio de una fila dada por su código
                    function ObtenerReproductorDeFila(codigo)
                    {
                        var coleccion = $("#tabla_audios tbody tr");
                        for (let cont = 1; cont < coleccion.length; cont++)
                        {
                            if (coleccion[cont].children[0].innerText == codigo)
                            {
                                return coleccion[cont].children[3].children[0];
                            }//if
                        }//for
                    }//ObtenerReproductorDeFila

                    //Pulsación sobre el botón de Cancelar la operación de inserción
                    $("#btn_cancelar_insertar_audio").click(function(){
                        //Se cambia el modo de trabajo a NAVEGACIÓN
                        EstablecerModoTrabajo("NAVEGACIÓN");
                    })

                    //Pulsación sobre el botón para adjuntar el audio actualmente seleccionado al test en curso
                    $("#btn_adjuntar_audio").click(function(){
                        //Se solicita confirmación
                        if (confirm("¿Desea adjuntar el audio actualmente seleccionado al elemento del test en curso?\nCaso de existir ya un elemento será sustituido"))
                        {
                            //Se obtiene el contenido del audio actual
                            var aud = audioActual[4];
                            //Se borra el medio existente
                            if ($(elementoTestEnCurso).find("div").length > 1)
                            {
                                $(elementoTestEnCurso).find("div").last().remove();
                            }//if
                            //Se crea un medio adjunto nuevo
                            var medioAdjunto = Factoria("div", [["class", "contenedor_medio"],["id", "contenedor_medio"]], "");
                            var medioCodigo = Factoria("input", [["type", "hidden"],["id", "medio_audio_codigo"]], audioActual[0]);
                            var audio = "../media/Audio/" + aud;
                            var audioControl = Factoria("audio", [["src", audio],["controls", "true"],["id", "audio_player"],["alt", ""]], "");
                            medioAdjunto.appendChild(medioCodigo);
                            medioAdjunto.appendChild(audioControl);

                            $(elementoTestEnCurso).append(medioAdjunto);
                        }//if
                    })

        /////////////////////////////////////////////////////////    
        //---------   EVENTOS DE GESTIÓN DE TESTS   -----------//
        /////////////////////////////////////////////////////////

            //Pulsación sobre la entrada del menú principal TESTS
            $("#barra_nav li:nth-child(3) > a").click(function(){
                //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                if (modoTrabajo == "NAVEGACIÓN")
                {
                    //Se actualiza el área de trabajo en curso
                    areaTrabajo = "TESTS";
                    //Se visualiza la sección de la gestión de tests
                    $("#usuarios_registrados").css("display", "none");
                    $("#medios").css("display", "none");
                    $("#tests").css("display", "block");
                    $("#baterias").css("display", "none");
                    $("#planes").css("display", "none");

                    //Se marca la entrada de menú correspondiente a esta página
                    $("#barra_nav li").css("background-color", colorFondoEntradaMenuPrincipal);
                    $("#barra_nav li:nth-child(3)").css("background-color", colorFondoEntradaMenuPrincipalSeleccionado);

                    //Se desactiva el botón para cancelar la acción en curso
                    if (modoTest == "NAVEGACIÓN")
                    {
                        $("#btn_cancelar_test").prop("disabled", true);
                    }//if
                    if(!inicializadosTests)
                    {
                        modoTest = "NAVEGACIÓN";
                        FiltrarTests();
                        inicializadosTests = true;
                    }//if                  
                }//if
                //Se evita el link
                return false;
            })

            ///////////////////////////////////////////////
            //  BOTONES PRINCIPALES DE CREAR Y CANCELAR  //
            ///////////////////////////////////////////////
            //Pulsación sobre el botón para insertar nuevo test
            $("#btn_nuevo_test").click(function(){
                if (modoTest == "NAVEGACIÓN")
                {
                    //Se preparan los controles para insertar nuevo contenido
                    //Area de editables
                        //Se borran los contenidos
                        $(".contenedor_editable input").val("");
                        //Se habilitan los editables
                        $(".contenedor_editable input").prop("readonly", false);
                    //Area de enunciado
                        //Se habilita el botón para añadir elementos
                        $("#btn_insertar_elemento").css("visibility", "visible");
                        //Se borra y se habilita el texto propio del test
                        $("#texto_test").val("");
                        $("#texto_test").prop("readonly", false);
                        //Se eliminan todos los elementos existentes
                        $(".contenedor_elemento_encabezado").remove();
                        //Se muestran las mini barras de herramientas para las imágenes de las opciones
                        $(".mini_barra_herramientas_opcion").css("display", "block");
                        //Se habilitan los controles de las opciones de test
                        $(".contenedor_radio_opcion").children("input").prop("disabled", false);
                        $(".contenedor_label_opcion").children("textarea").prop("readonly", false);
                        //Se borran los textos de las opciones
                        $(".contenedor_label_opcion textarea").val("");
                        //Se eliminan las imágenes de las opciones
                        $(".imagenes_opciones").attr("src", "");

                        //Se cambia el texto del botón
                        $(this).text("Insertar test");
                        //Se activa el botón para cancelar la creación de nuevo test
                        $("#btn_cancelar_test").prop("disabled", false);
                        //Se cambia a modo de INSERCIÓN
                        modoTest = "INSERCIÓN";
                }//if
                else if (modoTest == "INSERCIÓN")
                {
                    //PROCEDIMIENTO DE GUARDADO DE LOS DATOS DEL TEST EN LA BASE DE DATOS
                        //OBTENCIÓN DE LOS DATOS
                            //DENOMINACIÓN
                            var denominacion = $("#test_denominacion").val();
                            //DESCRIPCIÓN
                            var descripcion = $("#test_descripcion").val();
                            //TEXTO PROPIO DEL TEST
                            var textoPropio = $("#texto_test").val();
                            //ENCABEZADO
                                var bloqueEncabezado = $("#contenedor_encabezado").children(".contenedor_elemento_encabezado");
                                elementosEncabezado = new Array();
                                for (var cont = 0; cont < bloqueEncabezado.length; ++cont)
                                {
                                    var encabezado = $(bloqueEncabezado)[cont];
                                    var medio = $(encabezado).find("#contenedor_medio");
                                    var contenido = $(medio).children()[0];
                                    elementosEncabezado.push(parseInt($(contenido).text()));
                                }//for
                            //OPCIONES
                                //OPCION 1
                                var textoOpcion1 = $("#contenedor_opciones #test_opcion1").val();
                                var codigoImagenOpcion1 = $("#contenedor_opciones #imagen_opcion1_codigo").text();
                                if (codigoImagenOpcion1 == "")
                                {
                                    codigoImagenOpcion1 = null;
                                }//if
                                else
                                {
                                    codigoImagenOpcion1 = parseInt(codigoImagenOpcion1);
                                }//else
                                //OPCION 2
                                var textoOpcion2 = $("#contenedor_opciones #test_opcion2").val();
                                var codigoImagenOpcion2 = $("#contenedor_opciones #imagen_opcion2_codigo").text();
                                if (codigoImagenOpcion2 == "")
                                {
                                    codigoImagenOpcion2 = null;
                                }//if
                                else
                                {
                                    codigoImagenOpcion2 = parseInt(codigoImagenOpcion2);
                                }//else
                                //OPCION 3
                                var textoOpcion3 = $("#contenedor_opciones #test_opcion3").val();
                                var codigoImagenOpcion3 = $("#contenedor_opciones #imagen_opcion3_codigo").text();
                                if (codigoImagenOpcion3 == "")
                                {
                                    codigoImagenOpcion3 = null;
                                }//if
                                else
                                {
                                    codigoImagenOpcion3 = parseInt(codigoImagenOpcion3);
                                }//else
                                //OPCION 4
                                var textoOpcion4 = $("#contenedor_opciones #test_opcion4").val();
                                var codigoImagenOpcion4 = $("#contenedor_opciones #imagen_opcion4_codigo").text();
                                if (codigoImagenOpcion4 == "")
                                {
                                    codigoImagenOpcion4 = null;
                                }//if
                                else
                                {
                                    codigoImagenOpcion4 = parseInt(codigoImagenOpcion4);
                                }//else

                                //OPCIÓN CORRECTA
                                var respuesta = parseInt($(".contenedor_radio_opcion input:radio[name=opciones_test]:checked").val());

                        //CREACIÓN DEL REGISTRO EN LA TABLA DE TESTS
                            $.ajax({
                                method: "POST",
                                url: pathPHP + "MediosController.php",
                                data:   {   operacion: 'INSERTAR_TEST',
                                            parametros: [   'sssiisisisis',
                                                            denominacion,
                                                            descripcion,
                                                            textoPropio,
                                                            respuesta,
                                                            codigoImagenOpcion1,
                                                            textoOpcion1,
                                                            codigoImagenOpcion2,
                                                            textoOpcion2,
                                                            codigoImagenOpcion3,
                                                            textoOpcion3,
                                                            codigoImagenOpcion4,
                                                            textoOpcion4
                                                        ]
                                        },
                                success: function(respuesta)
                                    {
                                        var resTest = JSON.parse(respuesta);

                                        //Se obtiene el código del test recién generado
                                        var codigoNuevoTest = resTest[0]["TS_CODE"];

                                        var orden = 1;
                                        //Se procede a insertar ahora los elementos del encabezado
                                        elementosEncabezado.forEach(function(elemento)
                                        {
                                            $.ajax({
                                                method: "POST",
                                                url: pathPHP + "MediosController.php",
                                                data:   {   operacion: 'INSERTAR_ENCABEZADO_TEST',
                                                            parametros: [   'iii',
                                                                            codigoNuevoTest,
                                                                            elemento,
                                                                            orden
                                                                        ]
                                                        },
                                                success: function(respuesta)
                                                    {
                                                        var res = JSON.parse(respuesta);                                                        
                                                    },
                                                error: function(jqxhr, status, exception)
                                                    {
                                                        alert('Exception:', exception);
                                                    }
                                            });
                                            ++orden;            
                                        });

                                        //Se añade a la tabla de test
                                        NuevaFilaTest(resTest);
                                    },
                                error: function(jqxhr, status, exception)
                                    {
                                        alert('Exception:', exception);
                                    }
                            });            
                    //Se cambia el texto del botón
                    $(this).text("Nuevo test");
                    //Se retorna al modo de NAVEGACIÓN
                    modoTest = "NAVEGACIÓN";
                }//else if
            })

            $("#btn_cancelar_test").click(function(){
                //Se devuelven los controles a su estado de NAVEGACIÓN
                if (modoTest == "INSERCIÓN")
                {
                    //ÁREA DE BOTONES
                        //Se cambia el texto del botón de creación del nuevo test
                        $("#btn_nuevo_test").text("Nuevo test");
                        //Se desactiva el botón para cancelar la creación de nuevo test
                        $(this).prop("disabled", true);
                    //ÁREA DE CONTENIDO DEL TEST
                    //Area de editables
                        //Se borran los contenidos
                        $(".contenedor_editable input").val("");
                        //Se deshabilitan los editables
                        $(".contenedor_editable input").prop("readonly", true);
                    //Area de enunciado
                        //ENCABEZADO
                            //Se deshabilita el botón para añadir elementos
                            $("#btn_insertar_elemento").css("visibility", "hidden");
                            //Se borra y se deshabilita el texto propio del test
                            $("#texto_test").val("");
                            $("#texto_test").prop("readonly", true);
                            //Se eliminan todos los elementos existentes
                            $(".contenedor_elemento_encabezado").remove();
                        //OPCIONES
                            //Se ocultan las mini barras de herramientas para las imágenes de las opciones
                            $(".mini_barra_herramientas_opcion").css("display", "none");
                            //Se deshabilitan los controles de las opciones de test
                            $(".contenedor_radio_opcion").children("input").prop("disabled", true);
                            $(".contenedor_label_opcion").children("textarea").prop("readonly", true);
                            //Se borran los textos de las opciones
                            $(".contenedor_label_opcion textarea").val("");
                            //Se eliminan las imágenes de las opciones
                            $(".imagenes_opciones").attr("src", "");
                                            
                    //Se cambia a modo de NAVEGACIÓN
                    modoTest = "NAVEGACIÓN";
                    //Si hay tests, se muestra el activo
                    if (testActual)
                    {
                        SeleccionarFilaTablaCodigo("tests", testActual[0]);
                    }//if
                }//if
                else if (modoTest == "EDICIÓN")
                {
                    //ÁREA DE BOTONES
                        //Se habilita el botón de creación de nuevo test
                        $("#btn_nuevo_test").prop("disabled", false);
                        //Se desactiva el botón para cancelar la edición
                        $(this).prop("disabled", true);
                    //TABLA DE TESTS
                        //Se cambia el texto del botón de edición
                        var coleccion = $("#tabla_tests tbody tr");
                        for (let cont = 1; cont < coleccion.length; cont++)
                        {
                            if (coleccion[cont].children[0].innerText == testActual[0])
                            {
                                $(coleccion[cont].children[2]).children("button").text("Editar");
                            }//if
                        }//for
                        //Se habilitan los clicks sobre las filas de la tabla
                        $("#tabla_tests tr").prop("disabled", false);
                        //Se habilitan los click sobre los botones de la tabla
                        $("#tabla_tests button").prop("disabled", false);
                        //Se normaliza la visualización de las filas de la tabla
                        $("#tabla_tests tr").removeClass("desactivar");
                    //ÁREA DE CONTENIDO DEL TEST
                    //Area de editables
                        //Se deshabilitan los editables
                        $(".contenedor_editable input").prop("readonly", true);
                    //Area de enunciado
                        //ENCABEZADO
                            //Se deshabilita el botón para añadir elementos
                            $("#btn_insertar_elemento").css("visibility", "hidden");
                            //Se deshabilita el texto propio del test
                            $("#texto_test").prop("readonly", true);
                            //Se deshabilitan las barras de herramientas para cada elemento del encabezado
                            $(".mini_barra_herramientas").css("display", "none");
                        //OPCIONES
                            //Se ocultan las mini barras de herramientas para las imágenes de las opciones
                            $(".mini_barra_herramientas_opcion").css("display", "none");
                            //Se deshabilitan los controles de las opciones de test
                            $(".contenedor_radio_opcion").children("input").prop("disabled", true);
                            $(".contenedor_label_opcion").children("textarea").prop("readonly", true);

                    //Se cambia a modo de NAVEGACIÓN
                    modoTest = "NAVEGACIÓN";
                }//else if
            })

            ///////////////////////////////////
            //  ÁREA DEL ENUNCIADO DEL TEST  //
            ///////////////////////////////////
            //Pulsación sobre el botón para insertar nuevo elemento de enunciado
            $("#btn_insertar_elemento").click(function(){
                InsertarElementoEncabezado(true);
            })

            function InsertarElementoEncabezado(editable)
            {
                var divMiniBarra;

                var divContenedor = Factoria("div", [["class", "contenedor_elemento_encabezado"],["id", "contenedor_elemento_encabezado"]], "");
                
                if (editable)
                {
                    $(divContenedor).addClass("editable");
                    divMiniBarra = Factoria("div", [["class", "mini_barra_herramientas"],["id", "mini_barra_herramientas"],["style", "display: block"]], "");
                }//if
                else
                {
                    divMiniBarra = Factoria("div", [["class", "mini_barra_herramientas"],["id", "mini_barra_herramientas"],["style", "display: none"]], "");
                }//else
                var buttonAdjuntar = Factoria("i", [["id", "btn_adjuntar"],["class", "far fa-plus-square btn_mini_barra"],["style", "margin: 0% 0.3em"]], "");
                var buttonRetirar = Factoria("i", [["id", "btn_retirar"],["class", "far fa-minus-square btn_mini_barra"],["style", "margin: 0% 0.3em"]], "");
                var buttonEliminar = Factoria("i", [["id", "btn_eliminar"],["class", "fas fa-trash-alt btn_mini_barra"],["style", "margin: 0% 0.3em"]], "");

                buttonAdjuntar.addEventListener("click", OnClickBtnAdjuntar);
                buttonRetirar.addEventListener("click", OnClickBtnRetirar);
                buttonEliminar.addEventListener("click", OnClickBtnEliminar);

                divMiniBarra.appendChild(buttonAdjuntar);
                divMiniBarra.appendChild(buttonRetirar);
                divMiniBarra.appendChild(buttonEliminar);

                divContenedor.appendChild(divMiniBarra);

                $("#contenedor_encabezado").append(divContenedor);
                return divContenedor;
            }//InsertarElementoEncabezado

            //Función para seleccionar un medio para el elemento
            function OnClickBtnAdjuntar()
            {
                if (elementoTestEnCurso)
                {
                    $(elementoTestEnCurso).css("border", "1px solid grey");
                }
                elementoTestEnCurso = $(this).parent().parent();
                $(elementoTestEnCurso).css("border", "2px solid blue");
                ActivarAdjuntarMedio();
            }//OnClickBtnAdjuntar

            //Función para retirar el medio actual del elemento
            function OnClickBtnRetirar()
            {

            }//OnClickBtnRetirar

            //Función para eliminar el elemento del enunciado
            function OnClickBtnEliminar()
            {
                $(this).parent().parent().remove();
            }//OnClickBtnEliminar

            /////////////////////////////////////
            //  ÁREA DE LAS OPCIONES DEL TEST  //
            /////////////////////////////////////
            //Pulsación sobre el botón para editar la imagen de una opción
            $(".opcion_editar").click(function(){
                //ACTUALIZACIÓN DE LA OPCIÓN ACTIVA
                var aux = $(this).attr("id");
                opcionActual = aux.substr(aux.length - 1);

                //Se elimina cualquier otra área de selección de imágenes de opciones
                $(".GIO_contenedor").remove();

                //OBTENCIÓN DE LA COLECCIÓN DE IMÁGENES DE OPCIONES DE TEST DE LA BASE DE DATOS
                var op = "FILTRAR_IMAGENES_OPCIONES";
                var param = ['s', 'IMAGEN'];

                var self = this;
        
                $.ajax({
                    method: "POST",
                    url: pathPHP + "MediosController.php",
                    data:   {   operacion: op,
                                parametros: param
                            },
                    success: function(respuesta)
                            {
                                //Extracción de los datos del JSON de respuesta en un array
                                var imagenesOpciones = JSON.parse(respuesta);

                                //CREACIÓN Y CARGA DEL CONTENEDOR PARA LA GESTIÓN DE IMÁGENES PARA OPCIONES DE TEST
                                    //CONTENEDOR TOTAL
                                    var divContenedorGestorImagenesOpciones = Factoria("div", [["id", "GIO_contenedor"],["class", "GIO_contenedor container"]], "");
                                        //CONTENEDOR DEL AREA DE BOTONES
                                        var divBotonera = Factoria("div", [["class", "row GIO_botonera"]], "");
                                            //BOTONES
                                            //Botón para cargar una imagen desde una fuente externa y subirla al repositorio de imágenes para opciones de test
                                            var buttonCargarImagenExterna = Factoria("button", [["type", "button"],["id", "GIO_btn_cargar_imagen_externa"],["class", "btn btn-secondary"]], "Importar imagen");
                                            //Botón para aceptar la selección actual e incorporar dicha imagen a la opción en curso
                                            var buttonAceptar = Factoria("button", [["type", "button"],["id", "GIO_btn_aceptar"],["class", "btn btn-secondary"]], "Aceptar");
                                            //Botón para cancelar
                                            var buttonCancelar = Factoria("button", [["type", "button"],["id", "GIO_btn_cancelar"],["class", "btn btn-secondary"]], "Cancelar");
                                            //Botón para editar la carta actual
                                            var buttonEditar = Factoria("button", [["type", "button"],["id", "GIO_btn_editar"],["class", "btn btn-secondary"]], "Editar");
                                            //Botón para eliminar la carta actual
                                            var buttonEliminar = Factoria("button", [["type", "button"],["id", "GIO_btn_eliminar"],["class", "btn btn-secondary"]], "Eliminar");

                                            //Asignación de los controles a su contenedor
                                            divBotonera.appendChild(buttonCargarImagenExterna);
                                            divBotonera.appendChild(buttonAceptar);
                                            divBotonera.appendChild(buttonCancelar);
                                            divBotonera.appendChild(buttonEditar);
                                            divBotonera.appendChild(buttonEliminar);

                                            //Asignación de manejadores de eventos a los controles
                                            buttonCargarImagenExterna.addEventListener("click", OnClickObtenerImagenExterna);   //Función que se ejecuta cada vez que se pulsa el botón para cargar imagen desde fuente externa
                                            buttonAceptar.addEventListener("click", OnClickImagenOpcionAceptar);                //Función que se ejecuta cada vez que se pulsa el botón para Aceptar la imagen en curso
                                            buttonCancelar.addEventListener("click", OnClickImagenOpcionCancelar);              //Función que se ejecuta cada vez que se pulsa el botón para Cancelar la operativa
                                            buttonEditar.addEventListener("click", OnClickEditarCarta);                         //Función que se ejecuta cada vez que se pulsa el botón para editar la carta en curso
                                            buttonEliminar.addEventListener("click", OnClickEliminarCarta);                     //Función que se ejecuta cada vez que se pulsa el botón para eliminar la carta en curso

                                            //Control para la selección de la imagen
                                            var inputImagenOpcion = Factoria("input", [["type", "file"],["name", "GIO_imagen_opcion_ruta"],["id", "GIO_imagen_opcion_ruta"],["class", "ocultar"]], "");
                                            divBotonera.appendChild(inputImagenOpcion);

                                            //Asignación de manejadores de eventos
                                            inputImagenOpcion.addEventListener("change", OnChangeImgOpcion);    //Función que se ejecuta cada vez que cambia la imagen en curso

                                        //Asignación de la botonera al contenedor global
                                        divContenedorGestorImagenesOpciones.appendChild(divBotonera);

                                        //CONTENEDOR DEL ÁREA DE VISUALIZACIÓN DE LAS IMÁGENES DE OPCIONES DE TEST
                                        var divContenedorRepositorioImagenes = Factoria("div", [["id", "GIO_repositorio"],["class", "row GIO_repositorio"]], "");

                                        //Se crea una carta para cada imagen obtenida de la base de datos
                                        imagenesOpciones.forEach(function(imgOpt)
                                        {
                                            var carta = CrearCartaImagenOpcion(imgOpt, false);
                    
                                            //Asignación de la carta al repositorio
                                            divContenedorRepositorioImagenes.appendChild(carta);                                            
                                        });

                                        //Asignación del repositorio de imágenes al contenedor global
                                        divContenedorGestorImagenesOpciones.appendChild(divContenedorRepositorioImagenes);

                                //Asignación del contenedor global a la opción en curso
                                $(self).parent().parent().parent().append(divContenedorGestorImagenesOpciones);

                                //Se selecciona la primera carta
                                var primeraCarta = $("#GIO_repositorio").children()[0];
                                if (primeraCarta)
                                {
                                    SeleccionarCarta(primeraCarta);
                                }//if

                                //Se gestiona la botonera
                                GestionarEstadoBarraHerramientas();
                            },
                    error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });
            })

            /*
                Añadir una imagen externa a la colección de imágenes para las opciones de los tests.
                Ejecutada al pulsar el botón "Importar imagen" de la barra de herramientas del gestor de imágenes de opciones
            */
            function OnClickObtenerImagenExterna()
            {
                if (opcionActual != "")
                {
                    //Se lanza el diálogo de selección de archivo de imagen
                    $("#GIO_imagen_opcion_ruta").click();
                }//if
            }//OnClickObtenerImagenExterna

            /*
                Añadir una imagen seleccionada de entre las existentes en el repositorio a la opción en curso.
                Ejecutada al pulsar el botón "Aceptar" de la barra de herramientas del gestor de imágenes de opciones
            */
            function OnClickImagenOpcionAceptar()
            {
                if (cartaImagenOpcionSeleccionada)
                {
                    $("#imagen_opcion" + opcionActual + "_codigo").text($(cartaImagenOpcionSeleccionada).find("#GIO_carta_codigo").text());
                    $("#imagen_opcion" + opcionActual).attr("src", "../media/Tests/" + $(cartaImagenOpcionSeleccionada).find("#GIO_carta_ruta_bd").text());
                }//if
            }//OnClickImagenOpcionAceptar

            /*
                Cancelar las operaciones con las imágenes de las opciones y salir.
                Ejecutada al pulsar el botón "Cancelar" de la barra de herramientas del gestor de imágenes de opciones
            */
            function OnClickImagenOpcionCancelar()
            {
                $("#GIO_contenedor").remove();
                opcionActual = "";
                submodoTest = "NAVEGACIÓN";
            }//OnClickImagenOpcionCancelar

            /*
                Realiza varias operaciones dependiendo del estado (submodo) en el que se encuentre:
                    - Si el submodo es "NAVEGACIÓN", cambia al submodo "EDICIÓN" y sólamente habilita el editable para modificar la descripción
                      de la imagen en el repositorio de imágenes de opciones.
                    - Si el submodo es "INSERCIÓN", se encarga de lanzar la operación para añadir la imagen externa seleccionada por el usuario
                      al repositorio de imágenes de opciones. Una vez subida se actualiza la información en la carta.
                    - Si el submodo es "EDICIÓN", se encarga de actualizar los cambios realizados sobre la imagen que pueden ser tanto el cambio
                      mismo de la imagen como de su denominación.
            */
            function OnClickEditarCarta()
            {
                if (submodoTest == "NAVEGACIÓN")
                {
                    //Se cambia a modo edición en los test
                    submodoTest = "EDICIÓN";
                    //Se gestiona la botonera
                    GestionarEstadoBarraHerramientas();
                    //Se pone en edición la denominación
                    $(cartaImagenOpcionSeleccionada).find("#GIO_carta_denominacion").prop("readonly", false);
                }//if
                else if (submodoTest == "INSERCIÓN")
                {
                    //Solicitar confirmación de la inserción
                    if (confirm("¿Desea añadir la nueva imagen?"))
                    {
                        //Obtener los valores introducidos por el usuario (denominación y el nombre del archivo de la imagen)
                        var denominacion = $(cartaImagenOpcionSeleccionada).find("#GIO_carta_denominacion").val();
                        var nombreImagen = $("#GIO_imagen_opcion_ruta").val().replace(/[A-Za-z]:\\fakepath\\/i, '');
                        //Crear y lanzar una query a la BD para insertar un nuevo registro con esos datos
                        //Se ordena la inserción por AJAX
                        $.ajax({
                                    method: "POST",
                                    url: pathPHP + "MediosController.php",
                                    data:   {   operacion: 'INSERTAR_IMAGEN_OPCION',
                                                parametros: [   'ss',
                                                                denominacion,
                                                                nombreImagen
                                                            ]
                                            },
                                    success: function(respuesta)
                                        {
                                            //Se obtiene el id del usuario recién insertado
                                            var res = JSON.parse(respuesta);
                                            //Obtener el Código del registro recién insertado e introducirlo en el campo hidden de la carta
                                            $(cartaImagenOpcionSeleccionada).find("#GIO_carta_codigo").val(res[0]["IOT_CODE"]);
                                            //Se actualiza la ruta
                                            $(cartaImagenOpcionSeleccionada).find("#GIO_carta_ruta_bd").text(res[0]["IOT_RUTA"]);

                                            //Se cambia a modo navegación en los test
                                            submodoTest = "NAVEGACIÓN";
                                            //Se gestiona la botonera
                                            GestionarEstadoBarraHerramientas();
                                            //Se quita de edición la denominación
                                            $(cartaImagenOpcionSeleccionada).find("#GIO_carta_denominacion").prop("readonly", true);
                                        },
                                    error: function(jqxhr, status, exception)
                                        {
                                            alert('Exception:', exception);
                                        }
                                });        
                        //Se sube la foto al servidor mediante AJAX si se ha cargado foto
                        if (nombreImagen != "")
                        {
                            var formData = new FormData();
                            var editableFoto = $("#GIO_imagen_opcion_ruta");
                            formData.append('imagen_card',  editableFoto[0].files[0]);
                            formData.append('nombre', nombreImagen);
                        
                            $.ajax({
                                    //La comunicación con el servidor será mediante POST
                                    method: 'POST',
                                    //Se indica el archivo php que subirá la foto al servidor
                                    url: '../php/subirImagenOpcion.php',
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
                }//else if
                else if (submodoTest == "EDICIÓN")
                {
                    if (confirm("¿Actualizar los datos para la imagen en curso?"))
                    {
                        //Bandera que señaliza si el usuario ha modificado la imagen pues habrá que subir el archivo al servidor
                        var subirImagen = false;
                        //Obtener el código de la imagen a actualizar
                        //Al ser una actualización el código no cambia pues no es accesible al usuario
                        var codigo = $(cartaImagenOpcionSeleccionada).find("#GIO_carta_codigo").text();
                        //Obtener los valores introducidos por el usuario (denominación y el nombre del archivo de la imagen)
                        var denominacion = $(cartaImagenOpcionSeleccionada).find("#GIO_carta_denominacion").val();
                        var nombreImagen = $("#GIO_imagen_opcion_ruta").val().replace(/[A-Za-z]:\\fakepath\\/i, '');
                        if (nombreImagen == "")
                        {
                            nombreImagen = $(cartaImagenOpcionSeleccionada).find("#GIO_carta_ruta_bd").text();
                        }//if
                        else
                        {
                            //Se señala que será necesario subir al servidor la nueva imagen
                            subirImagen = true;
                        }//else
                        //Crear y lanzar una query a la BD para actualizar el registro en curso
                        //Se ordena la inserción por AJAX
                        $.ajax({
                                    method: "POST",
                                    url: pathPHP + "MediosController.php",
                                    data:   {   operacion: 'EDITAR_IMAGEN_OPCION',
                                                parametros: [   'sss',
                                                                denominacion,
                                                                nombreImagen,
                                                                codigo
                                                            ]
                                            },
                                    success: function(respuesta)
                                        {
                                            //Se obtienen los datos del nuevo registro modificado
                                            //Se podrían usuar los datos que se han enviado a la consulta pero de esta forma nos aseguramos
                                            //de que cargamos los que están en la base de datos
                                            var res = JSON.parse(respuesta);

                                            //Se actualiza la ruta
                                            $(cartaImagenOpcionSeleccionada).find("#GIO_carta_ruta_bd").text(res[0]["IOT_RUTA"]);

                                            //Se cambia a modo navegación en los test
                                            submodoTest = "NAVEGACIÓN";
                                            //Se gestiona la botonera
                                            GestionarEstadoBarraHerramientas();
                                            //Se quita de edición la denominación
                                            $(cartaImagenOpcionSeleccionada).find("#GIO_carta_denominacion").prop("readonly", true);
                                        },
                                    error: function(jqxhr, status, exception)
                                        {
                                            alert('Exception:', exception);
                                        }
                                });        
                        //Se sube la foto al servidor mediante AJAX si se ha cambiado la foto
                        //Se debería eliminar antes del servidor la imagen anterior para no dejar archivos obsoletos
                        if (subirImagen)
                        {
                            var formData = new FormData();
                            var editableFoto = $("#GIO_imagen_opcion_ruta");
                            formData.append('imagen_card',  editableFoto[0].files[0]);
                            formData.append('nombre', nombreImagen);
                        
                            $.ajax({
                                    //La comunicación con el servidor será mediante POST
                                    method: 'POST',
                                    //Se indica el archivo php que subirá la foto al servidor
                                    url: '../php/subirImagenOpcion.php',
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
                }//else if

            }//OnClickEditarCarta

            /*
                Realiza varias operaciones dependiendo del estado (submodo) en el que se encuentre:
                    - Si el submodo es "NAVEGACIÓN", se encarga de eliminar la imagen de la carta actual de la base de datos de imagenes de opciones
                      si es viable. Una vez eliminada selecciona otra si es posible.
                    - Si el submodo es "INSERCIÓN", se encarga de cancelar la adición de la nueva imagen a la base de datos, destruyendo la carta y
                      seleccionando otra si es posible. Al no haber subido nada a la base de datos no es necesario actuar sobre ella.
                    - Si el submodo es "EDICIÓN", se encarga de abortar la edición en curso, por lo que es necesario obtener de nuevo los datos de
                      la carta para la imagen actual y restaurarlos.
            */
            function OnClickEliminarCarta()
            {
                if (submodoTest == "NAVEGACIÓN")
                {
                    if (cartaImagenOpcionSeleccionada)
                    {
                        //TODO: comprobar previamente si es posible la eliminación de la carta al no estar siendo usada
                        //TODO: eliminar la imagen de cualquier opción actual en la que estuviera siendo usada
                        //Se solicita confirmación para la eliminación
                        if (confirm("¿Desea eliminar la imagen actual de la base de datos?"))
                        {
                            //Se obtiene el código de la imagen a eliminar
                            var codigo = $(cartaImagenOpcionSeleccionada).find("#GIO_carta_codigo").val();
                            //Se obtiene la ruta de la imagen
                            var ruta = "../media/Tests/" + $(cartaImagenOpcionSeleccionada).find("#GIO_carta_ruta_bd").text();
                            //Se elimina del servidor el archivo de la imagen
                            $.ajax({
                                    //La comunicación con el servidor será mediante POST
                                    method: 'POST',
                                    //Se indica el archivo php que eliminará la foto del servidor
                                    url: '../php/eliminarImagenOpcion.php',
                                    data:   { parametros: [ruta]
                                            },
                                    success: function(respuesta)
                                        {
                                            if (respuesta == 'FALSE')
                                            {
                                                alert("No se ha podido eliminar la imagen del servidor");
                                            }//if
                                        }
                                });
                            //Se elimina el registro en la base de datos
                            $.ajax({
                                method: "POST",
                                url: pathPHP + "MediosController.php",
                                data:   {   operacion: 'ELIMINAR_IMAGEN_OPCION',
                                            parametros: [codigo]
                                        },
                                success: function(respuesta)
                                    {
                                    },
                                error: function(jqxhr, status, exception)
                                    {
                                        alert('Exception:', exception);
                                    }
                            });
                            /*
                                Una vez eliminada la carta en curso hay que seleccionar otra pues si aún existen cartas tiene que estar una seleccionada.
                                Se trata de seleccionar la siguiente a la que se elimina salvo que ésta fuera la última en cuyo caso se seleccionará la anterior
                                o bien si era la única en cuyo caso ya no quedarán cartas que seleccionar
                            */
                            var cartaSiguienteSeleccion = $(cartaImagenOpcionSeleccionada).next();
                            if (cartaSiguienteSeleccion.length)
                            {
                                //Hay una carta siguiente luego se elimina la actual y se selecciona la siguiente
                                $(cartaImagenOpcionSeleccionada).remove();
                                SeleccionarCarta(cartaSiguienteSeleccion);
                            }//if
                            else
                            {
                                //No hay carta siguiente. Se determina si hay carta previa
                                cartaSiguienteSeleccion = $(cartaImagenOpcionSeleccionada).prev();
                                if (cartaSiguienteSeleccion.length)
                                {
                                    //Hay una carta previa luego se elimina la actual y se selecciona la previa
                                    $(cartaImagenOpcionSeleccionada).remove();
                                    SeleccionarCarta(cartaSiguienteSeleccion);
                                }//if
                                else
                                {
                                    //No hay carta anterior ni posterior lo que indica que ésta era la única
                                    //Se elimina y no se puede seleccionar ninguna otra
                                    $(cartaImagenOpcionSeleccionada).remove();
                                }//else
                            }//else
                            //Se gestiona la botonera
                            GestionarEstadoBarraHerramientas();
                        }//if
                    }//if
                }//if
                else if (submodoTest == "INSERCIÓN")
                {
                    //Se destruye la nueva carta
                    if (cartaImagenOpcionSeleccionada)
                    {
                        /*
                            Una vez eliminada la carta en curso hay que seleccionar otra pues si aún existen cartas tiene que estar una seleccionada.
                            Se trata de seleccionar la siguiente a la que se elimina salvo que ésta fuera la última en cuyo caso se seleccionará la anterior
                            o bien si era la única en cuyo caso ya no quedarán cartas que seleccionar
                        */
                        var cartaSiguienteSeleccion = $(cartaImagenOpcionSeleccionada).next();
                        if (cartaSiguienteSeleccion.length)
                        {
                            //Hay una carta siguiente luego se elimina la actual y se selecciona la siguiente
                            $(cartaImagenOpcionSeleccionada).remove();
                            SeleccionarCarta(cartaSiguienteSeleccion);
                        }//if
                        else
                        {
                            //No hay carta siguiente. Se determina si hay carta previa
                            cartaSiguienteSeleccion = $(cartaImagenOpcionSeleccionada).prev();
                            if (cartaSiguienteSeleccion.length)
                            {
                                //Hay una carta previa luego se elimina la actual y se selecciona la previa
                                $(cartaImagenOpcionSeleccionada).remove();
                                SeleccionarCarta(cartaSiguienteSeleccion);
                            }//if
                            else
                            {
                                //No hay carta anterior ni posterior lo que indica que ésta era la única
                                //Se elimina y no se puede seleccionar ninguna otra
                                $(cartaImagenOpcionSeleccionada).remove();
                            }//else
                        }//else
                        //Se restaura el modo de NAVEGACIÓN
                        submodoTest = "NAVEGACIÓN";
                        //Se gestiona la botonera
                        GestionarEstadoBarraHerramientas();
                    }//if
                }//else if
                else if (submodoTest == "EDICIÓN")
                {
                    //Hay que volver a cargar los datos
                    var codigo = $(cartaImagenOpcionSeleccionada).find("#GIO_carta_codigo").text();

                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: 'OBTENER_IMAGEN_OPCION',
                                    parametros: [   's',
                                                    codigo
                                                ]
                                },
                        success: function(respuesta)
                            {
                                //Se obtienen los datos del nuevo registro modificado
                                //Se podrían usuar los datos que se han enviado a la consulta pero de esta forma nos aseguramos
                                //de que cargamos los que están en la base de datos
                                var res = JSON.parse(respuesta);

                                //Se actualiza la denominación
                                $(cartaImagenOpcionSeleccionada).find("#GIO_carta_denominacion").val(res[0]["IOT_DENOMINACION"]);
                                //Se actualiza la ruta
                                $(cartaImagenOpcionSeleccionada).find("#GIO_carta_ruta_bd").text(res[0]["IOT_RUTA"]);
                                //Se recarga la imagen
                                $(cartaImagenOpcionSeleccionada).find("#GIO_imagen_opcion_carta").attr("src", "../media/Tests/" + res[0]["IOT_RUTA"]);

                                //Se cambia a modo navegación en los test
                                submodoTest = "NAVEGACIÓN";
                                //Se gestiona la botonera
                                GestionarEstadoBarraHerramientas();
                                //Se quita de edición la denominación
                                $(cartaImagenOpcionSeleccionada).find("#GIO_carta_denominacion").prop("readonly", true);
                            },
                        error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });        
                }//else if
            }//OnClickEliminarCarta

            function CrearCartaImagenOpcion(data, externo)
            {
                var ruta, rutaCompleta, denominacion, codigo;
                if (!externo)
                {
                    codigo = data["IOT_CODE"];
                    denominacion = data["IOT_DENOMINACION"];
                    ruta = data["IOT_RUTA"];
                    rutaCompleta = "../media/Tests/" + ruta;
                }//if
                else
                {
                    codigo = "";
                    denominacion = "";
                    rutaCompleta = data;
                    ruta = "";
                    submodoTest = "INSERCIÓN";
                }//else

                //CARTA
                //Contenedor de la carta
                var divContenedorCarta = Factoria("div", [["class", "card col-12"],["id", "GIO_carta"]], "");
                    //Fila
                    var divRow = Factoria("div", [["class", "row no-gutters"]], "");
                        //Columna imagen
                        var divColImg = Factoria("div", [["class", "col-2"]], "");
                            //Imagen
                            var imagenOpcionCarta = Factoria("img", [["src", rutaCompleta],["class", "card-img"],["id", "GIO_imagen_opcion_carta"],["alt", ""]], "");

                            //Asignación de la imagen a la columna
                            divColImg.appendChild(imagenOpcionCarta);

                            //Asignación de manejadores de eventos
                            imagenOpcionCarta.addEventListener("click", OnClickCambiarImagenOpcion);

                        //Asignación de la columna de imagen a la fila
                        divRow.appendChild(divColImg);

                        //Columna cuerpo de la carta
                        var divColCuerpo = Factoria("div", [["class", "col-10"]], "");
                            //Contenedor del cuerpo de la carta
                            var divCuerpoCarta = Factoria("div", [["class", "card-body"]], "");
                                //CONTROLES
                                //Código único de la imagen en su tabla de la base de datos
                                var inputImagenOpcionCod = Factoria("input", [["type", "hidden"],["id", "GIO_carta_codigo"]], codigo);
                                //Denominación
                                var imagenOpcionDenominacion = Factoria("input", [["type", "text"],["name", "GIO_carta_denominacion"],["id", "GIO_carta_denominacion"],["value", denominacion]], "");
                                $(imagenOpcionDenominacion).prop("readonly", !externo);
                                //Texto oculto con el nombre del archivo de la imagen para la ruta
                                var rutaImagenOpcion = Factoria("h6", [["id", "GIO_carta_ruta_bd"]], ruta);

                                //Asignación de los controles a su contenedor
                                divCuerpoCarta.appendChild(inputImagenOpcionCod);
                                divCuerpoCarta.appendChild(imagenOpcionDenominacion);
                                divCuerpoCarta.appendChild(rutaImagenOpcion);

                            //Asignación del cuerpo de la carta a su columna
                            divColCuerpo.appendChild(divCuerpoCarta);

                        //Asignación de la columna a la fila
                        divRow.appendChild(divColCuerpo);

                    //Asignación de la fila a la carta
                    divContenedorCarta.appendChild(divRow);

                    //Asignación de manejador de eventos
                    divContenedorCarta.addEventListener("click", OnClickImagenOpcionCarta);  //Función que se ejecuta cada vez que se hace click sobre una carta

                    return divContenedorCarta;
            }//CrearCartaImagenOpcion

            /*
                Lanza el selector de archivos de imágenes para las opciones cuando se hace click sobre una de las imágenes del repositorio de imágenes de opciones
                cuando se encuentra en los submodos de "EDICIÓN" o "INSERCIÓN".
                Sólo actúa si se hace click sobre la imagen en curso
            */
            function OnClickCambiarImagenOpcion()
            {
                if ((submodoTest == "EDICIÓN")||(submodoTest == "INSERCIÓN"))
                {
                    var imgclk = this.parentElement.parentElement.parentElement;
                    if (cartaImagenOpcionSeleccionada == imgclk)
                    {
                        $("#GIO_imagen_opcion_ruta").click();
                    }//if
                }//if
            }//OnClickCambiarImagenOpcion

            //Provoca la selección de la carta sobre la que se hace click en submodo "NAVEGACIÓN"
            function OnClickImagenOpcionCarta()
            {
                if (submodoTest == "NAVEGACIÓN")
                {
                    SeleccionarCarta(this);
                }//if                
            }//OnClickImagenOpcionCarta

            //Pulsación sobre el botón para eliminar imagen de una opción
            $(".opcion_eliminar").click(function(){
                $("#imagen_opcion" + opcionActual).attr("src", "");
            })

            /*
                Esta función se ejecuta en respuesta al evento "change" del input file de la barra de herramientas
                del gestor de imágenes de opciones.
                Si el usuario ha seleccionado una imagen o ha cambiado la selección se ejecutará para crear la carta
                y depositar la imagen en ella.
                Si el usuario no ha cambiado la imagen o ha abandonado el diálogo de selección de archivo de imagen
                cancelando, simplemente no se ejecutará nada y no se creará la correspondiente carta.
            */
           function OnChangeImgOpcion()
           {
               //Obtenemos el archivo de la foto desde el input file
               let foto = this.files[0];
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
                   //Se crea la carta para la nueva imagen
                   var carta = CrearCartaImagenOpcion("", true);
                   //Se configura el estado de la barra local de herramientas
                   GestionarEstadoBarraHerramientas();
                   //Se añade la carta creada
                   $("#GIO_repositorio").append(carta);
                   //Se selecciona la carta creada
                   SeleccionarCarta(carta);

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
                       //Una vez obtenida la imagen hay que mostrarla en el item imagen de la opción en curso
                       $(cartaImagenOpcionSeleccionada).find("#GIO_imagen_opcion_carta").attr("src", e.target.result);
                   };
               }//else
           }//OnChangeImgOpcion

           function GestionarEstadoBarraHerramientas()
           {
               var cartas = $("#GIO_repositorio").children();

               switch (submodoTest)
               {
                   case "NAVEGACIÓN":
                   {
                       $("#GIO_btn_editar").text("Editar");
                       $("#GIO_btn_eliminar").text("Eliminar");
                       if (cartas.length)
                       {
                           $("#GIO_btn_cargar_imagen_externa").prop("disabled", false);
                           $("#GIO_btn_aceptar").prop("disabled", false);
                           $("#GIO_btn_cancelar").prop("disabled", false);
                           $("#GIO_btn_editar").prop("disabled", false);
                           $("#GIO_btn_eliminar").prop("disabled", false);
                       }//if
                       else
                       {
                           $("#GIO_btn_cargar_imagen_externa").prop("disabled", false);
                           $("#GIO_btn_aceptar").prop("disabled", true);
                           $("#GIO_btn_cancelar").prop("disabled", false);
                           $("#GIO_btn_editar").prop("disabled", true);
                           $("#GIO_btn_eliminar").prop("disabled", true);
                       }//else
                       break;
                   }
                   case "EDICIÓN":
                   {
                       $("#GIO_btn_cargar_imagen_externa").prop("disabled", true);
                       $("#GIO_btn_aceptar").prop("disabled", true);
                       $("#GIO_btn_cancelar").prop("disabled", false);
                       $("#GIO_btn_editar").prop("disabled", false);
                       $("#GIO_btn_eliminar").prop("disabled", false);

                       $("#GIO_btn_editar").text("Actualizar");
                       $("#GIO_btn_eliminar").text("Cancelar edición");
                       break;
                   }
                   case "INSERCIÓN":
                   {
                       $("#GIO_btn_cargar_imagen_externa").prop("disabled", true);
                       $("#GIO_btn_aceptar").prop("disabled", true);
                       $("#GIO_btn_cancelar").prop("disabled", false);
                       $("#GIO_btn_editar").prop("disabled", false);
                       $("#GIO_btn_eliminar").prop("disabled", false);

                       $("#GIO_btn_editar").text("Insertar");
                       $("#GIO_btn_eliminar").text("Cancelar inserción");
                       break;
                   }
               }//switch

           }//GestionarEstadoBarraHerramientas

           function SeleccionarCarta(carta)
           {
               //Se quita cualquier selección previa
               $("#GIO_repositorio").children().css("border", "0px");
               //Se selecciona la carta actual
               $(carta).css("border", "1px solid blue");
               cartaImagenOpcionSeleccionada = carta;
           }//SeleccionarCarta

            ///////////////////////////////////////////
            //  OPERACIONES SOBRE LA TABLA DE TESTS  //
            ///////////////////////////////////////////
            function OnClickTablaTests()
            {
                //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                if (modoTest == "NAVEGACIÓN")
                {
                    if (this.rowIndex >= 0)
                    {
                        //Selección del nodo tr sobre el que se ha hecho click
                        let hijos = $(this).children();
                        if (hijos[0].nodeName != 'TH')
                        {
                            SeleccionarFilaTabla("tests", hijos);
                        }//if     
                    }//if
                }//if  
            }//OnClickTablaTests

            function OnClickEditarTest(e)
            {
                e.stopPropagation();
                var fila = $(e.target).parent().parent();
                var celda = $(e.target).parent();
                var boton = $(e.target);
                if (modoTest == "NAVEGACIÓN")
                {
                    SeleccionarFilaTabla("tests", $(fila).children());
                    //ÁREA DE BOTONES
                        //Se deshabilita el botón de creación de nuevo test
                        $("#btn_nuevo_test").prop("disabled", true);
                        //Se habilita el botón para cancelar la edición
                        $("#btn_cancelar_test").prop("disabled", false);
                    //TABLA DE TESTS
                        //Se cambia el texto del botón de edición
                        boton.text("Actualizar");
                        //Se deshabilitan los clicks sobre las filas de la tabla
                        $("#tabla_tests tr").prop("disabled", true);
                        //Se deshabilitan los click sobre los botones de la tabla
                        $("#tabla_tests button").prop("disabled", true);
                        //Se atenúan las filas de la tabla
                        $("#tabla_tests tr").addClass("desactivar");
                        //Se recupera la fila actual
                        fila.removeClass("desactivar");
                        fila.prop("disabled", false);
                        //Se vuelven a activar el botón de edición de la fila actual
                        boton.prop("disabled", false);
                        //celda.next().children("button").prop("disabled", false);
                    //ÁREA DE CONTENIDO DEL TEST
                    //Area de editables
                        //Se habilitan los editables
                        $(".contenedor_editable input").prop("readonly", false);
                    //Area de enunciado
                        //ENCABEZADO
                            //Se habilita el botón para añadir elementos
                            $("#btn_insertar_elemento").css("visibility", "visible");
                            //Se habilita el texto propio del test
                            $("#texto_test").prop("readonly", false);
                            //Se habilitan las barras de herramientas para cada elemento del encabezado
                            $(".mini_barra_herramientas").css("display", "block");
                        //OPCIONES
                            //Se muestran las mini barras de herramientas para las imágenes de las opciones
                            $(".mini_barra_herramientas_opcion").css("display", "block");
                            //Se habilitan los controles de las opciones de test
                            $(".contenedor_radio_opcion").children("input").prop("disabled", false);
                            $(".contenedor_label_opcion").children("textarea").prop("readonly", false);

                    //Se cambia a modo de EDICIÓN
                    modoTest = "EDICIÓN";
                }//if
                else if (modoTest == "EDICIÓN")
                {
                    //Se solicita confirmación para actualizar los datos
                    if (confirm("¿Desea actualizar el test?"))
                    {
                        //OBTENCIÓN DE LOS DATOS
                            //DENOMINACIÓN
                            var denominacion = $("#test_denominacion").val();
                            //DESCRIPCIÓN
                            var descripcion = $("#test_descripcion").val();
                            //TEXTO PROPIO DEL TEST
                            var textoPropio = $("#texto_test").val();
                            //ENCABEZADO
                                var bloqueEncabezado = $("#contenedor_encabezado").children(".contenedor_elemento_encabezado");
                                elementosEncabezado = new Array();
                                for (var cont = 0; cont < bloqueEncabezado.length; ++cont)
                                {
                                    var encabezado = $(bloqueEncabezado)[cont];
                                    var medio = $(encabezado).find("#contenedor_medio");
                                    var contenido = $(medio).children()[0];
                                    elementosEncabezado.push(parseInt($(contenido).text()));
                                }//for
                            //OPCIONES
                                //OPCION 1
                                var textoOpcion1 = $("#contenedor_opciones #test_opcion1").val();
                                var codigoImagenOpcion1 = $("#contenedor_opciones #imagen_opcion1_codigo").text();
                                if (codigoImagenOpcion1 == "")
                                {
                                    codigoImagenOpcion1 = null;
                                }//if
                                else
                                {
                                    codigoImagenOpcion1 = parseInt(codigoImagenOpcion1);
                                }//else
                                //OPCION 2
                                var textoOpcion2 = $("#contenedor_opciones #test_opcion2").val();
                                var codigoImagenOpcion2 = $("#contenedor_opciones #imagen_opcion2_codigo").text();
                                if (codigoImagenOpcion2 == "")
                                {
                                    codigoImagenOpcion2 = null;
                                }//if
                                else
                                {
                                    codigoImagenOpcion2 = parseInt(codigoImagenOpcion2);
                                }//else
                                //OPCION 3
                                var textoOpcion3 = $("#contenedor_opciones #test_opcion3").val();
                                var codigoImagenOpcion3 = $("#contenedor_opciones #imagen_opcion3_codigo").text();
                                if (codigoImagenOpcion3 == "")
                                {
                                    codigoImagenOpcion3 = null;
                                }//if
                                else
                                {
                                    codigoImagenOpcion3 = parseInt(codigoImagenOpcion3);
                                }//else
                                //OPCION 4
                                var textoOpcion4 = $("#contenedor_opciones #test_opcion4").val();
                                var codigoImagenOpcion4 = $("#contenedor_opciones #imagen_opcion4_codigo").text();
                                if (codigoImagenOpcion4 == "")
                                {
                                    codigoImagenOpcion4 = null;
                                }//if
                                else
                                {
                                    codigoImagenOpcion4 = parseInt(codigoImagenOpcion4);
                                }//else

                                //OPCIÓN CORRECTA
                                var respuesta = parseInt($(".contenedor_radio_opcion input:radio[name=opciones_test]:checked").val());

                        //ACTUALIZACIÓN DEL REGISTRO EN LA TABLA DE TESTS
                            $.ajax({
                                method: "POST",
                                url: pathPHP + "MediosController.php",
                                data:   {   operacion: 'ACTUALIZAR_TEST',
                                            parametros: [   'sssiisisisiss',
                                                            denominacion,
                                                            descripcion,
                                                            textoPropio,
                                                            respuesta,
                                                            codigoImagenOpcion1,
                                                            textoOpcion1,
                                                            codigoImagenOpcion2,
                                                            textoOpcion2,
                                                            codigoImagenOpcion3,
                                                            textoOpcion3,
                                                            codigoImagenOpcion4,
                                                            textoOpcion4,
                                                            testActual[0]
                                                        ]
                                        },
                                success: function(respuesta)
                                    {
                                        //Se procede a actualizar ahora los elementos del encabezado
                                        //Primero se eliminan todos los elementos existentes
                                        $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'ELIMINAR_ENCABEZADO_TEST',
                                                        parametros: [   testActual[0]
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    var orden = 1;
                                                    elementosEncabezado.forEach(function(elemento)
                                                    {
                                                        $.ajax({
                                                            method: "POST",
                                                            url: pathPHP + "MediosController.php",
                                                            data:   {   operacion: 'INSERTAR_ENCABEZADO_TEST',
                                                                        parametros: [   'iii',
                                                                                        testActual[0],
                                                                                        elemento,
                                                                                        orden
                                                                                    ]
                                                                    },
                                                            success: function(respuesta)
                                                                {                                         
                                                                },
                                                            error: function(jqxhr, status, exception)
                                                                {
                                                                    alert('Exception:', exception);
                                                                }
                                                        });
                                                        ++orden;            
                                                    });
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });                                        
                                    },
                                error: function(jqxhr, status, exception)
                                    {
                                        alert('Exception:', exception);
                                    }
                            });            

                            //ÁREA DE BOTONES
                                //Se habilita el botón de creación de nuevo test
                                $("#btn_nuevo_test").prop("disabled", false);
                                //Se desactiva el botón para cancelar la edición
                                $("#btn_cancelar_test").prop("disabled", true);
                            //TABLA DE TESTS
                                //Se cambia el texto del botón de edición
                                boton.text("Editar");
                                //Se habilitan los clicks sobre las filas de la tabla
                                $("#tabla_tests tr").prop("disabled", false);
                                //Se habilitan los click sobre los botones de la tabla
                                $("#tabla_tests button").prop("disabled", false);
                                //Se normaliza la visualización de las filas de la tabla
                                $("#tabla_tests tr").removeClass("desactivar");
                                //Se actualiza la denominación en la celda de la tabla del test en curso
                                celda.prev().text(denominacion);
                            //ÁREA DE CONTENIDO DEL TEST
                            //Area de editables
                                //Se deshabilitan los editables
                                $(".contenedor_editable input").prop("readonly", true);
                            //Area de enunciado
                                //ENCABEZADO
                                    //Se deshabilita el botón para añadir elementos
                                    $("#btn_insertar_elemento").css("visibility", "hidden");
                                    //Se deshabilita el texto propio del test
                                    $("#texto_test").prop("readonly", true);
                                    //Se deshabilitan las barras de herramientas para cada elemento del encabezado
                                    $(".mini_barra_herramientas").css("display", "none");
                                //OPCIONES
                                    //Se ocultan las mini barras de herramientas para las imágenes de las opciones
                                    $(".mini_barra_herramientas_opcion").css("display", "none");
                                    //Se deshabilitan los controles de las opciones de test
                                    $(".contenedor_radio_opcion").children("input").prop("disabled", true);
                                    $(".contenedor_label_opcion").children("textarea").prop("readonly", true);

                            //Se cambia a modo de NAVEGACIÓN
                            modoTest = "NAVEGACIÓN";
                    }//if
                }//else if
            }//OnClickEditarTest

            function OnClickEliminarTest()
            {
                var fila = $(this).parent().parent();
                if (modoTest == "NAVEGACIÓN")
                {
                    SeleccionarFilaTabla("tests", $(fila).children());
                    /*
                        Se solicita permiso para eliminar el test.
                        Si está en uso en alguna batería no se permitirá la eliminación
                        Si se permite, entonces se pide confirmación de la eliminación al usuario
                        Finalmente si todo es favorable, se elimina
                    */
                    Permiso("TEST", "", testActual[0], null, null);
                }//if
            }//OnClickEliminarTest

        /////////////////////////////////////////////////////////////////////    
        //---------   EVENTOS DE GESTIÓN DE BATERÍAS DE TESTS   -----------//
        /////////////////////////////////////////////////////////////////////  

            //Pulsación sobre la entrada del menú principal BATERÍAS DE TESTS
            $("#barra_nav li:nth-child(4) > a").click(function(){
                //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                if (modoTrabajo == "NAVEGACIÓN")
                {
                    //Se actualiza el área de trabajo en curso
                    areaTrabajo = "BATERÍAS";
                    //Se visualiza la sección de la gestión de lecciones
                    $("#usuarios_registrados").css("display", "none");
                    $("#medios").css("display", "none");
                    $("#tests").css("display", "none");
                    $("#baterias").css("display", "block");
                    $("#planes").css("display", "none");

                    //Se marca la entrada de menú correspondiente a esta página
                    $("#barra_nav li").css("background-color", colorFondoEntradaMenuPrincipal);
                    $("#barra_nav li:nth-child(4)").css("background-color", colorFondoEntradaMenuPrincipalSeleccionado);

                    if(!inicializadosBateriasTests)
                    {
                        //Se desactiva el botón para cancelar la creación de la batería de tests dado que no nos encontramos en proceso de creación
                        $("#btn_cancelar_bateria_test").prop("disabled", true);
                        //Se crea la tabla de baterías de tests existentes
                        $("#contenedor_baterias").append(CrearTablaBateriasTests());
                        inicializadosBateriasTests = true;
                    }//if          
                }//if
                //Se evita el link
                return false;
            })

            //Pulsación sobre el botón para crear una nueva batería de tests
            $("#btn_nueva_bateria_test").click(function(){
                if (modoBateria == "NAVEGACIÓN")
                {
                    //Se cambia el texto del botón de creación
                    $("#btn_nueva_bateria_test").text("Insertar la nueva batería");
                    //Se activa el botón para cancelar la creación
                    $("#btn_cancelar_bateria_test").prop("disabled", false);
                    //Se elimina la tabla de baterías de tests
                    $("#BT_contenedor_tabla_baterias_tests").remove();
                    //Se elimina la tabla de tests de la batería en curso
                    $("#TT_contenedor_tabla_tests").remove();
                    //Se crea la tabla de tests
                    $("#contenedor_baterias").append(CrearTablaTests(-1));
                    //Se crea la tabla de configuración vacía
                    $("#contenedor_baterias").append(CrearTablaConfiguracion(-1, "", ""));
                    //Se cambia a modo INSERCIÓN
                    modoBateria = "INSERCIÓN";
                }//if
                else if (modoBateria == "INSERCIÓN")
                {
                    //Se solicita confirmación para la inserción de la nueva batería
                    if (confirm("¿Insertar la nueva batería de tests"))
                    {
                        //Se obtienen los datos de la batería
                        var denominacion = $("#CF_denominacion").val();
                        var descripcion = $("#CF_descripcion").val();

                        //Se inserta el nuevo registro en la tabla de baterías de test
                        $.ajax({
                            method: "POST",
                            url: pathPHP + "MediosController.php",
                            data:   {   operacion: 'INSERTAR_BATERÍA',
                                        parametros: [   'ss',
                                                        denominacion,
                                                        descripcion
                                                    ]
                                    },
                            success: function(respuesta)
                                {
                                    var res = JSON.parse(respuesta);

                                    //Se obtiene el código de la batería de test recién generada
                                    var codigoNuevaBateria = res[0]["BT_CODE"];

                                    //Se procede a insertar ahora el contenido de la batería
                                    var conjuntoTests = $("#CF_tabla").children();
                                    for (var contador = 1; contador < conjuntoTests.length; ++contador)
                                    {
                                        var codigoTest = $($($(conjuntoTests)[contador]).children()[0]).text();
                                        $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'INSERTAR_CONTENIDO_BATERÍA',
                                                        parametros: [   'iii',
                                                                        codigoTest,
                                                                        codigoNuevaBateria,
                                                                        contador
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    //var res = JSON.parse(respuesta);                                                        
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });
                                    }//for
                                    //Se eliminan las tablas de tests y configuración
                                    $("#TT_contenedor_tabla_tests").remove()
                                    $("#CF_contenedor_tabla").remove();
                                    //Se crea la tabla con las baterías de tests
                                    $("#contenedor_baterias").append(CrearTablaBateriasTests());
                                    //Se cambia el texto del botón de creación de nuevas baterías
                                    $("#btn_nueva_bateria_test").text("Nueva Batería de Tests");
                                    //Se desactiva el botón para cancelar la creación
                                    $("#btn_cancelar_bateria_test").prop("disabled", true);
                                    //Se restaura el modo de trabajo
                                     modoBateria = "NAVEGACIÓN";
                                },
                            error: function(jqxhr, status, exception)
                                {
                                    alert('Exception:', exception);
                                }
                        });            
                    }//if
                }//else if
                else if (modoBateria == "EDICIÓN")
                {
                    //Se confirma la actualización
                    if (confirm("¿Actualizar el contenido de la batería actual?"))
                    {
                        //ACTUALIZAR LOS DATOS DE LA BATERÍA
                        //Obtención de los datos de los editables
                            //DENOMINACIÓN
                            var denominacion = $("#CF_denominacion").val();
                            //DESCRIPCIÓN
                            var descripcion = $("#CF_descripcion").val();
                        //Se ordena la actualización mediante ajax
                        var op = "ACTUALIZAR_BATERÍA";
                        var param = ['ssi', denominacion,
                                            descripcion,
                                            bateriaActual];
             
                        $.ajax({
                            method: "POST",
                            url: pathPHP + "MediosController.php",
                            data:   {   operacion: op,
                                        parametros: param
                                    },
                            success: function(respuesta)
                                    {
                                        //Se procede a actualizar ahora el contenido de la batería de tests
                                        //Primero se eliminan todos los tests actualmente contenidos
                                        $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'ELIMINAR_CONTENIDO_BATERÍA',
                                                        parametros: [   bateriaActual
                                                                    ]
                                                    },
                                            success: function(respuesta)
                                                {
                                                    //Se recorre la tabla de configuración para extraer los códigos de todos los tests
                                                    var filas = $("#CF_tabla").children();
                                                    for (var cont = 1; cont < filas.length; ++cont)
                                                    {
                                                        var codigoTest = $($($(filas)[cont]).children()[0]).text();
                                                        
                                                        $.ajax({
                                                            method: "POST",
                                                            url: pathPHP + "MediosController.php",
                                                            data:   {   operacion: 'INSERTAR_CONTENIDO_BATERÍA',
                                                                        parametros: [   'iii',
                                                                                        codigoTest,
                                                                                        bateriaActual,
                                                                                        cont
                                                                                    ]
                                                                    },
                                                            success: function(respuesta)
                                                                {       
                                                                    if (cont == filas.length)
                                                                    {
                                                                        //Se elimina la tabla de tests
                                                                        $("#TT_contenedor_tabla_tests").remove();
                                                                        //Se elimina la tabla de configuración
                                                                        $("#CF_contenedor_tabla").remove();
                                                                        //Se crea la tabla de baterías de tests
                                                                        $("#contenedor_baterias").append(CrearTablaBateriasTests());
                                                                        //Se cambia el texto del botón de creación de nuevas baterías
                                                                        $("#btn_nueva_bateria_test").text("Nueva Batería de Tests");
                                                                        //Se desactiva el botón para cancelar la creación
                                                                        $("#btn_cancelar_bateria_test").prop("disabled", true);
                                                                        //Se cambia el texto del botón de cancelación
                                                                        $("#btn_cancelar_bateria_test").text("Cancelar");
                                                                        
                                                                        //Se cambia a modo NAVEGACIÓN                                                
                                                                        modoBateria = "NAVEGACIÓN";
                                                                    }//if
                                                                },
                                                            error: function(jqxhr, status, exception)
                                                                {
                                                                    alert('Exception:', exception);
                                                                }
                                                        });
                                                    }//for
                                                },
                                            error: function(jqxhr, status, exception)
                                                {
                                                    alert('Exception:', exception);
                                                }
                                        });                                        
                                    },
                            error: function(jqxhr, status, exception)
                                    {
                                        alert('Exception:', exception);
                                    }
                            });
                    }//if
                }//else if
            })

            //Pulsación sobre el botón para cancelar la creación en curso
            $("#btn_cancelar_bateria_test").click(function(){
                if (modoBateria == "INSERCIÓN")
                {
                    //Se confirma la cancelación
                    if (confirm("¿Cancelar la creación en curso?"))
                    {
                        //Se elimina la tabla de tests
                        $("#TT_contenedor_tabla_tests").remove();
                        //Se elimina la tabla de configuración
                        $("#CF_contenedor_tabla").remove();
                        //Se crea la tabla de baterías de tests
                        $("#contenedor_baterias").append(CrearTablaBateriasTests());
                        //Se cambia el texto del botón de creación de nuevas baterías
                        $("#btn_nueva_bateria_test").text("Nueva Batería de Tests");
                        //Se desactiva el botón para cancelar la creación
                        $("#btn_cancelar_bateria_test").prop("disabled", true);

                        //Se restaura el modo de trabajo
                        modoBateria = "NAVEGACIÓN";
                    }//if
                }//if
                else if (modoBateria == "EDICIÓN")
                {
                    //Se confirma la cancelación
                    if (confirm("¿Cancelar la edición en curso?"))
                    {
                        //Se elimina la tabla de tests
                        $("#TT_contenedor_tabla_tests").remove();
                        //Se elimina la tabla de configuración
                        $("#CF_contenedor_tabla").remove();
                        //Se crea la tabla de baterías de tests
                        $("#contenedor_baterias").append(CrearTablaBateriasTests());
                        //Se cambia el texto del botón de creación de nuevas baterías
                        $("#btn_nueva_bateria_test").text("Nueva Batería de Tests");
                        //Se desactiva el botón para cancelar la creación
                        $("#btn_cancelar_bateria_test").prop("disabled", true);
                        //Se cambia el texto del botón de cancelación
                        $("#btn_cancelar_bateria_test").text("Cancelar");

                        //Se restaura el modo de trabajo
                        modoBateria = "NAVEGACIÓN";
                    }//if
                }//else if
            })

            function CrearTablaTests(codigoBateria)
            {
                //Contenedor de la tabla
                var divContenedorTabla = Factoria("div", [["id", "TT_contenedor_tabla_tests"],["class", "col-6"]], "");
                    var tabla = Factoria("table", [["id", "TT_tabla_tests"]], "");
                        var fila = Factoria("tr", [["id", "TT_fila_encabezados"]], "");
                        fila.appendChild(Factoria("th", [["id", "TT_col_enc_codigo"],       ["class", "TT_col_enc"]], ""));
                        fila.appendChild(Factoria("th", [["id", "TT_col_enc_nombre"],       ["class", "TT_col_enc"]], "NOMBRE"));
                        fila.appendChild(Factoria("th", [["id", "TT_col_enc_descripcion"],  ["class", "TT_col_enc"]], "DESCRIPCIÓN"));
                        fila.appendChild(Factoria("th", [["id", "TT_col_enc_btn_adjuntar"], ["class", "TT_col_enc"]], ""));
                        //fila.appendChild(Factoria("th", [["id", "TT_col_enc_X"],            ["class", "TT_col_enc"]], ""));
                    tabla.appendChild(fila);
                divContenedorTabla.appendChild(tabla);

                var op, param;
                if (codigoBateria == -1)
                {
                    op = "FILTRAR_TESTS";
                    param = ['i', '1'];
                }//if
                else
                {
                    op = "OBTENER_TESTS_BATERÍA";
                    param = ['i', codigoBateria];
                }//else
     
                $.ajax({
                    method: "POST",
                    url: pathPHP + "MediosController.php",
                    data:   {   operacion: op,
                                parametros: param
                            },
                    success: function(respuesta)
                            {
                                //Extracción de los datos del JSON de respuesta en un array
                                var testsExistentes = JSON.parse(respuesta);
                                //Cargar la tabla de tests
                                testsExistentes.forEach(function(registro)
                                {
                                    var tr = Factoria("tr", [["class", "TT_fila_registro_test"]], "");
            
                                    tr.addEventListener("click", OnClickFilaTT);
                                    tr.addEventListener("dblclick", function(evento){OnDbClickFilaTT(evento);}, false);
                                    //ID
                                    tr.appendChild(Factoria("td", [["class", "TT_col TT_col_codigo"]], registro["TS_CODE"]));
                                    //DENOMINACIÓN
                                    tr.appendChild(Factoria("td", [["class", "TT_col TT_col_nombre"]], registro["TS_DENOMINACION"]));
                                    //DESCRIPCIÓN
                                    tr.appendChild(Factoria("td", [["class", "TT_col TT_col_descripcion"]], registro["TS_DESCRIPCION"]));
                                    //BOTÓN DE ADJUNTAR TEST
                                    if (codigoBateria == -1)
                                    {
                                        var td = tr.appendChild(Factoria("td", [["class", "TT_col TT_col_btn_adjuntar"]], ""));
                                            botonAdjuntarTest = Factoria("i",  [["class", "fas fa-angle-double-right fa-2x btn_adjuntar_test"]], "");
                                            botonAdjuntarTest.addEventListener("click", function(e){OnClickAdjuntarTest(e)});   
                                            td.appendChild(botonAdjuntarTest);
                                    }//if
                                    else
                                    {
                                        tr.appendChild(Factoria("td", [["class", "TT_col TT_col_btn_adjuntar"]], ""));
                                    }//else
        
                                    tabla.append(tr);        
                                });   
                            },
                    error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });

                    return divContenedorTabla;
            }//CrearTablaTests

            function CrearTablaBateriasTests(asignar = false)
            {
                var prefijo = "BT";
                var columnas = "col-6";
                if (asignar)
                {
                    columnas = "col-5";
                    prefijo = "PF";
                }//if

                //Contenedor de la tabla
                var divContenedorTabla = Factoria("div", [["id", prefijo + "_contenedor_tabla_baterias_tests"],["class", columnas]], "");
                    var tabla = Factoria("table", [["id", prefijo + "_tabla_baterias_tests"]], "");
                        var fila = Factoria("tr", [["id", prefijo + "_fila_encabezados"]], "");
                        fila.appendChild(Factoria("th", [["id", prefijo + "_col_enc_codigo"],       ["class", prefijo + "_col_enc"]], ""));
                        fila.appendChild(Factoria("th", [["id", prefijo + "_col_enc_nombre"],       ["class", prefijo + "_col_enc"]], "NOMBRE"));
                        fila.appendChild(Factoria("th", [["id", prefijo + "_col_enc_descripcion"],  ["class", prefijo + "_col_enc"]], "DESCRIPCIÓN"));
                        fila.appendChild(Factoria("th", [["id", prefijo + "_col_enc_btn_izdo"],     ["class", prefijo + "_col_enc"]], ""));
                        if (!asignar)
                        {
                            fila.appendChild(Factoria("th", [["id", prefijo + "_col_enc_btn_dcho"],     ["class", prefijo + "_col_enc"]], ""));
                        }//if
                    tabla.appendChild(fila);
                divContenedorTabla.appendChild(tabla);

                var op = "FILTRAR_BATERIAS_TESTS";
                var param = ['i', '1'];
        
                $.ajax({
                    method: "POST",
                    url: pathPHP + "MediosController.php",
                    data:   {   operacion: op,
                                parametros: param
                            },
                    success: function(respuesta)
                            {
                                //Extracción de los datos del JSON de respuesta en un array
                                var bateriasExistentes = JSON.parse(respuesta);
                                //Cargar la tabla de baterías de tests
                                bateriasExistentes.forEach(function(registro)
                                {
                                    var tr = Factoria("tr", [["class", prefijo + "_fila_registro_bateria_test"]], "");
            
                                    tr.addEventListener("click", OnClickFilaBT);
                                    //tr.addEventListener("dblclick", function(evento){OnDbClickFilaBT(evento);}, false);
                                    //ID
                                    tr.appendChild(Factoria("td", [["class", prefijo + "_col " + prefijo + "_col_codigo"]], registro["BT_CODE"]));
                                    //DENOMINACIÓN
                                    tr.appendChild(Factoria("td", [["class", prefijo + "_col " + prefijo + "_col_nombre"]], registro["BT_DENOMINACION"]));
                                    //DESCRIPCIÓN
                                    tr.appendChild(Factoria("td", [["class", prefijo + "_col " + prefijo + "_col_descripcion"]], registro["BT_DESCRIPCION"]));
                                    if (asignar)
                                    {
                                        //BOTÓN DE ASIGNAR BATERÍA A ALUMNO
                                        var td = tr.appendChild(Factoria("td", [["class", prefijo + "_col " + prefijo + "_col_btn_izdo"]], ""));
                                            botonAsignarBateria = Factoria("i",  [["class", "fas fa-angle-double-right fa-2x btn_asignar"]], "");
                                            botonAsignarBateria.addEventListener("click", function(e){OnClickAsignarBateria(e);});     
                                            td.appendChild(botonAsignarBateria);
                                    }//if
                                    else
                                    {
                                        //BOTÓN DE EDICIÓN
                                        var td = tr.appendChild(Factoria("td", [["class", prefijo + "_col " + prefijo + "_col_btn_izdo"]], ""));
                                            botonEditarBateria = Factoria("button",[["type", "button"],
                                                                                    ["class", "btn btn-primary"]], "Editar");
                                            botonEditarBateria.addEventListener("click", function(e){OnClickEditarBateria(e);});     
                                            td.appendChild(botonEditarBateria);
                                        //BOTÓN DE ELIMINACIÓN
                                        var td = tr.appendChild(Factoria("td", [["class", prefijo + "_col " + prefijo + "_col_btn_dcho"]], ""));
                                            botonEliminarBateria = Factoria("button",   [["type", "button"],
                                                                                        ["class", "btn btn-dark " + prefijo + "_btn_eliminar_bateria"]], "Eliminar");
                                            botonEliminarBateria.addEventListener("click", function(e){OnClickEliminarBateria(e);});     
                                            td.appendChild(botonEliminarBateria);
                                    }//else
                                    
                                    tabla.append(tr);        
                                });   
                                /*        
                                if (testsObtenidos)
                                {
                                    SeleccionarFilaTablaPosicion("tests", 1);
                                }//if
                                */
                            },
                    error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });

                    return divContenedorTabla;
            }//CrearTablaBateriasTests

            function OnClickEditarBateria(e)
            {
                e.stopPropagation();
                //Se obtiene el código de la batería a editar
                bateriaActual = $($(e.target).parent().siblings()[0]).text();
                //Se obtienen el nombre y descripción de la batería
                var nombre = $($(e.target).parent().siblings()[1]).text();
                var descripcion = $($(e.target).parent().siblings()[2]).text();

                //Se cambia el texto del botón de inserción
                $("#btn_nueva_bateria_test").text("Actualizar Batería de Test");
                //Se activa el botón para cancelar la edición y se cambia el texto
                $("#btn_cancelar_bateria_test").prop("disabled", false);
                $("#btn_cancelar_bateria_test").text("Cancelar la edición");
                //Se elimina la tabla de baterías de tests
                $("#BT_contenedor_tabla_baterias_tests").remove();
                //Se elimina la tabla de tests
                $("#TT_contenedor_tabla_tests").remove();
                //Se crea la tabla de tests
                $("#contenedor_baterias").append(CrearTablaTests(-1));
                //Se crean la tabla de configuración cargada con los tests de la batería
                $("#contenedor_baterias").append(CrearTablaConfiguracion(bateriaActual, nombre, descripcion));

                //Se cambia a modo EDICIÓN
                modoBateria = "EDICIÓN";
            }//OnClickEditarBateria

            function OnClickEliminarBateria(e)
            {
                e.stopPropagation();
                //Se obtiene el código de la batería a eliminar
                bateriaActual = $($(e.target).parent().siblings()[0]).text();
                /*
                    Se solicita permiso para eliminar la batería.
                    Si está asignada a algún plan de formación no se permitirá la eliminación
                    Si se permite, entonces se pide confirmación de la eliminación al usuario
                    Finalmente si todo es favorable, se elimina
                */
                Permiso("BATERÍA", "", bateriaActual, null, null);
            }//OnClickEliminarBateria

            function OnClickFilaBT()
            {
                //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                $('#BT_tabla_baterias_tests td').css({  'color': colorTextoFilaNormal,
                                                        'background-color': colorFondoFilaNormal});
                //Se resalta la fila seleccionada
                $(this).children("td").css({    'color': colorTextoFilaResaltada,
                                                'background-color': colorFondoFilaResaltada});

                //Se actualiza la batería en curso
                bateriaActual = $($(this).children("td")[0]).text();

                //Se elimina cualquier tabla de tests previa y se crea con el contenido de la batería actual
                $("#TT_contenedor_tabla_tests").remove();
                $("#contenedor_baterias").append(CrearTablaTests(bateriaActual));
            }//OnClickFilaBT

            function CrearTablaConfiguracion(codigoBateria, nombre, descripcion)
            {
                //Contenedor de la tabla
                var divContenedorTabla = Factoria("div", [["id", "CF_contenedor_tabla"],["class", "col-6"]], "");
                //ÁREA DE EDITABLES
                var divContenedorEditables = Factoria("div", [["id", "CF_contenedor_editables"]], "");
                    //Denominación
                    var divContenedorEditable = Factoria("div", [["id", "CF_contenedor_denominacion"],["class", "CF_contenedor_editable"]], "");
                        var label = Factoria("label", [["for", "denominacion"]], "Denominación:");
                        var input = Factoria("input", [["type", "text"], ["name", "denominacion"],["id", "CF_denominacion"],["value", nombre]], "");
                        divContenedorEditable.appendChild(label);
                        divContenedorEditable.appendChild(input);
                    divContenedorEditables.appendChild(divContenedorEditable);
                    //Descripción
                    divContenedorEditable = Factoria("div", [["id", "CF_contenedor_descripcion"],["class", "CF_contenedor_editable"]], "");
                        label = Factoria("label", [["for", "descripcion"]], "Descripción:");
                        input = Factoria("input", [["type", "text"], ["name", "descripcion"],["id", "CF_descripcion"],["value", descripcion]], "");
                        divContenedorEditable.appendChild(label);
                        divContenedorEditable.appendChild(input);
                    divContenedorEditables.appendChild(divContenedorEditable);
                divContenedorTabla.appendChild(divContenedorEditables);

                //TABLA DE CONFIGURACIÓN
                var tabla = Factoria("table", [["id", "CF_tabla"]], "");
                    var fila = Factoria("tr", [["id", "CF_fila_encabezados"]], "");
                    fila.appendChild(Factoria("th", [["id", "CF_col_enc_codigo"],       ["class", "CF_col_enc"]], ""));
                    fila.appendChild(Factoria("th", [["id", "CF_col_enc_nombre"],       ["class", "CF_col_enc"]], "NOMBRE"));
                    fila.appendChild(Factoria("th", [["id", "CF_col_enc_descripcion"],  ["class", "CF_col_enc"]], "DESCRIPCIÓN"));
                    fila.appendChild(Factoria("th", [["id", "CF_col_enc_btn_retirar"],  ["class", "CF_col_enc"]], ""));
                    fila.appendChild(Factoria("th", [["id", "CF_col_enc_btn_subir"],    ["class", "CF_col_enc"]], ""));
                    fila.appendChild(Factoria("th", [["id", "CF_col_enc_btn_bajar"],    ["class", "CF_col_enc"]], ""));
                tabla.appendChild(fila);
                divContenedorTabla.appendChild(tabla);

                if (codigoBateria != -1)
                {
                    //Se pretende editar una batería de test luego hay que cargar los datos de los tests que la componen
                    var op = "OBTENER_TESTS_BATERÍA";
                    var param = ['i', codigoBateria];
         
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: op,
                                    parametros: param
                                },
                        success: function(respuesta)
                                {
                                    //Extracción de los datos del JSON de respuesta en un array
                                    var testsExistentes = JSON.parse(respuesta);
                                    //Cargar la tabla de configuración con los tests
                                    testsExistentes.forEach(function(registro)
                                    {
                                        //Se crea una fila en la tabla de configuración con los datos del test
                                        var tr = Factoria("tr", [["class", "CF_fila_registro_test"]], "");
                                    
                                        tr.addEventListener("click", OnClickFilaCF);
                                        //ID
                                        tr.appendChild(Factoria("td", [["class", "CF_col CF_col_codigo"]], registro["TS_CODE"]));
                                        //DENOMINACIÓN
                                        tr.appendChild(Factoria("td", [["class", "CF_col CF_col_nombre"]], registro["TS_DENOMINACION"]));
                                        //DESCRIPCIÓN
                                        tr.appendChild(Factoria("td", [["class", "CF_col CF_col_descripcion"]], registro["TS_DESCRIPCION"]));
                                        //BOTÓN DE RETIRAR TEST
                                        var td = tr.appendChild(Factoria("td", [["class", "CF_col CF_col_btn_retirar"]], ""));
                                            botonRetirarTest = Factoria("i",  [["class", "fas fa-angle-double-left fa-2x btn_retirar_test"]], "");
                                            botonRetirarTest.addEventListener("click", function(e){OnClickRetirarTest(e)});   
                                            td.appendChild(botonRetirarTest);
                                        //BOTÓN DE SUBIR TEST
                                        var td = tr.appendChild(Factoria("td", [["class", "CF_col CF_col_btn_subir"]], ""));
                                            botonSubirTest = Factoria("i",  [["class", "fas fa-angle-up fa-2x btn_subir_test"]], "");
                                            botonSubirTest.addEventListener("click", function(e){OnClickTestArriba(e)});   
                                            td.appendChild(botonSubirTest);
                                        //BOTÓN DE BAJAR TEST
                                        var td = tr.appendChild(Factoria("td", [["class", "CF_col CF_col_btn_bajar"]], ""));
                                            botonBajarTest = Factoria("i",  [["class", "fas fa-angle-down fa-2x btn_bajar_test"]], "");
                                            botonBajarTest.addEventListener("click", function(e){OnClickTestAbajo(e)});   
                                            td.appendChild(botonBajarTest);

                                        $("#CF_tabla").append(tr);
                                    });   
                                    /*        
                                    if (testsObtenidos)
                                    {
                                        SeleccionarFilaTablaPosicion("tests", 1);
                                    }//if
                                    */
                                },
                        error: function(jqxhr, status, exception)
                                {
                                    alert('Exception:', exception);
                                }
                        });
                }//if

                return divContenedorTabla;
            }//CrearTablaConfiguracion

            function OnClickAdjuntarTest(e)
            {
                //Se obtienen los datos del test a adjuntar
                var datos = $(e.target).parent().siblings();
                var codigo = $($(datos)[0]).text();
                var denominacion = $($(datos)[1]).text();
                var descripcion = $($(datos)[2]).text();
                //Se crea una fila en la tabla de configuración con los datos del test
                var tr = Factoria("tr", [["class", "CF_fila_registro_test"]], "");
            
                tr.addEventListener("click", OnClickFilaCF);
                //ID
                tr.appendChild(Factoria("td", [["class", "CF_col CF_col_codigo"]], codigo));
                //DENOMINACIÓN
                tr.appendChild(Factoria("td", [["class", "CF_col CF_col_nombre"]], denominacion));
                //DESCRIPCIÓN
                tr.appendChild(Factoria("td", [["class", "CF_col CF_col_descripcion"]], descripcion));
                //BOTÓN DE RETIRAR TEST
                var td = tr.appendChild(Factoria("td", [["class", "CF_col CF_col_btn_retirar"]], ""));
                    botonRetirarTest = Factoria("i",  [["class", "fas fa-angle-double-left fa-2x btn_retirar_test"]], "");
                    botonRetirarTest.addEventListener("click", function(e){OnClickRetirarTest(e)});   
                    td.appendChild(botonRetirarTest);
                //BOTÓN DE SUBIR TEST
                var td = tr.appendChild(Factoria("td", [["class", "CF_col CF_col_btn_subir"]], ""));
                    botonSubirTest = Factoria("i",  [["class", "fas fa-angle-up fa-2x btn_subir_test"]], "");
                    botonSubirTest.addEventListener("click", function(e){OnClickTestArriba(e)});   
                    td.appendChild(botonSubirTest);
                //BOTÓN DE BAJAR TEST
                var td = tr.appendChild(Factoria("td", [["class", "CF_col CF_col_btn_bajar"]], ""));
                    botonBajarTest = Factoria("i",  [["class", "fas fa-angle-down fa-2x btn_bajar_test"]], "");
                    botonBajarTest.addEventListener("click", function(e){OnClickTestAbajo(e)});   
                    td.appendChild(botonBajarTest);

                $("#CF_tabla").append(tr);
            }//OnClickAdjuntarTest

            function OnClickTestArriba(e)
            {
                //Se obtiene la fila correspondiente al test actual
                var filaActual = $(e.target).parent().parent();
                //Se obtiene la fila previa a la actual
                var filaPrevia = $(e.target).parent().parent().prev(".CF_fila_registro_test");
                //Sólo se mueve hacia arriba si no está el primero
                if ($(filaPrevia).length)
                {
                    //Se inserta la fila actual antes de la previa
                    $(filaPrevia).before(filaActual);
                }//if
            }//OnClickTestArriba

            function OnClickTestAbajo(e)
            {
                //Se obtiene la fila correspondiente al test actual
                var filaActual = $(e.target).parent().parent();
                //Se obtiene la fila posterior a la actual
                var filaPosterior = $(e.target).parent().parent().next(".CF_fila_registro_test");
                //Sólo se mueve hacia abajo si no está el último
                if ($(filaPosterior).length)
                {
                    //Se inserta la fila actual a continuación de la posterior
                    $(filaPosterior).after(filaActual);
                }//if
            }//OnClickTestAbajo

            function OnClickFilaCF()
            {
                //
            }//OnClickFilaCF

            function OnClickRetirarTest(e)
            {
                //Se elimina la fila del test en cuestión de la tabla de configuración
                $(e.target).parent().parent().remove();
            }//OnClickRetirarTest

            function OnClickFilaTT()
            {
                //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                $('#TT_tabla_tests td').css({ 'color': colorTextoFilaNormal,
                                              'background-color': colorFondoFilaNormal});
                //Se resalta la fila seleccionada
                $(this).children("td").css({'color': colorTextoFilaResaltada,
                                            'background-color': colorFondoFilaResaltada});
            }//OnClickFilaTT

            function OnDbClickFilaTT(e)
            {
                var codigo = $($(e.target).siblings()[0]).text();

                $("#TS_contenedor_test").remove();

                test = MostrarTest(codigo, e.pageX, e.pageY, false);

                timer = setTimeout(function(){
                    $("#TS_contenedor_test").remove();
                }, 2000);

            }//OnDbClickFilaTT

            function MostrarTest(id, coordX, coordY, ejecutable)
            {
                //OBTENCIÓN DE LOS DATOS DEL TEST
                var op = "FILTRAR_CONTENIDO_TEST";
                var param = ['i', id];
        
                $.ajax({
                    method: "POST",
                    url: pathPHP + "MediosController.php",
                    data:   {   operacion: op,
                                parametros: param
                            },
                    success: function(respuesta)
                            {
                                //Extracción de los datos del JSON de respuesta en un array
                                var datos = JSON.parse(respuesta);
                                                
                                //Contenedor del test
                                var divContenedorTest = Factoria("div", [["id", "TS_contenedor_test"]], "");

                                divContenedorTest.addEventListener("mouseenter", OnCursorEntraTest);
                                divContenedorTest.addEventListener("mouseleave", OnCursorFueraTest);

                                //ÁREA DEL NOMBRE
                                    //Contenedor del nombre
                                    var divContenedorNombreTest = Factoria("div", [["id", "TS_contenedor_nombre"]], "");
                                    //Párrafo con el nombre
                                    var pNombreTest = Factoria("p", [["id", "TS_nombre"]], datos[0]["TS_DENOMINACION"]);
                                    divContenedorNombreTest.appendChild(pNombreTest);

                                    divContenedorTest.appendChild(divContenedorNombreTest);

                                //ÁREA DE LA DESCRIPCIÓN
                                    //Contenedor de la descripción
                                    var divContenedorDescripcionTest = Factoria("div", [["id", "TS_contenedor_descripcion"]], "");
                                    //Párrafo con la descripción
                                    var pDescripcionTest = Factoria("p", [["id", "TS_descripcion"]], datos[0]["TS_DESCRIPCION"]);
                                    divContenedorDescripcionTest.appendChild(pDescripcionTest);

                                    divContenedorTest.appendChild(divContenedorDescripcionTest);

                                //ÁREA DEL ENCABEZADO
                                    //Contenedor del encabezado
                                    var divContenedorEncabezadoTest = Factoria("div", [["id", "TS_contenedor_encabezado"]], "");
                                        //Contenedor del texto propio
                                        var divContenedorTextoPropio = Factoria("div", [["id", "TS_contenedor_texto_propio"]], "");
                                        //Párrafo con el texto propio
                                        var pTextoPropio = Factoria("p", [["id", "TS_texto_propio"]], datos[0]["TS_ENUNCIADO"]);
                                        divContenedorTextoPropio.appendChild(pTextoPropio);

                                        divContenedorEncabezadoTest.appendChild(divContenedorTextoPropio);

                                        //CARGA DE LOS ELEMENTOS DEL ENCABEZADO
                                        $.ajax({
                                            method: "POST",
                                            url: pathPHP + "MediosController.php",
                                            data:   {   operacion: 'FILTRAR_CONTENIDO_ENCABEZADO',
                                                        parametros: param
                                                    },
                                            success: function(res)
                                                    {
                                                        //Extracción de los datos del JSON de respuesta en un array
                                                        var encabezado = JSON.parse(res);

                                                        encabezado.forEach(function(elemento){
                                                            var divMedioAdjunto = Factoria("div", [["class", "TS_medio_adjunto"],["id", "TS_medio_adjunto"]], "");
                                                            var medioContenido;

                                                            switch (elemento["MD_TIPO"])
                                                            {
                                                                case "TEXTO":
                                                                    {
                                                                        medioContenido = Factoria("p",  [["class", "TS_medio_texto"],
                                                                                                        ["id", "TS_medio_texto"]], elemento["MD_VALOR"]);
                                                                        break;
                                                                    }
                                                                case "IMAGEN":
                                                                    {
                                                                        medioContenido = Factoria("img",[["src", "../media/Imagenes/" + elemento["MD_RUTA"]],
                                                                                                        ["class", "foto TS_visor_imagen_card"],
                                                                                                        ["id", "TS_visor_imagen_card"],
                                                                                                        ["alt", ""]], "");                                                                    
                                                                        break;
                                                                    }
                                                                case "VIDEO":
                                                                    {
                                                                        medioContenido = Factoria("video",  [["src", "../media/Videos/" + elemento["MD_RUTA"]],
                                                                                                            ["controls", "true"],
                                                                                                            ["preload", "metadata"],
                                                                                                            ["class", "foto TS_visor_video_card"],
                                                                                                            ["id", "TS_visor_video_card"],
                                                                                                            ["alt", ""]], "");
                                                                        break;
                                                                    }
                                                                case "AUDIO":
                                                                    {
                                                                        medioContenido = Factoria("audio",  [["src", "../media/Audio/" + elemento["MD_RUTA"]],
                                                                                                            ["controls", "true"],
                                                                                                            ["id", "TS_audio_player"],
                                                                                                            ["class", "TS_audio_player"],
                                                                                                            ["alt", ""]], "");
                                                                        break;
                                                                    }
                                                            }//switch
                                                            divMedioAdjunto.appendChild(medioContenido);
                                            
                                                            divContenedorEncabezadoTest.appendChild(divMedioAdjunto);
                                                        })
                                                    },
                                            error: function(jqxhr, status, exception)
                                                    {
                                                        alert('Exception:', exception);
                                                    }
                                            });

                                    divContenedorTest.appendChild(divContenedorEncabezadoTest);

                                //ÁREA DE LAS OPCIONES
                                    //Contenedor de las opciones
                                    var divContenedorOpcionesTest = Factoria("div", [["id", "TS_contenedor_opciones"],["class", "container-fluid"]], "");
                                    divContenedorTest.appendChild(divContenedorOpcionesTest);

                                    divContenedorOpcionesTest.appendChild(InsertarElementosOpcion(1, datos[0]["TS_RESPUESTA"], datos[0]["TS_OP1_TXT"], datos[0]["TS_OP1_IMG"]));
                                    divContenedorOpcionesTest.appendChild(InsertarElementosOpcion(2, datos[0]["TS_RESPUESTA"], datos[0]["TS_OP2_TXT"], datos[0]["TS_OP2_IMG"]));
                                    divContenedorOpcionesTest.appendChild(InsertarElementosOpcion(3, datos[0]["TS_RESPUESTA"], datos[0]["TS_OP3_TXT"], datos[0]["TS_OP3_IMG"]));
                                    divContenedorOpcionesTest.appendChild(InsertarElementosOpcion(4, datos[0]["TS_RESPUESTA"], datos[0]["TS_OP4_TXT"], datos[0]["TS_OP4_IMG"]));

                                    //$(divContenedorTest).css({position: "absolute", top: coordY, left: coordX, background: "white"});
                                    $(divContenedorTest).draggable();
                                    $(divContenedorTest).css({position: "fixed", top: 50, left: 50, background: "white"});
                                    

                                $("#baterias").append(divContenedorTest);

                                return divContenedorTest;
                            },
                    error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });
            }//MostrarTest

            function InsertarElementosOpcion(opcion, respuesta, texto, imagen)
            {
                //Variables locales auxiliares
                var divContenedorOpcion, radioOpcion, pTextoOpcion;
        
                //CONTENEDOR DE LA OPCIÓN
                divContenedorOpcion = Factoria("div", [["id", "TS_contenedor_opcion" + opcion],["class", "row align-items-center TS_contenedor_opcion"]], "");
                
                    //RADIO BUTTON DE LA OPCIÓN
                    if (respuesta == opcion)
                    {
                        radioOpcion = Factoria("input", [["type", "radio"],
                                                        ["id", "TS_opcion" + opcion],
                                                        ["name", "TS_opciones_test"],
                                                        ["class", "TS_radio_opcion"],
                                                        ["value", "-1"],
                                                        ["checked", true],
                                                        ["disabled", true]], "");
                    }//if
                    else
                    {
                        radioOpcion = Factoria("input", [["type", "radio"],
                                                        ["id", "TS_opcion" + opcion],
                                                        ["name", "TS_opciones_test"],
                                                        ["class", "TS_radio_opcion"],
                                                        ["value", "-1"],
                                                        ["disabled", true]], "");
                    }//else
                    radioOpcion.addEventListener("click", function(e){OnClickOpcion(e);});                       
                    divContenedorOpcion.appendChild(radioOpcion);
                    
                    //TEXTO DE LA OPCIÓN 
                    pTextoOpcion = Factoria("p", [["id", "TS_texto_opcion" + opcion],["class", "TS_texto_opcion"]], texto);                                        
                    divContenedorOpcion.appendChild(pTextoOpcion);
                    
                    //IMAGEN DE LA OPCIÓN
                    if (imagen)
                    {
                        $.ajax({
                            method: "POST",
                            url: pathPHP + "MediosController.php",
                            data:   {   operacion: 'OBTENER_IMAGEN_OPCION',
                                        parametros: ['s', imagen]
                                    },
                            success: function(respuesta)
                                    {
                                        //Extracción de los datos del JSON de respuesta en un array
                                        var imgopc = JSON.parse(respuesta);
        
                                        var imgOpcion = Factoria("img", [["src", "../media/Tests/" + imgopc[0]["IOT_RUTA"]],
                                                                        ["id", "TS_imagen_opcion" + opcion],
                                                                        ["class", "TS_imagen_opcion"],
                                                                        ["alt", ""]], "");
                                        $("#TS_texto_opcion" + opcion).before(imgOpcion);
                                    },
                            error: function(jqxhr, status, exception)
                                    {
                                        alert('Exception:', exception);
                                    }
                            });                                            
                    }//if
                    return divContenedorOpcion;
            }//InsertarElementosOpcion

            function OnCursorEntraTest()
            {
                //$(this).css({"position": "relative","width": "50%"});
                clearTimeout(timer);
            }//OnCursorEntraTest

            function OnCursorFueraTest()
            {
                //$(this).css("background-color", "red");
                timer = setTimeout(function(){
                    $("#TS_contenedor_test").remove();
                }, 2000);
            }//OnCursorFueraTest

        /////////////////////////////////////////////////////////////
        //-----   EVENTOS DE GESTIÓN DE PLANES DE FORMACIÓN   -----//
        /////////////////////////////////////////////////////////////

            //Pulsación sobre la entrada del menú principal PLANES DE FORMACIÓN
            $("#barra_nav li:last-child > a").click(function(){
                //Sólo se actúa si el modo de trabajo es NAVEGACIÓN
                if (modoTrabajo == "NAVEGACIÓN")
                {
                    //Se actualiza el área de trabajo en curso
                    areaTrabajo = "PLANES";
                    //Se visualiza la sección de la gestión de planes de formación
                    $("#usuarios_registrados").css("display", "none");
                    $("#medios").css("display", "none");
                    $("#tests").css("display", "none");
                    $("#baterias").css("display", "none");
                    $("#planes").css("display", "block");

                    //Se marca la entrada de menú correspondiente a esta página
                    $("#barra_nav li").css("background-color", colorFondoEntradaMenuPrincipal);
                    $("#barra_nav li:last-child").css("background-color", colorFondoEntradaMenuPrincipalSeleccionado);

                    if(!inicializadosPlanes)
                    {
                        //Se ocultan los botones para gestionar las asignaciones
                        $("#btn_editar_asignaciones").css("display", "none");
                        $("#btn_cancelar_asignaciones").css("display", "none");
                        //Se crea la tabla con los alumnos existentes
                        $("#contenedor_planes").append(CrearTablaAlumnos());
                        inicializadosPlanes = true;
                    }//if         
                }//if
                //Se evita el link
                return false;
            })

            function CrearTablaAlumnos()
            {
                //Contenedor de la tabla
                var divContenedorTabla = Factoria("div", [["id", "PF_contenedor_tabla_alumnos"],["class", "col-5"]], "");
                    var tabla = Factoria("table", [["id", "PF_tabla_alumnos"]], "");
                        var fila = Factoria("tr", [["id", "PF_fila_encabezados"]], "");
                        fila.appendChild(Factoria("th", [["id", "PF_col_enc_codigo"],       ["class", "PF_col_enc"]], ""));
                        fila.appendChild(Factoria("th", [["id", "PF_col_enc_nombre"],       ["class", "PF_col_enc"]], "NOMBRE"));
                        fila.appendChild(Factoria("th", [["id", "PF_col_enc_apellidos"],    ["class", "PF_col_enc"]], "APELLIDOS"));
                        fila.appendChild(Factoria("th", [["id", "PF_col_enc_foto"],         ["class", "PF_col_enc"]], ""));
                        fila.appendChild(Factoria("th", [["id", "PF_col_enc_btn_editar"],   ["class", "PF_col_enc"]], ""));
                    tabla.appendChild(fila);
                divContenedorTabla.appendChild(tabla);

                $.ajax({
                        method: "POST",
                        url: pathPHP + "UsuariosController.php",
                        data:   {   operacion: 'FILTRAR',
                                    parametros: ['sss', 'ALUMNO', '%', '%']
                                },
                        success: function(respuesta)
                                {
                                    //Extracción de los datos del JSON de respuesta en un array
                                    var usuarios = JSON.parse(respuesta);
                                    //Cargar la tabla de baterías de tests
                                    usuarios.forEach(function(registro)
                                    {
                                        var tr = Factoria("tr", [["class", "PF_fila_registro_alumno"]], "");
                
                                        tr.addEventListener("click", OnClickFilaPF);
                                        //ID
                                        tr.appendChild(Factoria("td", [["class", "PF_col PF_col_codigo"]], registro["USR_CODE"]));
                                        //NOMBRE
                                        tr.appendChild(Factoria("td", [["class", "PF_col PF_col_nombre"]], registro["USR_NOMBRE"]));
                                        //APELLIDOS
                                        tr.appendChild(Factoria("td", [["class", "PF_col PF_col_apellidos"]], registro["USR_APELLIDOS"]));
                                        //FOTO
                                        //Si existe un nombre para la foto del usuario se genera el path desde el repositorio de fotos
                                        td = Factoria("td", [["class", "PF_col PF_col_foto"]], "");
                                        if (registro["USR_FOTO"] != "No foto")
                                        {
                                            ruta_foto = "../media/Usuarios/" + registro["USR_FOTO"];
                                            td.appendChild(Factoria("img", [["src", ruta_foto],
                                                                            ["class", "foto_usuario_inline"]], ""));
                                        }//if
                                        else
                                        {
                                            td.appendChild(Factoria("img", [["src", ""],
                                                                            ["class", "foto_usuario_inline"]], ""));
                                        }//else
                                        tr.appendChild(td);
                                        //BOTÓN DE EDICIÓN
                                        var td = tr.appendChild(Factoria("td", [["class", "PF_col PF_col_btn_editar"]], ""));
                                            botonEditarAsignaciones = Factoria("button",[["type", "button"],
                                                                                        ["class", "btn btn-primary"]], "Editar");
                                            botonEditarAsignaciones.addEventListener("click", function(e){OnClickEditarAsignaciones(e)});   
                                            td.appendChild(botonEditarAsignaciones);
                                       
                                        tabla.append(tr);
                                        
                                        //Se selecciona el primer alumno de la tabla si lo hay
                                        SeleccionarFilaTablaPosicion("alumnos", 1);
                                    });   
                                },
                        error: function(jqxhr, status, exception)
                                {
                                    alert('Exception:', exception);
                                }
                        });

                    return divContenedorTabla;
            }//CrearTablaAlumnos

            function OnClickEditarAsignaciones(e)
            {
                //e.stopPropagation();

                //Se muestra el botón de actualizar
                $("#btn_editar_asignaciones").css("display", "block");
                //Se muestra el botón para cancelar la edición
                $("#btn_cancelar_asignaciones").css("display", "block");
                //Se elimina la tabla de alumnos
                $("#PF_contenedor_tabla_alumnos").remove();
                //Se crea la tabla de baterías de tests
                $("#TA_contenedor_tabla").before(CrearTablaBateriasTests(true));
                //Se configura la tabla de asignaciones para que se pueda editar
                $(".boton_retirar_asignacion").css("display", "block");

                //Se cambia a modo EDICIÓN
                modoPlanes = "EDICIÓN";
            }//OnClickEditarAsignaciones

            $("#btn_editar_asignaciones").click(function(){
                //Se confirma la actualización
                if (confirm("¿Actualizar las asignaciones para el alumno actual?"))
                {
                    //ACTUALIZAR LOS DATOS DE LAS ASIGNACIONES
                    //Primero se eliminan todas las asignaciones para el alumno actual
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: 'ELIMINAR_ASIGNACIONES',
                                    parametros: [   alumnoActual[0]
                                                ]
                                },
                        success: function(respuesta)
                            {
                                //Se recorre la tabla de asignaciones para extraer los datos
                                var filas = $("#TA_tabla").children();
                                for (var cont = 1; cont < filas.length; ++cont)
                                {
                                    var codigoBateria   = $($($(filas)[cont]).children()[0]).text();
                                    var fechaAsignacion = $($($(filas)[cont]).children()[3]).text();
                                    var fechaInicio     = $($($(filas)[cont]).children()[4]).text();
                                    var fechaFin        = $($($(filas)[cont]).children()[5]).text();
                                    var calificacion    = $($($(filas)[cont]).children()[6]).text();
                                    var ejecucion       = $($($(filas)[cont]).children()[7]).text();
                                    
                                    $.ajax({
                                        method: "POST",
                                        url: pathPHP + "MediosController.php",
                                        data:   {   operacion: 'ACTUALIZAR_ASIGNACIONES_ALUMNO',
                                                    parametros: [   'iissssi',
                                                                    alumnoActual[0],
                                                                    codigoBateria,
                                                                    fechaAsignacion,
                                                                    fechaInicio,
                                                                    fechaFin,
                                                                    ejecucion,
                                                                    calificacion
                                                                ]
                                                },
                                        success: function(respuesta)
                                            {       
                                                if (cont == filas.length)
                                                {
                                                    //Se oculta el botón de actualizar
                                                    $("#btn_editar_asignaciones").css("display", "none");
                                                    //Se oculta el botón para cancelar la edición
                                                    $("#btn_cancelar_asignaciones").css("display", "none");
                                                    //Se elimina la tabla de baterías de tests
                                                    $("#PF_contenedor_tabla_baterias_tests").remove();
                                                    //Se crea la tabla de alumnos
                                                    $("#contenedor_planes").append(CrearTablaAlumnos());
                                                    //Se selecciona al alumno en curso
                                                    SeleccionarFilaTablaCodigo("alumnos", alumnoActual[0]);
                                                    //Se cambia a modo EDICIÓN
                                                    modoPlanes = "NAVEGACIÓN";
                                                }//if
                                            },
                                        error: function(jqxhr, status, exception)
                                            {
                                                alert('Exception:', exception);
                                            }
                                    });
                                }//for
                            },
                        error: function(jqxhr, status, exception)
                            {
                                alert('Exception:', exception);
                            }
                    });
                }//if
            });

            $("#btn_cancelar_asignaciones").click(function(){
                //Se solicita confirmación de la cancelación
                if (confirm("¿Desea cancelar las asignaciones en curso?"))
                {
                    //Se oculta el botón de actualizar
                    $("#btn_editar_asignaciones").css("display", "none");
                    //Se oculta el botón para cancelar la edición
                    $("#btn_cancelar_asignaciones").css("display", "none");
                    //Se elimina la tabla de baterías de tests
                    $("#PF_contenedor_tabla_baterias_tests").remove();
                    //Se crea la tabla de alumnos
                    $("#contenedor_planes").append(CrearTablaAlumnos());
                    //Se selecciona al alumno en curso
                    SeleccionarFilaTablaCodigo("alumnos", alumnoActual[0]);
                    //Se cambia a modo EDICIÓN
                    modoPlanes = "NAVEGACIÓN";
                }//if
            });

            function OnClickAsignarBateria(e)
            {
                //Se obtienen los datos de la batería a adjuntar
                var datos = $(e.target).parent().siblings();
                var codigo = $($(datos)[0]).text();
                var denominacion = $($(datos)[1]).text();
                var descripcion = $($(datos)[2]).text();
                //Se comprueba que la batería seleccionada no se encuentra ya asignada al alumno
                var filas = $("#TA_tabla tr");
                for (let cont = 1; cont < filas.length; cont++)
                {
                    if ($($(filas[cont]).children()[0]).text() == codigo)
                    {
                        alert("¡La batería seleccionada ya está asignada al alumno!\nNo se puede asignar.");
                        return;
                    }//if
                }//for
                //Se crea una fila en la tabla de asignación con los datos de la batería
                var tr = Factoria("tr", [["class", "TA_fila_registro_bateria"]], "");
            
                tr.addEventListener("click", OnClickFilaTA);
                //ID
                tr.appendChild(Factoria("td", [["class", "TA_col TA_col_codigo"]], codigo));
                //DENOMINACIÓN
                tr.appendChild(Factoria("td", [["class", "TA_col TA_col_nombre"]], denominacion));
                //DESCRIPCIÓN
                tr.appendChild(Factoria("td", [["class", "TA_col TA_col_descripcion"]], descripcion));
                //FECHA DE ASIGNACIÓN
                tr.appendChild(Factoria("td", [["class", "TA_col TA_col_fechaAsignacion"]], ObtenerFechaHoraActual()));
                //FECHA DE INICIO DE EJECUCIÓN
                tr.appendChild(Factoria("td", [["class", "TA_col TA_col_fechaInicio"]], ""));
                //FECHA DE FINALIZACIÓN DE LA EJECUCIÓN
                tr.appendChild(Factoria("td", [["class", "TA_col TA_col_fechaFin"]], ""));
                //CALIFICACIÓN FINAL
                tr.appendChild(Factoria("td", [["class", "TA_col TA_col_nota"]], ""));
                //BOTÓN DE RETIRAR ASIGNACIÓN
                var td = tr.appendChild(Factoria("td", [["class", "TA_col TA_col_btn_retirar"]], ""));
                    botonRetirarAsignacion = Factoria("i",  [["class", "fas fa-backspace fa-2x boton_retirar_asignacion"]], "");
                    botonRetirarAsignacion.addEventListener("click", function(e){OnClickRetirarAsignacion(e)});   
                    td.appendChild(botonRetirarAsignacion);

                $("#TA_tabla").append(tr);
            }//OnClickAsignarBateria

            function OnClickFilaPF()
            {
                var codigoFilaActual = $($(this).children()[0]).text();
                //Se verifica que efectivamente se ha cambiado de fila
                if (codigoFilaActual != alumnoActual[0])
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#PF_tabla_alumnos td').css({ 'color': colorTextoFilaNormal,
                                                    'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    alumnoActual = [];

                    //Se resalta la fila seleccionada
                    for (let cont = 0; cont < $(this).children().length - 1; cont++)
                    {
                        $($(this).children()[cont]).css({   'color': colorTextoFilaResaltada,
                                                            'background-color': colorFondoFilaResaltada});
                        alumnoActual.push($($(this).children()[cont]).text());
                    }//for
                    //Se elimina cualquier tabla de asignación de baterías de tests previa y se crea con las asignaciones para el alumno actual
                    $("#TA_contenedor_tabla").remove();
                    $("#contenedor_planes").append(CrearTablaAsignaciones(alumnoActual[0]));
                }//if
            }//OnClickFilaPF

            function CrearTablaAsignaciones(codigoAlumno)
            {
                //Contenedor de la tabla
                var divContenedorTabla = Factoria("div", [["id", "TA_contenedor_tabla"],["class", "col-7"]], "");

                //TABLA DE ASIGNACIONES
                var tabla = Factoria("table", [["id", "TA_tabla"]], "");
                    var fila = Factoria("tr", [["id", "TA_fila_encabezados"]], "");
                    fila.appendChild(Factoria("th", [["id", "TA_col_enc_codigo"],           ["class", "TA_col_enc"]], ""));
                    fila.appendChild(Factoria("th", [["id", "TA_col_enc_nombre"],           ["class", "TA_col_enc"]], "NOMBRE"));
                    fila.appendChild(Factoria("th", [["id", "TA_col_enc_descripcion"],      ["class", "TA_col_enc"]], "DESCRIPCIÓN"));
                    fila.appendChild(Factoria("th", [["id", "TA_col_enc_fechaAsignacion"],  ["class", "TA_col_enc"]], "ASIGNACIÓN"));
                    fila.appendChild(Factoria("th", [["id", "TA_col_enc_fechaInicio"],      ["class", "TA_col_enc"]], "INICIO"));
                    fila.appendChild(Factoria("th", [["id", "TA_col_enc_fechaFin"],         ["class", "TA_col_enc"]], "FIN"));
                    fila.appendChild(Factoria("th", [["id", "TA_col_enc_nota"],             ["class", "TA_col_enc"]], "NOTA"));
                    fila.appendChild(Factoria("th", [["id", "TA_col_enc_ejecucion"],        ["class", "TA_col_enc"]], ""));
                    fila.appendChild(Factoria("th", [["id", "TA_col_enc_btn_retirar"],      ["class", "TA_col_enc"]], ""));
                tabla.appendChild(fila);
                divContenedorTabla.appendChild(tabla);

                if (codigoAlumno != -1)
                {
                    //Se pretende presentar todas las baterías de tests asignadas al alumno
                    var op = "OBTENER_ASIGNACIONES_ALUMNO";
                    var param = ['i', codigoAlumno];
         
                    $.ajax({
                        method: "POST",
                        url: pathPHP + "MediosController.php",
                        data:   {   operacion: op,
                                    parametros: param
                                },
                        success: function(respuesta)
                                {
                                    //Extracción de los datos del JSON de respuesta en un array
                                    var asignacionesExistentes = JSON.parse(respuesta);
                                    //Cargar la tabla de asignaciones para el alumno
                                    asignacionesExistentes.forEach(function(registro)
                                    {
                                        //Se crea una fila en la tabla de asignaciones con los datos de las baterías de tests
                                        var tr = Factoria("tr", [["class", "TA_fila_registro_bateria"]], "");
                                    
                                        tr.addEventListener("click", OnClickFilaTA);
                                        //ID
                                        tr.appendChild(Factoria("td", [["class", "TA_col TA_col_codigo"]], registro["BT_CODE"]));
                                        //DENOMINACIÓN
                                        tr.appendChild(Factoria("td", [["class", "TA_col TA_col_nombre"]], registro["BT_DENOMINACION"]));
                                        //DESCRIPCIÓN
                                        tr.appendChild(Factoria("td", [["class", "TA_col TA_col_descripcion"]], registro["BT_DESCRIPCION"]));
                                        //FECHA DE ASIGNACIÓN
                                        tr.appendChild(Factoria("td", [["class", "TA_col TA_col_fechaAsignacion"]], registro["FECHA_ASIGNACION"]));
                                        //FECHA DE INICIO DE EJECUCIÓN
                                        if (registro["FECHA_INICIO"] == "0000-00-00 00:00:00")
                                        {
                                            tr.appendChild(Factoria("td", [["class", "TA_col TA_col_fechaInicio"]], ""));
                                        }//if
                                        else
                                        {
                                            tr.appendChild(Factoria("td", [["class", "TA_col TA_col_fechaInicio"]], registro["FECHA_INICIO"]));
                                        }//else
                                        //FECHA DE FINALIZACIÓN DE LA EJECUCIÓN
                                        if (registro["FECHA_FIN"] == "0000-00-00 00:00:00")
                                        {
                                            tr.appendChild(Factoria("td", [["class", "TA_col TA_col_fechaFin"]], ""));
                                        }//if
                                        else
                                        {
                                            tr.appendChild(Factoria("td", [["class", "TA_col TA_col_fechaFin"]], registro["FECHA_FIN"]));
                                        }//else
                                        //CALIFICACIÓN FINAL
                                        if (registro["CALIFICACION"] == null)
                                        {
                                            tr.appendChild(Factoria("td", [["class", "TA_col TA_col_nota"]], ""));
                                        }//if
                                        else
                                        {
                                            tr.appendChild(Factoria("td", [["class", "TA_col TA_col_nota"]], registro["CALIFICACION"]));
                                        }//else
                                        //EJECUCIÓN
                                        tr.appendChild(Factoria("td", [["class", "TA_col TA_col_ejecucion"]], registro["EJECUCION"]));
                                        //BOTÓN DE RETIRAR ASIGNACIÓN
                                        var td = tr.appendChild(Factoria("td", [["class", "TA_col TA_col_btn_retirar"]], ""));
                                            botonRetirarAsignacion = Factoria("i",  [["class", "fas fa-angle-double-left fa-2x boton_retirar_asignacion"]], "");
                                            botonRetirarAsignacion.addEventListener("click", function(e){OnClickRetirarAsignacion(e)});   
                                        td.appendChild(botonRetirarAsignacion);

                                        if ((registro["FECHA_INICIO"] == "0000-00-00 00:00:00")||(modoPlanes == "NAVEGACIÓN"))
                                        {
                                            $(botonRetirarAsignacion).css("display", "none");
                                        }//if
                                        
                                        tabla.append(tr);
                                    });   
                                },
                        error: function(jqxhr, status, exception)
                                {
                                    alert('Exception:', exception);
                                }
                        });
                }//if

                return divContenedorTabla;
            }//CrearTablaAsignaciones

            function OnClickFilaTA()
            {
                //
            }//OnClickFilaTA

            function OnClickRetirarAsignacion(e)
            {
                //Se obtiene el código de la batería de test a desasignar
                var bateriaARetirar = $($(e.target).parent().parent().children()[0]).text();
                /*
                    Se solicita permiso para eliminar la asignación.
                    Si ya se ha iniciado la ejecución de la batería no se permite su retirada
                    Si se permite, entonces se pide confirmación de la retirada al usuario
                    Finalmente si todo es favorable, se retira
                */
               Permiso("PLAN", "", bateriaARetirar, e.target, null);
            }//OnClickRetirarAsignacion            
});