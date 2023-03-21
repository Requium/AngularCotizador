const pdfmaker = require('pdfmake');
const _  = require('lodash');
const format = require('date-format')
var mkdirp = require('mkdirp')
var pdfCot = (cotEmpresa,cotProducto,GrandTotal,numCot,nota,encargadoModificado,diasEntregaModificado,adelantoModificado,facturaVenta,creado,callback) => {
var nomEmpresa = cotEmpresa.nombre;
var nomEncargado = encargadoModificado || cotEmpresa.encargado;
var siglaEmpresa = cotEmpresa.siglas;
var dirEmpresa = cotEmpresa.direccion;
var telEmpresa = cotEmpresa.telefono;
var diasEntregaModificado = diasEntregaModificado || 20;
var adelantoModificado = adelantoModificado || 50;
var restanteAdelanto = 100 - adelantoModificado
var tipoDoc = 'COT';
var Obs = nota;
var Dia = new Date(creado) || new Date() - 4*60*60*1000;
var Fecha = format.asString('dd-MM-20yy', Dia);
var fonts = {
	Roboto: {
		normal: './public/fonts/Roboto-Regular.ttf',
		bold: './public/fonts/Roboto-Medium.ttf',
		italics: './public/fonts/Roboto-Italic.ttf',
		bolditalics: './public/fonts/Roboto-MediumItalic.ttf'
	}
};

var PdfPrinter = require('pdfmake/src/printer');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
var impuestosLey
//Generacion de tablas dinamicas
if (facturaVenta === true){
	impuestosLey = "*Todos los precios incluyen Impuestos de Ley"
}
else {
	impuestosLey = ""
}
var externalDataRetrievedFromServer = cotProducto
function buildTableBody(data, columns) {
    var body = [];
		var columnHeader = [];
			for (var i = 0; i <= (columns.length-1) ; i++)
			{
				columnHeader.push({text: columns[i],alignment:'center',fillColor:'orange',bold: true})
			}
			// console.log(data);
	body.push(columnHeader);
    data.forEach(function(row) {
        var dataRow = [];
        columns.forEach(function(column) {
						if (column === 'Imagen')			
						{ if (row.Imagen !== 'http://127.0.0.1:3000/'){
							var GImagen = row.Imagen.match(/:3000(.*)/);
							console.log(GImagen)
								if (fs.existsSync('.'+GImagen[1])) {
    					console.log('Found file');
							dataRow.push(
								{
									image: '.'+GImagen[1],
									fit:[100,80]
								}
							)
						}
						else{
							dataRow.push(
								{
									text:'',
									fit:[100,80]
								}
							)
						}
						} else {
							console.log('Not Found')
							dataRow.push(
								{
									text: ' ',
									fit:[100,80]
								}
							)
						}

							console.log(row[column].toString())
						}

						else{
							if (column === 'Descripcion'){
								dataRow.push(
									{
										text: row.Descripcion,
										fontSize:9
									}
								)
							}
							else {
							dataRow.push(row[column].toString());}
							// console.log(row[column]);
							// console.log(column)
						}
        })

        body.push(dataRow);
    });

    return body;
}
console.log('dias',diasEntregaModificado,'porcentaje',adelantoModificado)
function table(data, columns) {
	// console.log('data',data,'columns',columns)
    return {
        table: {
            headerRows: 1,
						widths: [ 'auto', '*', 100,'auto',45,'auto' ],
            body: buildTableBody(data, columns)
        }
    };
}


var docDefinition = {
	compress: false,
  header: {
    margin: [0,0,0,0],
    columns: [
        {
			image: './public/img/logo_header.png',
			headlineLevel:1,
            width: 613},
        {
            text:`\nTIPO: ${tipoDoc}
            CLIENTE: ${nomEmpresa}
			CITE: ${numCot}/${siglaEmpresa}`,
			headlineLevel:1,
            absolutePosition: {x: 420, y: 40},
            fontSize: 10,
            color: 'orange',
            bold: true
          }
  ]
},
footer : {
	margin: [0,0,0,0],
	columns: [
		{
			image: './public/img/footer_logo.png',
			width: 613,
			absolutePosition:{x: 0, y: 0},
			headlineLevel:1
			
			},
	]
},
	content:  [
	{text:`\nCOTIZACIÓN (${numCot}/${siglaEmpresa})`,
	 headlineLevel:1,
     alignment: 'center',
     bold: true,
     fontSize: 14 },
		'\n',
    '\n',
    {text: `Señores: ${nomEmpresa}
    Atención: ${nomEncargado}
    Dirección: ${dirEmpresa}
    Telefono: ${telEmpresa}
    Fecha: ${Fecha}
	Observación: ${Obs}`,
	headlineLevel:1,
    fontSize: 10},
		{
			text: '\nCotización:\n',
			bold: true,
			fontSize: 10
		},
		table(externalDataRetrievedFromServer, ['Item', 'Descripcion','Imagen','Cantidad','Precio Unitario Bs.','Total Bs.']),
		{ table: {
			headerRows: 1,
			widths: [482],
			body:[[{
				text:`Total Bs.:	${GrandTotal}`,
				alignment:'right',
				bold: true,
				headlineLevel:1
			}]]

		}},
		
		{
			text: impuestosLey + "\n*La forma de pago es " + adelantoModificado + "% con la orden de compra y "+ restanteAdelanto + "% a la entrega de los equipos\n*La entrega de equipos es de " + diasEntregaModificado + " días habiles despues de realizado el adelanto",
			fontSize:7,
			bold: true,
			headlineLevel:1
		},
	],
	pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
	
	   //  console.log(followingNodesOnPage.length === 0)
	   if(currentNode.startPosition.top + 30 > currentNode.startPosition.pageInnerHeight && currentNode.columns === undefined && currentNode.headlineLevel !== 1 && currentNode.table === undefined) {
		console.log(currentNode)
		   return true
		   
	   }
	 },

 pageSize: 'LETTER',
 pageMargins: [80, 140, 40, 80]
};
// console.log(docDefinition)
if (!fs.existsSync(`./public/pdfs/${nomEmpresa}`)){
mkdirp(`./public/pdfs/${nomEmpresa}`,function (err) {
	if (err)
	{console.log(err)}
	else
	{console.log('Todo Bien!')}
})}
var pdfDoc = printer.createPdfKitDocument(docDefinition);
// console.log('Contexto',pdfCot);
// pdfDoc.pipe(fs.createWriteStream(`./public/pdfs/${nomEmpresa}/${numCot}-${siglaEmpresa}.pdf`));
var chunks =[];
var result;
pdfDoc.on('data',function(chunk){
	chunks.push(chunk)
});

pdfDoc.on('end', function(){
	result = Buffer.concat(chunks);
	callback('data:application/pdf;base64,'+result.toString('base64'));
});
pdfDoc.end();
}

var pdfNota = (cotEmpresa,cotProducto,numCot,nota,encargadoRecepcion,callback) => {
	// console.log('Empezando');
	// console.log(cotEmpresa)
	// console.log(cotEmpresa.siglas)
var nomEmpresa = cotEmpresa.nombre;
var nomEncargado = encargadoRecepcion || cotEmpresa.encargado;
var siglaEmpresa = cotEmpresa.siglas;
var dirEmpresa = cotEmpresa.direccion;
var telEmpresa = cotEmpresa.telefono;
var tipoDoc = 'GAR';
var Obs = nota|| 'Nota de entrega '+numCot
var Fecha = format.asString('dd-MM-20yy',new Date());
var fonts = {
	Roboto: {
		normal: './public/fonts/Roboto-Regular.ttf',
		bold: './public/fonts/Roboto-Medium.ttf',
		italics: './public/fonts/Roboto-Italic.ttf',
		bolditalics: './public/fonts/Roboto-MediumItalic.ttf'
	}
};

var PdfPrinter = require('pdfmake/src/printer');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
//Generacion de tablas dinamicas

var externalDataRetrievedFromServer = cotProducto
function buildTableBody(data, columns) {
    var body = [];
		var columnHeader = [];
			for (var i = 0; i <= (columns.length-1) ; i++)
			{
				columnHeader
				.push({text: columns[i],alignment:'center',fillColor:'#F7931E',bold: true})
			}

    body.push(columnHeader);
    data.forEach(function(row) {
        var dataRow = [];

        columns.forEach(function(column) {
					  dataRow.push(row[column].toString());

        })

        body.push(dataRow);
    });

    return body;
		console.log('Body:',body);
}

function table(data, columns) {
    return {
        table: {
            headerRows: 1,
						widths: [ 'auto', '*', 'auto','auto' ],
            body: buildTableBody(data, columns)
        }
    };
}

var docDefinition = {
	compress: false,
  header: {
    margin: [0,0,0,0],
    columns: [
        {
            image: './public/img/logo_header.png',
            width: 613},
        {	
            text:`\nTIPO: ${tipoDoc}
            CLIENTE: ${nomEmpresa}
            REF: ${numCot}/${siglaEmpresa}`,
            absolutePosition: {x: 420, y: 40},
            fontSize: 10,
            color: 'orange',
            bold: true
          }
  ]
},
footer : {
	margin: [0,0,0,0],
	columns: [
		{
			image: './public/img/footer_logo.png',
			width: 613,
			}
	]
},
	content: [
    {text: `NOTA DE ENTREGA Y CONFORMIDAD(${numCot}/${siglaEmpresa})`,
     alignment: 'center',
     bold: true,
     fontSize: 14 },
		'\n',
    '\n',
    {text: `Señores: ${nomEmpresa}
    Atención: ${nomEncargado}
    Dirección: ${dirEmpresa}
    Telefono: ${telEmpresa}
    Fecha: ${Fecha}
    Observación: ${Obs}`,
    fontSize: 10},
		'\n',
		'\n',
		{text:'TERACOM garantiza por 6 meses calendario a partir de la fecha de compra, el funcionamiento de este producto contra cualquier defecto en los materiales y mano de obra empleados en su fabricación. Nuestra garantía incluye la reparación, reposición o cambio del producto y/o componentes sin cargo alguno para el cliente. Del cumplimiento de este certificado. TERACOM se compromete a entregar el producto en un lapso no mayor a 30 días contados a partir de la fecha de recepción del mismo en nuestros talleres de servicio. No resumirá responsabilidad alguna en caso de demora del servicio por causas de fuerza mayor. Para ser efectiva esta garantía, no podrán exigirse mayores requisitos que presentarla firmada por el establecimiento comercial donde se adquirió, de no contar con esta bastara la factura de compra.',
		alignment: 'justify',
		fontSize: 10
		},
		'\n',
		{text:'ESTA GARANTIA NO SERA VALIDA BAJO LAS SIGUIENTES CONDICIONES:',
		 fontSize: 12,
		 alignment: 'center',
		 bold: true
	 	},
	 	'\n',
		{ol:[
			{
				text: 'Cuando esta póliza manifestara claros signos de haber sido alterada en los datos originales consignados en ella.',
				fontSize: 10,
				alignment: 'justify'},
			{
				text: 'Cuando el uso, cuidado y operación del producto no se realice de acuerdo a las instrucciones contenidas en el manual de operación',
				fontSize: 10,
				alignment: 'justify'},
			{
				text: 'Cuando el producto haya sido usado fuera de su capacidad, maltrato,  golpeado,  expuesto a la humedad, molada por algún líquido o substancia corrosiva, así como por cualquier otra falla fisica atribuible al consumidor.',
				fontSize: 10,
				alignment: 'justify'},
			{
				text: 'Cuando el producto sea desarmado, modificado o reparado por personas no autorizados por TERACOM.',
				fontSize: 10,
				alignment: 'justify'},
			{
				text: 'Cuando la falla sea originada por el desgaste normal de las piezas debido al tiempo de uso, o fallas eléctricas presentadas en la red eléctrica del usuario, o la falla de ejecución de tierras en el producto recomendadas por el personal de TERACOM.',
				fontSize: 10,
				alignment: 'justify'},
			{
				text: 'Cuando el producto haya sido robado o hurtado o dañado por fallas eléctricas en la red, para lo cual no se siguió el procedimiento de aterramiento del equipo recomendado por el personal de TERACOM',
				fontSize: 10,
				alignment: 'justify'},
			{
				text: 'Ninguna otra garantía verbal o escrita diferente, expresada en el presente oficio no será reconocido por TERACOM.',
				fontSize: 10,
				alignment: 'justify',
				pageBreak: 'after'
			}
			],

		},
		{
			text: '\nANEXO:\n',
			bold: true,
			alignment: 'center',
			fontSize: 14,
			decoration: 'underline'
		},
		{
			text:'PRODUCTOS Y NUMEROS DE SERIE',
			bold: true,
			alignment: 'center',
			fontSize:14,
			decoration: 'underline'
		},
		'\n',
		'\n',
		table(externalDataRetrievedFromServer, ['Item', 'Descripcion','Numero de Serie','Marca'])

	],

 pageSize: 'LETTER',
 pageMargins: [80, 140, 40, 80]
};
console.log(docDefinition);
if (!fs.existsSync(`./public/pdfs/${nomEmpresa}`)){
mkdirp(`./public/pdfs/${nomEmpresa}`,function (err) {
	if (err)
	{console.log(err)}
	else
	{console.log('Todo Bien!')}
})}
var pdfDoc = printer.createPdfKitDocument(docDefinition);
console.log(pdfCot);
// pdfDoc.pipe(fs.createWriteStream(`./public/pdfs/${nomEmpresa}/${tipoDoc}-${numCot}-${siglaEmpresa}.pdf`));
// pdfDoc.end();
var chunks =[];
var result;
pdfDoc.on('data',function(chunk){
	chunks.push(chunk)
});

pdfDoc.on('end', function(){
	result = Buffer.concat(chunks);
	callback('data:application/pdf;base64,'+result.toString('base64'));
});
pdfDoc.end();
}
module.exports={
	pdfCot,
	pdfNota
}
