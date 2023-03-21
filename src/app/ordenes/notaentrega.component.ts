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

/**
 * @title Stepper overview
 */
@Component({
  selector: 'app-enotaentrega',
  templateUrl: 'notaentrega.component.html',
  styleUrls: ['cotizacion.component.css'],
  
})

export class NotaEntregaComponent implements OnInit,OnChanges {
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  step1Completed= false;
  step2Completed= false;
  notaEntrega:any = {}
  valid = false;
  isLinear = true;
  nextButton2 = false;
  a = 0;
  total:number;
  notas:String;
  productos =[]
  EncargadoEntrega:Boolean;
  EncargadoRecepcion:Boolean;
  encargadoEntrega:String;
  encargadoRecepcion:String;
  notasFormControl = new FormControl([Validators.required])
  encargadoEntregaFormControl = new FormControl([Validators.required]);
  encargadoRecepcionFormControl = new FormControl([Validators.required]);
  constructor(private http: HttpClient,private router: Router) { }

  retroceder() {
    console.log('Retrocediendo')
    this.notaEntrega = {
      accion:'cotizacionEdit'
    }
  }

  generar(){
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
    console.log('La empresa es:',this.notaEntrega.cotizacionID,'La nota es:',this.notas,'El total es:',this.total)
    var pipe = new DatePipe('es-BO'); // Use your own locale
    const now = Date.now();
    const myFormattedDate = pipe.transform(now, 'yyMM');
    console.log(this.productos)
  var nota = {
    nombre: this.notaEntrega.empresa.nombre,
    Id: this.notaEntrega.cotizacionID,
    notaEntrega:{
      nota: this.notas,
      encargadoEntrega: this.encargadoEntrega,
      encargadoRecepcion: this.encargadoRecepcion,
      productos:this.productos
    },
    }
    this.http.post('/nota/imprimir', nota, options)
    .subscribe(
    data => {
    var blob = this.b64toBlob(data,'application/pdf',512)
    var blobUrl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = this.notaEntrega.cotizacionID + '\/' + this.notaEntrega.empresa.siglas + '\/ENTREGA';
    anchor.href = blobUrl;
    anchor.click();
   
  },
    error => console.error(error)
  )
  this.http.put('/nota',nota)
  .subscribe(
    data => {
      this.router.navigateByUrl("/agregarproducto", {skipLocationChange: true}).then(()=>
      this.router.navigate(['/modificarnotaentrega']));
    }
  )
  }

  onNotasForm(event){
      this.productos = event
      this.step2Completed = true

  }
  onEditNotas(event){
    console.log('Se esta editando')
    console.log('onEdit',event)
    console.log(typeof event)
    console.log(event[0])
    this.productos = event
    this.step1Completed = true
    
    for(var i=0;i < event.length;i++){
      // console.log(event[i].numeroserie)
      if (event[i].numeroserie !== ''){
        console.log('el numero de serie es:', event[i].numeroserie)
        this.a = this.a + 1; 
        console.log(this.a)
        if (this.a === event.length){
          console.log('true')
          this.step2Completed = true;
          this.nextButton2 = true;
        }
      }
    }
  }
  
  onValid(event){
   this.valid=event;
   console.log(event)
   if(this.valid === false){
     this.step1Completed= true
   }
   else{this.step1Completed = false}
  }
  onNotaClick(event){
    this.EncargadoRecepcion = false
    this.encargadoRecepcion = undefined
    this.EncargadoEntrega = false
    this.encargadoEntrega = undefined
    console.log('Hay q ver:',event)
    this.step1Completed=true
    this.notaEntrega = {
      empresa: event.empresa,
      cotizacionID: event.row,
      nota: event.nota,
      accion: 'notaEdit'
    }
    if(event.encargadoEntrega){
    this.encargadoEntrega = event.encargadoEntrega
    this.EncargadoEntrega = true
  }
  if(event.encargadoRecepcion){
    this.encargadoRecepcion = event.encargadoRecepcion
    this.EncargadoRecepcion = true
  }
    this.notas = event.nota
    setTimeout(()=>{this.stepper.next()},10) 
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
  
    this.notaEntrega = {
      accion:'notaEdit'
    }
  }
  ngOnChanges(){
    console.log('cambio')
  }
}