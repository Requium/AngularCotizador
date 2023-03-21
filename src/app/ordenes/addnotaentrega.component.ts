import {Component, OnInit, ViewChild} from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatHorizontalStepper, MatStep } from '@angular/material';
import { Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import localeEsBo from '@angular/common/locales/es-BO';
import { registerLocaleData } from '@angular/common';

/**
 * @title Stepper overview
 */
@Component({
  selector: 'app-notaentrega',
  templateUrl: 'addnotaentrega.component.html',
  styleUrls: ['cotizacion.component.css'],
  
})
export class AddNotaEntregaComponent implements OnInit,OnChanges {
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  step1Completed= false;
  step2Completed= false;
  valid = false;
  isLinear = true;
  nextButton2 = false;
  notaEntrega:any = {}
  a = 0
  total:number;
  notas:String;
  productos =[]
  cotizacion = true;
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
     var nota = {
    nombre: this.notaEntrega.empresa.nombre,
    Id:this.notaEntrega.cotizacionID,
    notaEntrega:{
      nota: this.notas,
      encargadoEntrega: this.encargadoEntrega,
      encargadoRecepcion: this.encargadoRecepcion,
      productos:this.productos
    }
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

    this.router.navigateByUrl("/agregarproducto", {skipLocationChange: true}).then(()=>
    this.router.navigate(['/agregarnotaentrega']));

  },
  
    error => {
      console.error(error)
    }
    
  )
  this.http.post('/nota', nota, options)
  .subscribe(
    data => {
      this.router.navigateByUrl("/agregarproducto", {skipLocationChange: true}).then(()=>
      this.router.navigate(['/agregarnotaentrega']));
    }
  )
  }

  onNotasForm(event){
      console.log ('OnNotas',event.lenght)
      console.log('El emmit es:',event)

  }
  onEditNotas(event){
    console.log('Se esta editando')
    console.log('onEdit',event)
    console.log(typeof event)
    console.log(event[0])
    this.productos = event
    
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
    this.notaEntrega = {
      empresa: event.empresa,
      cotizacionID: event.row,
      nota: event.nota,
      accion: 'notaAdd'
    }
    this.step1Completed=true
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
    this.notaEntrega.accion = 'notaAdd'
    
  }
  ngOnChanges(){
    console.log('cambio')
  }
}