import { Observable } from 'rxjs';
import { Empresa } from './empresa.model';
import { AddImageService } from './../productos/addImagen.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Router} from "@angular/router";



@Component({
  selector: 'app-addempresas',
  templateUrl: './addempresas.component.html',
  styleUrls: ['./empresas.component.css'],
  
})
export class AddEmpresasComponent implements OnInit {
  @Input() empresa:Empresa;
  @Output() validForm = new EventEmitter<any>();
  edit;
  edited = false;
  clienteForm = new FormGroup({
    empresa: new FormControl('', [Validators.required]),
    encargado: new FormControl('', [Validators.required]),
    siglas: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    direccion: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    razonsocial: new FormControl('', [Validators.required]),
    nit: new FormControl('', [Validators.required])})
  loading: boolean = false;
  getErrorMessage() {
    return this.clienteForm.get("email").hasError('required') ? 'Tiene que ingresar Algo!' :
        this.clienteForm.get("email").hasError('email') ? 'No es un email valido' :
            '';
  }
  
  constructor(private http: HttpClient,private router: Router) { 
  }
  enableEdit(){
    this.clienteForm.enable();
    this.edited = true;
    this.validForm.emit(true)
  }
  save(){
    // this.clienteForm.disable();
    this.loading = true
    this.edited = false;
    this.validForm.emit(false)
    console.log('La empresa es:', this.empresa)
    this.http.post('/empresa', this.empresa)
        .subscribe(
        data => {
        this.loading = false;
        this.router.navigateByUrl("/agregarproducto", {skipLocationChange: true})
        .then(()=> this.router.navigate(['/agregarempresa']));},
        error => {
          this.loading = false;
          console.error(error)
        }
      )
 }
 update(){
 this.clienteForm.disable();
  this.edited = false;
  this.validForm.emit(false)
  var empresa:any = this.empresa
  console.log('La empresa es:', this.empresa)
  this.http.put('/empresa/'+empresa._id, this.empresa)
      .subscribe(
      data => {
        this.edited = false;
        this.validForm.emit(false)
        this.loading = false;

      //   this.router.navigateByUrl("/agregarproducto", {skipLocationChange: true}).then(()=>
      // this.router.navigate(['/modificarempresa']));
    },
      error => {
        this.loading = false;
        console.error(error)
      }
    )
}
  ngOnInit() {
   if(!this.empresa){
     this.empresa = new Empresa([],'','','','','',null,'',null)
     this.edit = false;
     this.clienteForm.enable();
   }
   else {
     this.edit = true;
     this.clienteForm.disable();
   }
   this.clienteForm.get("empresa").setValue(this.empresa.nombre);
   this.clienteForm.get("encargado").setValue(this.empresa.encargado);
   this.clienteForm.get("siglas").setValue(this.empresa.siglas);
   this.clienteForm.get("email").setValue(this.empresa.email);
   this.clienteForm.get("direccion").setValue(this.empresa.direccion);
   this.clienteForm.get("telefono").setValue(this.empresa.telefono);
   this.clienteForm.get("razonsocial").setValue(this.empresa.razonsocial);
   this.clienteForm.get("nit").setValue(this.empresa.nit);

  }

  
}
