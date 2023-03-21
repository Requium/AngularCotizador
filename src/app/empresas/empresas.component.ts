import { HttpClient } from '@angular/common/http';
import { Component, OnInit,  ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';



@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  // @Input() group: FormGroup ;
  @Input() accion;
  @Output() clientForm = new EventEmitter<any>();
  @Output() validForm = new EventEmitter<any>();
  @Output() notaClick = new EventEmitter<any>();
  dataEmpresas;
  busqueda:string;
  EmpresaGroup: FormGroup;
  selectedEmpresa:any = {}
  selected:any;
  stateCtrl: FormControl;
  filteredClientes: Observable<any>;
  private autocompleteNoResults:boolean = false;
  clientes: any = [];

  constructor(private cd: ChangeDetectorRef, private _formBuilder: FormBuilder, private http:HttpClient) {
    this.stateCtrl = new FormControl();
    this.filteredClientes = this.stateCtrl.valueChanges
      .pipe(
        map(cliente => cliente ? this.filterStates(cliente) : null)  
      );
   }

   onValid(event){
     this.validForm.emit(event);
   }
   onNotaClick(event){
     this.notaClick.emit(event);
     console.log('Nota Agregada')
   }

  filterStates(name: string) {
    if (name.length >=2){
      console.log(' es:', name)
      this.http.get('/empresa/'+name)
      .subscribe(
        data => {
          console.log(data)
          this.clientes = data 
        })
      console.log(this.clientes);
  
        return this.clientes.filter(cliente =>
          cliente.nombre.toLowerCase().indexOf(name.toLowerCase()) > -1)}
          else{
            this.selectedEmpresa.accion = undefined  
          }
      }

      mostrarEmpresas(){
        console.log(this.busqueda);
        this.dataEmpresas = undefined
        if (!this.busqueda) {
          this.busqueda = ''
        }
        this.http.get('/empresa/'+this.busqueda)
        .subscribe (
          data => {
            console.log(data)
            this.dataEmpresas = data
          }
        )
    
      }
  selectEmpresa(cliente) {
    this.selectedEmpresa = cliente;
    this.selected = 'true';
    this.clientForm.emit(cliente);
    if(this.accion){
      this.selectedEmpresa.accion = this.accion

      console.log(this.selectedEmpresa)
    }
  }

  ngOnInit() {
    console.log('Que accion se va a tomar?',this.accion)
    console.log(this.selectedEmpresa)
    this.EmpresaGroup = new FormGroup({
      validEmpresa: new FormControl()
    });
       
    
    console.log(this.filteredClientes)
 

  }
}