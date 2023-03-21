import {Component, OnInit, ViewChild} from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Empresa } from '../empresas/empresa.model';
import { Producto } from '../productos/producto.model';
import { MatHorizontalStepper, MatStep } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import localeEsBo from '@angular/common/locales/es-BO';
import { registerLocaleData } from '@angular/common';
import { ValidatePorcentaje } from '../validators/custom.validators';

/**
 * @title Stepper overview
 */
@Component({
  selector: 'app-addcotizacion',
  templateUrl: 'addcotizacion.component.html',
  styleUrls: ['cotizacion.component.css'],
  
})
export class AddCotizacionComponent implements OnInit,OnChanges {
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  step1Completed= false;
  step2Completed= false;
  valid = false;
  isLinear = true;
  empresa:Empresa;
  modificacionEncargado:Boolean = false;
  modificacionDatos:Boolean = false;
  modificacionDiasEntrega:Boolean = false;
  modificacionAdelanto:Boolean = false;
  producto = [];
  total:number;
  totalCompra:number;
  notas:String = '';
  IVAVenta:number
  ITVenta:number
  IVACompra:number
  impuestoFacturaIVA:number
  creditoFiscal:number
  utilidad:number
  facturaVenta:boolean 
  adelantoModificado:number;
  diasEntregaModificado:number;
  encargadoModificado:string; 
  cotizacion = {accion: 'cotizacion'};
  notasFormControl = new FormControl([Validators.required]);
  adelantoFormControl = new FormControl('',[Validators.required, ValidatePorcentaje]);
  diasFormControl = new FormControl([Validators.required]);
  encargadoFormControl = new FormControl([Validators.required]);  constructor(private http: HttpClient,private router: Router) { }

  cotizar(){
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
    console.log('La empresa es:',this.empresa,'Los productos son:',this.producto,'La nota es:',this.notas,'El total es:',this.total, 'La compra es:', this.totalCompra)
    var pipe = new DatePipe('es-BO'); // Use your own locale
    var now = Date.now()- 4*60*60*1000;
    var date = new Date()
    const myFormattedDate = pipe.transform(now, 'yyMM');
    console.log(date)
  var cotizacion = {
    empresa: this.empresa,
    cotproductos:{productos:this.producto,
                  id: 'TC-COT-'+myFormattedDate+'-'+this.empresa.cotizacion.length,
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
                  creado:date
                },
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

    this.http.post('/cotizaciones', cotizacion, options)
    .subscribe(
    data => {   
      this.router.navigateByUrl("/agregarproducto", {skipLocationChange: true}).then(()=>
      this.router.navigate(['/agregarcotizacion']));
   
  },
    error => console.error(error)
  )

 
}
  onNotify(event){
    this.empresa = event
    this.step1Completed = true;
    console.log("Empresa:",this.empresa)
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
  onValid(event){
   this.valid=event;
   console.log(event)
   if(this.valid === false){
     this.step1Completed= true
   }
   else{this.step1Completed = false}
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


  ngOnInit() {

    
  }
  ngOnChanges(){
    console.log('cambio')
  }
}