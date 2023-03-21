import { AddImageService } from './../addImagen.service';
import { Producto } from './../producto.model';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectionStrategy} from '@angular/core';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../../empresas/empresa.model';
import { AgregarImagenComponent } from '../../complementos/agregar-imagen/agregar-imagen.component';

@Component({
  selector: 'app-buscador-productos',
  templateUrl: './buscador-productos.component.html',
  styleUrls: ['./buscador-productos.component.css']
})
export class BuscadorProductosComponent implements OnInit {
customNumber: number;
empresa:Empresa;
@Input() productos;
source: LocalDataSource;
data = []
image
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
      width:'8%'
    },
    descripcion: {
      title: 'Descripcion',
      editor:{
        type:'textarea',

      },
      filter: false,
      width:'14%',
      class: 'tableColumn',
    },
    garantia:{
      title:'Garantia',
      filter: false,
      class: 'tableColumn',
      width:'8%',
      editor: {
        type:'list',
        config:{
          list:[
            {
              value:'0M',
              title:'0 Meses'            
            },
            {
              value:'1M',
              title:'1 Mes'},
            {
              value:'2M',
              title:'2 Meses'},
            {
              value:'3M',
              title:'3 Meses'},
            {
              value:'6M',
              title:'6 Meses'},
            {
              value:'8M',
              title:'8 Meses'},
            {
              value:'12M',
              title:'12 Meses'},
            ]
         }
            
      }
    },
    imagen:{
      title:'Imagen',
      type: 'html',
      filter: false,
      class:'tableColumn',
      editor:{
        type: 'custom',
        component: AgregarImagenComponent
      },
      valuePrepareFunction: (img) => {return '<img src="http://127.0.0.1:3000/'+img+'?'+this.customNumber+'"class="image-center"/>'},
      width:'10%'
    },
    precioc:{
      title:'Precio de Compra',
      filter: false,
      class:'tableColumn',
      width:'10%'
    },
    preciov:{
      title:'Precio de Venta',
      filter: false,
      class:'tableColumn',
      width:'7%'

    },
    unidad:{
      title:'Unidad',
      filter: false,
      class:'tableColumn',
      type: 'html',
      editor: {
        type:'list',
        config:{
          list:[
            {
              value:'metros',
              title:'Metros'},
            {
              value:'horas',
              title:'Horas'},
            {
              value:'pieza',
              title:'Pieza'},
            {
              value:'piezaSN',
              title:'Pieza Sin Serie'
            }
            
            ]
            
            }
            
      },
      width:'8%'

    },
    area:{
      title:'Area',
      filter:false,
      class:'tableColumn',
      width:'7%'
    },
    marca:{
      title:'Marca',
      filter: false,
      class:'tableColumn',
      width:'8%'

    },
    proveedor: {
      title:'Proveedor',
      filter: false,
      class:'tableColumn',
      width:'8%'

    },
    servicio:{
      title:'Servicio',
      filter: false,
      class:'tableColumn',
      width:'5%',
      type: 'html',
      valuePrepareFunction: (servicio) => {
        if (servicio === true){
          return 'Si'
        }
        else{
          return 'No'
        }
       },
      editor:{
        type: 'checkbox',
        config: {
          true: 'Si',
          false: 'No'
        }
      }

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

  constructor(private http:HttpClient) { }

  onSearch(query: string ) {
    console.log(query)
    if(query.length <1){
      this.source.setFilter([]);}
      else{
    this.source.setFilter([
      // fields we want to inclue in the searcha
      {
        field: 'modelo',
        search: query,
      },
      {
        field: 'descripcion',
        search: query,
      },
      {
        field: 'garantia',
        search: query,
      },
      {
        field: 'unidad',
        search: query,
      },
      {
        field: 'marca',
        search: query,
      },
      {
        field:'area',
        search:query
      },
      {
        field: 'proveedor',
        search: query,
      },
    ], false);}
    // second parameter specifying whether to perform 'AND' or 'OR' search
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }
  onEdit(event)
  { console.log(event.newData)
    event.newData.modelo = event.newData.modelo.toUpperCase();
    event.newData.marca = event.newData.marca.toUpperCase();
    event.newData.proveedor = event.newData.proveedor.toUpperCase();
    event.newData.area = event.newData.area.toUpperCase();
    if (isNaN(event.newData.precioc)||isNaN(event.newData.preciov))
    {
      alert('Los precios Tienen que ser Numericos!!!')
    }
    else {
    delete event.newData.imagen
    if (event.newData.servicio === 'Si'||event.newData.servicio === true){
      event.newData.servicio = true
    }
    else {
      event.newData.servicio = false
    }

    this.http.put('/producto/'+event.newData._id,event.newData).subscribe(
      data => {
        console.log('Datos modificados:',data);
        this.http.get('/producto/'+event.newData.modelo,).subscribe(
          data => { 
            event.newData.imagen = data[0].imagen
            this.customNumber = Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 1000) + 1);
            event.confirm.resolve(event.newData)
        })
      
      }
    )
    

    console.log('El evento es:',event)}
  }
  onDelete(event){
    if (window.confirm('¿Estás seguro de Borrar?')) {
      this.http.delete('/producto/'+event.data._id)
      .subscribe(data => {
        console.log('Producto Borrado')
      })
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }  }
  ngOnInit() {
    this.customNumber = Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 1000) + 1);
    this.source = new LocalDataSource(this.productos)
  }

}
