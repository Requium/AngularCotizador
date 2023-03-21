import { Component, OnInit, Input } from '@angular/core';
import { Empresa } from '../empresa.model';
import { LocalDataSource,ViewCell } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-buscador-empresas',
  templateUrl: './buscador-empresas.component.html',
  styleUrls: ['./buscador-empresas.component.css']
})
export class BuscadorEmpresasComponent implements OnInit {
  customNumber: number;
  empresa:Empresa;
  @Input() empresas;
  source: LocalDataSource;
  data = []
  constructor(private http:HttpClient) { }

  settings = {
    pager:{
      display:true,
      perPage:20
    },
    columns: {
      nombre: {
        title: 'Nombre',
        filter: false,
        class: 'tableColumn',
        width:'10%'
      },
      encargado: {
        title: 'Encargado',
        filter: false,
        class: 'tableColumn',
        width:'10%'
      },
      siglas:{
        title:'Siglas',
        filter: false,
        class: 'tableColumn',
        width:'10%'
      },
      email:{
        title:'Correo',
        type: 'html',
        filter: false,
        class:'tableColumn',
        width:'10%'
      },
      direccion:{
        title:'Direccion',
        filter: false,
        editor:{
          type:'textarea',
        },
        class:'tableColumn',
        width:'27%'
      },
      telefono:{
        title:'Telefono',
        filter: false,
        class:'tableColumn',
        width:'10%'
  
      },
      razonsocial:{
        title:'Razon Social',
        filter: false,
        class:'tableColumn',
        type: 'html',
        width:'10%'
  
      },
      nit:{
        title:'Nit',
        filter: false,
        class:'tableColumn',
        width:'10%'
  
      }
      
      
  },
    actions: {
      add:false,
      columnTitle:'',
      position:'right'
    },
    delete:{
    deleteButtonContent:'Eliminar',
    confirmDelete:true
    },
    edit:{
      editButtonContent:'Editar',
      saveButtonContent:'Guardar',
      cancelButtonContent:'Cancelar',
      confirmSave: true
    }
    
  }
  onSearch(query: string ) {
    console.log(query)
    if(query.length <1){
      this.source.setFilter([]);}
      else{
    this.source.setFilter([
      // fields we want to inclue in the searcha
      {
        field: 'nombre',
        search: query,
      },
      {
        field: 'encargado',
        search: query,
      },
      {
        field: 'siglas',
        search: query,
      },
      {
        field: 'email',
        search: query,
      },
      {
        field: 'telefono',
        search: query,
      },
      {
        field: 'razonsocial',
        search: query,
      },
      {
        field: 'direccion',
        search: query,
      },
      {
        field: 'telefono',
        search: query,
      },
      {
        field: 'nit',
        search: query,
      },
    ], false);}
    // second parameter specifying whether to perform 'AND' or 'OR' search
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }
  onEdit(event)
  { 
    console.log(event.newData)
    if (isNaN(event.newData.telefono))
    {
      alert('El telefono tiene que ser Numericos!!!')
    }
    else if (isNaN(event.newData.nit)) {
      alert('El NIT tiene que ser Numerico!!!')
    }
    else if (event.newData.email.indexOf('@') === -1 )
    {
      alert('El correo tiene que ser correcto!!!')
    }
    else {
    this.http.put('/empresa/'+event.newData._id,event.newData).subscribe(
      data => {
        console.log('Datos modificados:',data);
        event.confirm.resolve(event.newData)           
      }
    )
    

    console.log('El evento es:',event)}
  }
  onDelete(event){
    console.log(event.data)
    if (window.confirm('¿Estás seguro de Borrar?')) 
    {if (event.data.cotizacion.length > 0){
      if (window.confirm('Esta empresa tiene Cotizaciones y Notas de entregas esta accion eliminara las mismas, Esta seguro?'))
      {   for (var i =0; i < event.data.cotizacion.length;i++){
          this.http.delete('/nota/porcotizacion/'+ event.data.cotizacion[i])
          .subscribe(
            data => {
              console.log("Se elimino", data)
            }
          )
         
          this.http.delete('/cotizaciones/' + event.data.cotizacion[i])
          .subscribe(
            data => {
              console.log("Se elimino", data)
            }
          )
          

        }    
        this.http.delete('/empresa/'+event.data._id)
        .subscribe(
          data => {
          console.log('Empresa Borrada')
          }
        )
      }
      else {
        event.confirm.reject();}
    }
      else{
        this.http.delete('/empresa/'+event.data._id)
        .subscribe(data => {
          console.log('Empresa Borrada')
        }
      )
      }
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }  }
  ngOnInit() {
    this.source = new LocalDataSource(this.empresas)
  }

}
