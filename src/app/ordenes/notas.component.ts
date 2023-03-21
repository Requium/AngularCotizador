import { LocalDataSource } from 'ng2-smart-table';
import { Nota } from './nota.model';
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Producto } from '../productos/producto.model';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../empresas/empresa.model';


@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['../productos/productos.component.css']
})
export class NotasComponent implements OnInit {
  @Input() notaEntrega
  @Output() notasForm = new EventEmitter<any>();
  @Output() editNotas = new EventEmitter<any>();
  loading:boolean = false
  selectedProducto: Producto;
  selected:any;
  total:number = 0;
  settings = {
    pager:{
      display:true,
      perPage:20
    },
    columns: {
      modelo: {
        title: 'Modelo',
        filter: false,
        class: 'tableColumn',
        width:'15%'
      },
      marca: {
        title: 'Marca',
        filter: false,
        class: 'tableColumn',
        width:'15%'
      },
      numeroserie: {
        title: 'Numero de Serie',
        filter: false,
        class: 'tableColumn',
        width:'50%'
      }
    },
    actions:{
      add: false,
      columnTitle: '',
      position: 'right'
    },
    edit:{
      editButtonContent:'Editar',
      saveButtonContent:'Guardar',
      cancelButtonContent:'Cancelar',
      confirmSave: true
    },
    delete:{
      deleteButtonContent:'Eliminar',
      confirmDelete: true
    }
  };
  data= []
  source = new LocalDataSource;
  
  constructor(private http:HttpClient) {
   }

  
onSave(event) { 
  // console.log('modificado');
  // console.log(event);
  event.confirm.resolve(event.newData);
//  console.log("data:",this.data)
//  console.log("source:",this.source)
 this.data=[]
 this.source.getAll().then(value => { 
  value.forEach(element => {
      this.data.push(element); 
  });;
}).then(()=> {

  this.notasForm.emit(this.data);

   this.editNotas.emit(this.data);  
  
})
   
  //  console.log("El total es:",this.total)
}

  ngOnInit() {
    this.loading = true
    console.log('La nota existe?',this.notaEntrega.accion)
    if (this.notaEntrega.accion === 'notaEdit') {
      var notae
      var nota
      var notaEdit = {
        empresa: this.notaEntrega.empresa.nombre,
        Id: this.notaEntrega.cotizacionID}
      console.log('iniciando20')
      console.log(this.notaEntrega.cotizacionID)
      this.http.post('/nota/edit',notaEdit)
        .subscribe(
          data => {
            console.log(data)
            notae = data
            for (var i = 0 ;i <notae.length; i++){
              nota = {
                modelo: notae[i].modelo,
                marca: notae[i].marca,
                numeroserie: notae[i].numeroserie
                }
                this.data.push(nota)
                console.log('la Nota editada seria:',this.data)
          }
          this.source = new LocalDataSource(this.data);
          this.loading = false
          this.notasForm.emit(this.data);  
  
      })
    }
    else {
    var productos
    var nota
    var notaAdd = {
      empresa: this.notaEntrega.empresa.nombre,
      Id: this.notaEntrega.cotizacionID}
    console.log('iniciando20')
    console.log(this.notaEntrega.cotizacionID)
    this.http.post('/nota/add',notaAdd)
      .subscribe(
        data => {
          productos = data
          for (var i = 0 ;i <productos.length; i++){
            console.log(productos[i].unidad)
            if (productos[i].cantidad > 1 && productos[i].unidad === 'pieza'){
              for(var j=0;j < productos[i].cantidad;j++){
                nota = {
                  modelo:productos[i].modelo,
                  marca: productos[i].marca,
                  numeroserie: ''
                }
                this.data.push(nota)
                console.log(this.data)
              }
            }
            else if (productos[i].unidad === 'piezaSN'){
              nota = {
                modelo:productos[i].cantidad + ' PIEZAS' + ' ' + productos[i].modelo,
                marca: productos[i].marca,
                numeroserie: '',
                }
                this.data.push(nota)
                console.log(this.data)
            }
            else if (productos[i].unidad === 'pieza'){
              nota = {
                modelo: productos[i].modelo,
                marca: productos[i].marca,
                numeroserie: '',
                }
                this.data.push(nota)
                console.log(this.data)
            }

            else {
              nota = {
                modelo:productos[i].cantidad + ' ' + productos[i].unidad.toUpperCase()  + ' ' + productos[i].modelo,
                marca: productos[i].marca,
                numeroserie: '',
                }
                this.data.push(nota)
                console.log(this.data)
            }
        }
        this.source = new LocalDataSource(this.data);
        this.loading = false
        this.notasForm.emit(this.data);  

    })
  }
  }
}