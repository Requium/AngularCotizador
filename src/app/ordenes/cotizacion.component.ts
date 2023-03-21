import { Component, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { registerLocaleData, DatePipe } from '@angular/common';
import localeEsBo from '@angular/common/locales/es-BO';
import { ValidatePorcentaje } from '../validators/custom.validators';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'es-BO'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  
})
export class CotizacionComponent implements OnInit {
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  buscarCotizaciones:Boolean = true;
  step1Completed:Boolean = false
  isLinear:Boolean = true
  cotizacion:any = {}
  modificacionEncargado:Boolean = false;
  modificacionDiasEntrega:Boolean = false;
  modificacionAdelanto:Boolean = false;
  valid:Boolean = false;
  step2Completed:Boolean = false;
  producto = []
  total:Number;
  totalCompra:Number;
  notas:String;
  IVAVenta:number
  ITVenta:number
  IVACompra:number
  impuestoFacturaIVA:number
  creditoFiscal:number
  utilidad:number
  facturaVenta:Boolean
  adelantoModificado:number;
  diasEntregaModificado:number;
  encargadoModificado:string;
  creado:any ={};
  notasFormControl = new FormControl([Validators.required]);
  adelantoFormControl = new FormControl('',[Validators.required, ValidatePorcentaje]);
  diasFormControl = new FormControl([Validators.required]);
  encargadoFormControl = new FormControl([Validators.required]);
  constructor(private http: HttpClient,private router: Router) { }
  
  cotizar(){
    if(this.modificacionEncargado === false){
      this.encargadoModificado = undefined
    }
    if(this.modificacionDiasEntrega === false){
      this.diasEntregaModificado = null
    } 
    if(this.modificacionAdelanto === false){
      this.adelantoModificado = null
    }
    const options: {
            headers?: HttpHeaders,
            observe?: 'body',
            params?: HttpParams,
            reportProgress?: boolean,
            responseType: 'text',
            withCredentials?: boolean
        } = {
             responseType: 'text'
        };
    registerLocaleData(localeEsBo);
    console.log('La empresa es:',this.cotizacion.empresa,'Los productos son:',this.producto,'La nota es:',this.notas,'El total es:',this.total, 'La compra es:',this.totalCompra,'Hay factura?',this.facturaVenta,'Testeo',this.adelantoModificado,this.diasEntregaModificado,this.adelantoModificado)
    var cotizacion = {
    empresa: this.cotizacion.empresa,
    cotproductos:{
                  productos:this.producto,
                  id: this.cotizacion.ID,
                  nota:this.notas,
                  encargadoModificado: this.encargadoModificado,
                  diasEntregaModificado: this.diasEntregaModificado,
                  adelantoModificado: this.adelantoModificado,
                  total:this.total,
                  totalCompra: this.totalCompra,
                  IVACompra: this.IVACompra,
                  IVAVenta: this.IVAVenta,
                  impuestoFacturaIVA: this.impuestoFacturaIVA,
                  ITVenta:this.ITVenta,
                  utilidad:this.utilidad,
                  creditoFiscal:this.creditoFiscal,
                  facturaVenta:this.facturaVenta,
                  creado:this.creado._d},
    }
    this.http.post('/cotizaciones/imprimir',cotizacion, options)
    .subscribe(
      data => {
        var blob = this.b64toBlob(data,'application/pdf',512)
      var blobUrl = URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.download = cotizacion.cotproductos.id+'\/'+cotizacion.empresa.siglas;
      anchor.href = blobUrl;
      anchor.click();
      },
      error => console.error(error)
    )
    this.http.put('/cotizaciones/'+ this.cotizacion._id,cotizacion)
    .subscribe(
    data => {
    this.router.navigateByUrl("/agregarempresa", {skipLocationChange: true}).then(()=>
    this.router.navigate(['/modificarcotizacion']));
  },
    error => console.error(error)
  )

}

retroceder() {
  console.log('Retrocediendo')
  this.cotizacion = {
    accion:'cotizacionEdit'
  }
  this.step2Completed = false
}
 
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
  
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
  
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
  
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      var byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
  
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  onNotaClick(event){
    this.modificacionEncargado = false;
    this.modificacionDiasEntrega = false
    this.modificacionAdelanto = false
    var datos
    this.step1Completed=true
    this.cotizacion = {
      empresa : event.empresa,
      ID: event.row,
      nota: event.nota,
      accion:'cotizacionEdit'
    }
    this.notas = event.nota;
    this.http.post('/cotizaciones/search', {empresa: event.empresa.nombre,Id:event.row})
    .subscribe(
      data => {
        datos = data
        this.cotizacion._id = datos._id
        this.encargadoModificado = datos.encargadoModificado;
        this.diasEntregaModificado = datos.diasEntregaModificado;
        this.adelantoModificado = datos.adelantoModificado;
        this.creado._d = datos.creado;
        this.creado.valid = true
        this.facturaVenta = datos.facturaVenta
        console.log(datos.facturaVenta,this.facturaVenta)
        if(this.encargadoModificado){
          this.modificacionEncargado = true
        }
        if(this.diasEntregaModificado){
          this.modificacionDiasEntrega = true
        }
        if(this.adelantoModificado){
          this.modificacionAdelanto = true
        }
      }
    )
    

  console.log('Se presiono y se mando:',this.cotizacion)
  console.log('El emit notas es:', event)
    setTimeout(()=>{
      this.stepper.next();
    },10) 
  }
  nuevaFecha(event){
    if (event.value !== null){
      this.creado._d = event.value._d;
      this.creado.valid = event.value._isValid}
    else{
      this.creado.valid = false
    }
    console.log(event);
    console.log(this.creado)
    
  }
  onProductosForm(event){
    this.producto = event.data;
    this.total = event.total;
    this.totalCompra = event.totalCompra;
    this.IVAVenta=event.IVAVenta;
    this.ITVenta=event.ITVenta;
    this.IVACompra=event.IVACompra;
    this.impuestoFacturaIVA=event.impuestoFacturaIva;
    this.creditoFiscal=event.creditoFiscal;
    this.utilidad=event.utilidad;
    this.facturaVenta=event.facturaVenta;
    
    console.log('El emmit es:',event)
    this.step2Completed = true;
    console.log("Productos:"+this.producto.length, this.producto)
  }

  
  ngOnInit() {
    this.cotizacion.accion = 'cotizacionEdit';

  }

}
