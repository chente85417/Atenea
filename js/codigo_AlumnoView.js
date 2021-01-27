/////////////////////////////////////////////////////////////////////////////////////////////////
//                Archivo de implementación de la página del usuario Alumno                    //
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

    //Alumno en curso obtenido a través de la variable de sesión
    let alumnoActual = $("#alumno_conectado").val();

    bateriaActual = new Array();

    //Objeto con las respuestas seleccionadas de la batería en ejecución
    let respuestas_seleccionadas = new Object();
    //Objeto con las respuestas correctas para la batería en ejecución
    let respuestas_correctas = new Object();

    //Fecha y hora de inicio de ejecución
    let fechaInicio = "";

    //Objeto para controlar la resolución del dispositivo
    const smartphone = matchMedia('(max-width: 360px)');

    //En la carga de la página se ordena la inicialización de sus contenidos
    Inicializar(); 

    /////////////////////////////////////////////////////////////
    //                FUNCIONES Y OPERACIONES                  //
    /////////////////////////////////////////////////////////////
    function Inicializar()
    {
        InsertarDatosUsuario(alumnoActual);
        CrearTablaPlanFormacion(alumnoActual);
    }//Inicializar

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
                            $("#PF_nombre").text(datosUsuario[0]["USR_NOMBRE"] + " " + datosUsuario[0]["USR_APELLIDOS"]);
                        }//if
                    },
            error: function(jqxhr, status, exception)
                    {
                        alert('Exception:', exception);
                    }
            });
    }//InsertarDatosUsuario

    function CrearTablaPlanFormacion(codigoAlumno)
    {
        //Contenedor de la tabla
        var divContenedorTabla = Factoria("div", [["id", "PFA_contenedor_tabla"]], "");

        //Encabezado de la tabla de asignaciones
        var encabezado = Factoria("h3", [["id", "PFA_encabezado_tabla"]], "TESTS ASIGNADOS");
        divContenedorTabla.appendChild(encabezado);

        //TABLA DE ASIGNACIONES
        var tabla = Factoria("table", [["id", "PFA_tabla"]], "");
            var fila = Factoria("tr", [["id", "PFA_fila_encabezados"]], "");
            fila.appendChild(Factoria("th", [["id", "PFA_col_enc_codigo"]], ""));
            fila.appendChild(Factoria("th", [["id", "PFA_col_enc_nombre"]], "TÍTULO"));
            fila.appendChild(Factoria("th", [["id", "PFA_col_enc_fechaAsignacion"]], "ASIGNACIÓN"));
            fila.appendChild(Factoria("th", [["id", "PFA_col_enc_fechaInicio"]], "FECHA INICIO"));
            fila.appendChild(Factoria("th", [["id", "PFA_col_enc_fechaFin"]], "FECHA FIN"));
            fila.appendChild(Factoria("th", [["id", "PFA_col_enc_nota"]], "NOTA"));
            fila.appendChild(Factoria("th", [["id", "PFA_col_enc_ejecucion"]], ""));
            fila.appendChild(Factoria("th", [["id", "PFA_col_enc_btn_ejecutar"]], ""));
            fila.appendChild(Factoria("th", [["id", "PFA_col_enc_btn_reset"]], ""));
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
                                var tr = Factoria("tr", [["class", "PFA_fila_registro_bateria"]], "");
                            
                                tr.addEventListener("click", OnClickFilaPFA);
                                //ID
                                tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_codigo"]], registro["BT_CODE"]));
                                //DENOMINACIÓN
                                tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_nombre"]], registro["BT_DENOMINACION"]));
                                //FECHA DE ASIGNACIÓN
                                tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_fechaAsignacion"]], registro["FECHA_ASIGNACION"]));
                                //FECHA DE INICIO DE EJECUCIÓN
                                if ((registro["FECHA_INICIO"] == null)||(registro["FECHA_INICIO"] == "0000-00-00 00:00:00"))
                                {
                                    tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_fechaInicio"]], ""));
                                }//if
                                else
                                {
                                    tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_fechaInicio"]], registro["FECHA_INICIO"]));
                                }//else
                                //FECHA DE FINALIZACIÓN DE LA EJECUCIÓN
                                if ((registro["FECHA_FIN"] == null)||(registro["FECHA_FIN"] == "0000-00-00 00:00:00"))
                                {
                                    tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_fechaFin"]], ""));
                                }//if
                                else
                                {
                                    tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_fechaFin"]], registro["FECHA_FIN"]));
                                }//else
                                //CALIFICACIÓN FINAL
                                if (registro["CALIFICACION"] == null)
                                {
                                    tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_nota"]], ""));
                                }//if
                                else
                                {
                                    tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_nota"]], registro["CALIFICACION"]));
                                }//else
                                //ESTADO DE LA EJECUCIÓN
                                tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_ejecucion"]], registro["EJECUCION"]));
                                //BOTÓN DE EJECUTAR
                                var td = tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_btn_ejecutar"]], ""));
                                    botonEjecutar = Factoria("i",  [["class", "fas fa-play PFA_boton_ejecutar"]], "");
                                    botonEjecutar.addEventListener("click", function(e){OnClickEjecutar(e);});     
                                    td.appendChild(botonEjecutar);
                                if (registro["FECHA_FIN"] == "0000-00-00 00:00:00")
                                {
                                    $(botonEjecutar).css("filter", "grayscale(0%)");
                                }//if
                                else
                                {
                                    $(botonEjecutar).css("filter", "grayscale(100%)");
                                }//else
                                //BOTÓN DE RESET
                                td = tr.appendChild(Factoria("td", [["class", "PFA_col PFA_col_btn_reset"]], ""));
                                    botonReset = Factoria("i",  [["class", "fas fa-undo PFA_boton_reset"]], "");
                                    botonReset.addEventListener("click", function(e){OnClickReset(e);});     
                                    td.appendChild(botonReset);
                                if (registro["FECHA_INICIO"] == "0000-00-00 00:00:00")
                                {
                                    $(botonReset).css("filter", "grayscale(100%)");
                                }//if
                                else
                                {
                                    $(botonReset).css("filter", "grayscale(0%)");
                                }//else

                                $(tabla).append(tr);
                            });

                            $("#seccion_planes").append(divContenedorTabla);

                            //La columna del estado de ejecución del alumno no se muestra
                            $("#PFA_col_enc_ejecucion").css("display", "none");
                            $(".PFA_col_ejecucion").css("display", "none");

                            return divContenedorTabla;
                        },
                error: function(jqxhr, status, exception)
                        {
                            alert('Exception:', exception);
                        }
                });
        }//if
    }//CrearTablaAsignaciones

    function SeleccionarFilaTabla(tabla, campos)
    {
        switch (tabla)
        {
            case "plan":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#PFA_tabla td').css({    'color': colorTextoFilaNormal,
                                                'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    bateriaActual = [];

                    for (let cont = 0; cont < campos.length - 2; cont++)
                    {
                        //Se resalta la fila seleccionada
                        $(campos[cont]).css({   'color': colorTextoFilaResaltada,
                                                'background-color': colorFondoFilaResaltada});
                        bateriaActual.push($(campos[cont]).text());
                    }//for
                    break;
                }
        }//switch
    }//SeleccionarFilaTabla

    function SeleccionarFilaTablaCodigo(tabla, codigo)
    {
        switch (tabla)
        {
            case "plan":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#PFA_tabla td').css({    'color': colorTextoFilaNormal,
                                                'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la fila seleccionada
                    bateriaActual = [];

                    var coleccion = $("#PFA_tabla tr");
                    for (let cont = 1; cont < coleccion.length; cont++)
                    {
                        if (coleccion[cont].children[0].innerText == codigo)
                        {
                            for (let celdas = 0; celdas < coleccion[cont].children.length - 2; celdas++)
                            {
                                //Se resalta la fila seleccionada
                                $(coleccion[cont].children[celdas]).css({   'color': colorTextoFilaResaltada,
                                                                            'background-color': colorFondoFilaResaltada});
                                bateriaActual.push($(coleccion[cont].children[celdas]).text());
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
            case "plan":
                {
                    //Se resetea el color de las filas de la tabla para eliminar cualquier selección existente
                    $('#PFA_tabla td').css({    'color': colorTextoFilaNormal,
                                                'background-color': colorFondoFilaNormal});
                    //Se cargan los datos de la marca seleccionada
                    bateriaActual = [];

                    var coleccion = $("#PFA_tabla tr");
                    for (let cont = 0; cont < coleccion[pos].children.length - 2; cont++)
                    {
                        //Se resalta la fila seleccionada
                        $(coleccion[pos].children[cont]).css({  'color': colorTextoFilaResaltada,
                                                                'background-color': colorFondoFilaResaltada});
                        bateriaActual.push($(coleccion[pos].children[cont]).text());
                    }//for
                    break;
                }
        }//switch        
    }//SeleccionarFilaTablaPosicion

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

    function CrearTest(codigo)
    {
        //OBTENCIÓN DE LOS DATOS DEL TEST
        var op = "FILTRAR_CONTENIDO_TEST";
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
                        var datos = JSON.parse(respuesta);
                                        
                        //Contenedor del test
                        var divContenedorTest = Factoria("div", [["id", "TS_contenedor_test"]], "");

                        //Código oculto del test
                        var inputCod = Factoria("input", [["type", "hidden"],["class", "TS_codigo"]], codigo);
                        divContenedorTest.appendChild(inputCod);

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
                                                                medioContenido = Factoria("p", [["class", "TS_medio_texto"],
                                                                                                ["id", "TS_medio_texto"]], elemento["MD_VALOR"]);
                                                                break;
                                                            }
                                                        case "IMAGEN":
                                                            {
                                                                medioContenido = Factoria("img", [  ["src", "../media/Imagenes/" + elemento["MD_RUTA"]],
                                                                                                    ["class", "foto TS_medio_imagen"],
                                                                                                    ["id", "TS_visor_imagen_card"],
                                                                                                    ["alt", ""]], "");                                                                    
                                                                break;
                                                            }
                                                        case "VIDEO":
                                                            {
                                                                medioContenido = Factoria("video", [["src", "../media/Videos/" + elemento["MD_RUTA"]],
                                                                                                    ["controls", "true"],
                                                                                                    ["preload", "metadata"],
                                                                                                    ["class", "foto TS_medio_video"],
                                                                                                    ["id", "TS_visor_video_card"],
                                                                                                    ["alt", ""]], "");
                                                                break;
                                                            }
                                                        case "AUDIO":
                                                            {
                                                                medioContenido = Factoria("audio", [["src", "../media/Audio/" + elemento["MD_RUTA"]],
                                                                                                    ["controls", "true"],
                                                                                                    ["class", "TS_medio_audio"],
                                                                                                    ["id", "TS_audio_player"],
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
                            var divContenedorOpcionesTest = Factoria("div", [["id", "TS_contenedor_opciones"],["class", "container-fluid TS_contenedor_opciones"]], "");
                            divContenedorTest.appendChild(divContenedorOpcionesTest);

                            divContenedorOpcionesTest.appendChild(InsertarElementosOpcion(1, datos[0]["TS_OP1_TXT"], datos[0]["TS_OP1_IMG"]));
                            divContenedorOpcionesTest.appendChild(InsertarElementosOpcion(2, datos[0]["TS_OP2_TXT"], datos[0]["TS_OP2_IMG"]));
                            divContenedorOpcionesTest.appendChild(InsertarElementosOpcion(3, datos[0]["TS_OP3_TXT"], datos[0]["TS_OP3_IMG"]));
                            divContenedorOpcionesTest.appendChild(InsertarElementosOpcion(4, datos[0]["TS_OP4_TXT"], datos[0]["TS_OP4_IMG"]));

                        $("#BTA_contenedor_bateria").append(divContenedorTest);

                        //Se marca la opción seleccionada por el alumno en la ejecución guardada
                        if (respuestas_seleccionadas[codigo] != undefined)
                        {
                            $("#TS_opcion" + respuestas_seleccionadas[codigo]).prop("checked", true);
                        }//if

                        //Se añade la respuesta correcta al objeto de respuestas
                        respuestas_correctas[codigo] = datos[0]["TS_RESPUESTA"];

                        return divContenedorTest;
                    },
            error: function(jqxhr, status, exception)
                    {
                        alert('Exception:', exception);
                    }
            });
    }//CrearTest

    function InsertarElementosOpcion(opcion, texto, imagen)
    {
        //Variables locales auxiliares
        var divContenedorOpcion, radioOpcion, pTextoOpcion;

        //CONTENEDOR DE LA OPCIÓN
        divContenedorOpcion = Factoria("div", [["id", "TS_contenedor_opcion" + opcion],["class", "row align-items-center TS_contenedor_opcion"]], "");
        
            //RADIO BUTTON DE LA OPCIÓN
            radioOpcion = Factoria("input", [["type", "radio"],
                                            ["id", "TS_opcion" + opcion],
                                            ["class", "TS_opcion"],
                                            ["name", "TS_opciones_test"],
                                            ["value", opcion]], "");
            radioOpcion.addEventListener("click", function(e){OnClickOpcion(e);});                       
            divContenedorOpcion.appendChild(radioOpcion);
            
            //TEXTO DE LA OPCIÓN 
            pTextoOpcion = Factoria("p", [["id", "TS_texto_opcion" + opcion],["class", "TS_texto_opcion col-8"]], texto);                                        
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
                                                                ["class", "TSE_imagen_opcion col-2"],
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

    /////////////////////////////////////////////////////////////
    //                MANEJADORES DE EVENTOS                   //
    /////////////////////////////////////////////////////////////

    function OnClickFilaPFA()
    {
        //
    }//OnClickFilaPFA

    function OnClickEjecutar(e)
    {
        if ($($(e.target).parent().siblings()[4]).text() != "")
        {
            return;
        }//if
        //Se actualiza la información sobre la batería en curso
        SeleccionarFilaTabla("plan", $(e.target).parent().siblings());
        //Se obtiene el mapa con las respuestas contestadas
        //La información viene desde la base de datos como una cadena en formato JSON que hay que parsear
        var resp = $(e.target).parent().prev().text();
        if (resp != "")
        {
            respuestas_seleccionadas = JSON.parse(resp);
        }//if
              
        //LIMPIEZA DE LA PANTALLA
        //Eliminación de la tabla de planes de formación del alumno
        $("#PFA_contenedor_tabla").remove();
        //CREACIÓN DE LA BATERÍA DE TESTS
        //Contenedor de la batería
        var divContenedorBateria = Factoria("div", [["id", "BTA_contenedor_bateria"],["class", "container-fluid"]], "");
        //ÁREA DE INFORMACIÓN
        var divContenedorInfoBateria = Factoria("div", [["id", "BTA_contenedor_info_bateria"],["class", "row"]], "");
            //Diferente disposición dependiendo de la resolución del dispositivo
            if (smartphone.matches)
            {
                //Nombre de la batería e información sobre la misma
                var pBateriaInfo = Factoria("p", [["id", "BTA_info"],["class", "col-12"]], "");
                divContenedorInfoBateria.appendChild(pBateriaInfo);
                //var divContFila = Factoria("div", [["class", "row"]], "");
                    //Estado de avance en la ejecución
                    var divContenedorEstadoEjecución = Factoria("div", [["id", "BTA_contenedor_estado_ejecucion"],["class", "col-6 container-fluid"]], "");
                        //Contador de los test respondidos
                        var pTestsRespondidos = Factoria("p", [["id", "BTA_tests_respondidos"],["class", "row col-12"]], "");
                        divContenedorEstadoEjecución.appendChild(pTestsRespondidos);
                        //Barra de progreso
                        var divContenedorBarraProgreso = Factoria("div", [["id", "BTA_contenedor_barra_progreso"],["class", "progress col-12"]], "");
                            var divBarraProgreso = Factoria("div", [["id", "BTA_barra_progreso"],
                                                                    ["class", "progress-bar bg-success"],
                                                                    ["role", "progressbar"],
                                                                    ["style", "width: 0%"],
                                                                    ["aria-valuenow", "0"],
                                                                    ["aria-valuemin", "0"],
                                                                    ["aria-valuemax", "100"]], "");
                            divContenedorBarraProgreso.appendChild(divBarraProgreso);
                        divContenedorEstadoEjecución.appendChild(divContenedorBarraProgreso);
                    divContenedorInfoBateria.appendChild(divContenedorEstadoEjecución);
                    //Botón para detener la ejecución
                    var divContenedorBotonDetener = Factoria("div",  [["id", "BTA_contenedor_btn_detener"],["class", "col-6 container-fluid"]], "");
                        var divBotonDetener = Factoria("div", [["id", "BTA_btn_detener"],["class", "row align-items-center"]], "");
                        divBotonDetener.addEventListener("click", function(e){OnClickDetener(e);});
                            //Icono
                            var iconoDetener = Factoria("i", [["id", "BTA_icono_detener"],["class", "fas fa-save col-3"]], "");
                            divBotonDetener.appendChild(iconoDetener);
                            //Texto del botón
                            var pTextoBoton = Factoria("p", [["id", "BTA_texto_boton_detener"],["class", "col-9"]], "Finalizar y guardar");
                            divBotonDetener.appendChild(pTextoBoton);
                            divContenedorBotonDetener.appendChild(divBotonDetener);
                divContenedorInfoBateria.appendChild(divContenedorBotonDetener);
            }//if
            else
            {
                //Nombre de la batería e información sobre la misma
                var pBateriaInfo = Factoria("p", [["id", "BTA_info"],["class", "col-8"]], "");
                divContenedorInfoBateria.appendChild(pBateriaInfo);
                //Estado de avance en la ejecución
                var divContenedorEstadoEjecución = Factoria("div", [["id", "BTA_contenedor_estado_ejecucion"],["class", "col-2 container-fluid"]], "");
                    //Contador de los test respondidos
                    var pTestsRespondidos = Factoria("p", [["id", "BTA_tests_respondidos"],["class", "row col-12"]], "");
                    divContenedorEstadoEjecución.appendChild(pTestsRespondidos);
                    //Barra de progreso
                    var divContenedorBarraProgreso = Factoria("div", [["id", "BTA_contenedor_barra_progreso"],["class", "progress row col-12"]], "");
                        var divBarraProgreso = Factoria("div", [["id", "BTA_barra_progreso"],
                                                                ["class", "progress-bar bg-success"],
                                                                ["role", "progressbar"],
                                                                ["style", "width: 0%"],
                                                                ["aria-valuenow", "0"],
                                                                ["aria-valuemin", "0"],
                                                                ["aria-valuemax", "100"]], "");
                        divContenedorBarraProgreso.appendChild(divBarraProgreso);
                    divContenedorEstadoEjecución.appendChild(divContenedorBarraProgreso);
                divContenedorInfoBateria.appendChild(divContenedorEstadoEjecución);
                //Botón para detener la ejecución
                var divContenedorBotonDetener = Factoria("div",  [["id", "BTA_contenedor_btn_detener"],["class", "col-2 container-fluid"]], "");
                    var divBotonDetener = Factoria("div", [["id", "BTA_btn_detener"],["class", "row align-items-center"]], "");
                    divBotonDetener.addEventListener("click", function(e){OnClickDetener(e);});
                        //Icono
                        var iconoDetener = Factoria("i", [["id", "BTA_icono_detener"],["class", "fas fa-save fa-2x col-3"]], "");
                        divBotonDetener.appendChild(iconoDetener);
                        //Texto del botón
                        var pTextoBoton = Factoria("p", [["id", "BTA_texto_boton_detener"],["class", "col-9"]], "Finalizar y guardar");
                        divBotonDetener.appendChild(pTextoBoton);
                        divContenedorBotonDetener.appendChild(divBotonDetener);
                divContenedorInfoBateria.appendChild(divContenedorBotonDetener);
            }//else
        divContenedorBateria.appendChild(divContenedorInfoBateria);

        $("#seccion_planes").append(divContenedorBateria);

        //Se recorren todos los tests de la batería
        var op = "OBTENER_TESTS_BATERÍA";
        var param = ['i', bateriaActual[0]];

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
                        //Se completa la información sobre la batería de test
                        if (testsExistentes.length == 1)
                        {
                            $("#BTA_info").text("Título: " + bateriaActual[1] + "   (" + testsExistentes.length + " pregunta)");
                        }//if
                        else
                        {
                            $("#BTA_info").text("Título: " + bateriaActual[1] + "   (" + testsExistentes.length + " preguntas)");
                        }//else

                        $("#BTA_tests_respondidos").text("Respondidos: " + Object.keys(respuestas_seleccionadas).length + "/" + testsExistentes.length);
                        $("#BTA_barra_progreso").attr("aria-valuemax", testsExistentes.length);
                        $("#BTA_barra_progreso").attr("aria-valuenow", Object.keys(respuestas_seleccionadas).length);
                        var porcentajeCompletado = (Object.keys(respuestas_seleccionadas).length/testsExistentes.length)*100;
                        $("#BTA_barra_progreso").attr("style", "width: " + porcentajeCompletado + "%");
                        
                        //Cargar los tests
                        testsExistentes.forEach(function(registro)
                        {
                            CrearTest(registro["TS_CODE"]);
                        });

                        //Se actualiza la fecha y hora de inicio de ejecución
                        fechaInicio = ObtenerFechaHoraActual();
                    },
            error: function(jqxhr, status, exception)
                    {
                        alert('Exception:', exception);
                    }
            });

        
    }//OnClickEjecutar

    function OnClickReset(e)
    {
        if ($($(e.target).parent().siblings()[3]).text() == "")
        {
            return;
        }//if
        //Se actualiza la información sobre la batería en curso
        SeleccionarFilaTabla("plan", $(e.target).parent().siblings());
        //Se elimina cualquier ejecución guardada de la batería actual
        var op = "RESET_EJECUCIÓN";
        var param = ['sssiii',  "",
                                "",
                                "",
                                0,                    
                                alumnoActual,
                                bateriaActual[0]];

        $.ajax({
            method: "POST",
            url: pathPHP + "MediosController.php",
            data:   {   operacion: op,
                        parametros: param
                    },
            success: function(respuesta)
                    {
                        //Se actualiza la información sobre la fila de la tabla de los planes del alumno
                        $($(e.target).parent().siblings()[3]).text("");
                        $($(e.target).parent().siblings()[4]).text("");
                        $($(e.target).parent().siblings()[5]).text("0");
                        $($(e.target).parent().siblings()[6]).text("");

                        $(e.target).css("filter", "grayscale(0%)");
                        $(e.target).parent().prev().children("i").css("filter", "grayscale(100%)");

                        respuestas_seleccionadas = new Object();
                    },
            error: function(jqxhr, status, exception)
                    {
                        alert('Exception:', exception);
                    }
            });         
    }//OnClickReset

    function OnClickDetener(e)
    {
        //Se transforma el objeto javascript con las respuestas del alumno en una cadena que es el tipo de dato esperado en la base de datos
        var cadenaEjecuciones = JSON.stringify(respuestas_seleccionadas);
        //Se inicializa la variable que va a ir acumulando la nota
        var nota = 0;
        //SE CALCULA LA NOTA
        //Se obtienen todos los códigos de test que el alumno ha contestado
        var testsContestados = Object.keys(respuestas_seleccionadas);
        //Se recorren los códigos
        for (cont = 0; cont < testsContestados.length; ++cont)
        {
            //Se obtiene el código de cada test
            var test = testsContestados[cont];
            //Si la opción correcta para el test coincide con la seleccionada por el alumno se incrementa en uno la nota
            if (respuestas_correctas[test] == respuestas_seleccionadas[test])
            {
                ++nota;
            }//if
        }//for
 
        //Se guarda la ejecución en la base de datos
        var op = "ACTUALIZAR_EJECUCIÓN";
        var param, aux;
        //Se comprueba si la fecha de inicio es nula
        //Si es nula es porque esta es la primera ejecución, luego hay que almacenar la fecha y hora actuales
        if (bateriaActual[3] == "")
        {
            aux = 1;
            //Se comprueba si la batería está completa, en cuyo caso se ha de actualizar la fecha de finalización
            if (testsContestados.length == Object.keys(respuestas_seleccionadas).length)
            {
                param = ['sssiii',  fechaInicio,
                                    ObtenerFechaHoraActual(),
                                    cadenaEjecuciones,
                                    nota,                    
                                    alumnoActual,
                                    bateriaActual[0]];
            }//if
            else
            {
                param = ['ssiii',   fechaInicio,
                                    cadenaEjecuciones,
                                    nota,                    
                                    alumnoActual,
                                    bateriaActual[0]];
            }//else
        }//if
        else
        {
            aux = 0;
            //Se comprueba si la batería está completa, en cuyo caso se ha de actualizar la fecha de finalización
            if (testsContestados.length == Object.keys(respuestas_seleccionadas).length)
            {
                param = ['ssiii',   ObtenerFechaHoraActual(),
                                    cadenaEjecuciones,
                                    nota,                    
                                    alumnoActual,
                                    bateriaActual[0]];
            }//if
            else
            {
                param = ['siii',    cadenaEjecuciones,
                                    nota,                    
                                    alumnoActual,
                                    bateriaActual[0]];
            }//else
        }//else
        
        $.ajax({
            method: "POST",
            url: pathPHP + "MediosController.php",
            data:   {   operacion: op,
                        parametros: param,
                        dato_auxiliar: aux,
                    },
            success: function(respuesta)
                    {
                        //Se destruye la batería de test
                        $("#BTA_contenedor_bateria").remove();
                        //Se crea la tabla de los planes de formación del alumno
                        CrearTablaPlanFormacion(alumnoActual);
                    },
            error: function(jqxhr, status, exception)
                    {
                        alert('Exception:', exception);
                    }
            });  
    }//OnClickDetener

    function OnClickOpcion(e)
    {
        //Se obtiene la opción seleccionada
        var opcion = $(e.target).val();
        //Se obtiene el contenedor del test
        var contenedorTest = $(e.target).parent().parent().parent();
        //Se obtiene el código del test
        var test = $($(contenedorTest).children()[0]).text();
        //Se almacena la selección para el test en el objeto de respuestas seleccionadas
        respuestas_seleccionadas[test] = opcion;
        //Se actualiza el contador de ejecuciones
        var testsTotales = $("#BTA_barra_progreso").attr("aria-valuemax");
        $("#BTA_tests_respondidos").text("Respondidos: " + Object.keys(respuestas_seleccionadas).length + "/" + testsTotales);
        $("#BTA_barra_progreso").attr("aria-valuenow", Object.keys(respuestas_seleccionadas).length);
        var porcentajeCompletado = (Object.keys(respuestas_seleccionadas).length/testsTotales)*100;
        $("#BTA_barra_progreso").attr("style", "width: " + porcentajeCompletado + "%");      
    }//OnClickOpcion
});