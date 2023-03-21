import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectionStrategy} from '@angular/core';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../empresas/empresa.model';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'button-view',
  template: `
    <button mat-raised-button color="primary" (click)="onClick()">{{ renderValue }}</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value.toString();
  }

  onClick() {
    this.save.emit(this.rowData);
  }
}

@Component({
  selector: 'dialog-data-dialog',
  template: '<p>{{data}}</p>'
})
export class DialogDataComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'app-complementocotizados',
  templateUrl: './complementocotizados.component.html',
  styleUrls: ['./complementos.component.css']
})
export class ComplementoCotizadosComponent implements OnInit {
  @Input() empresa;
  // @Input() editNota:Boolean;
  @Output() notaClick: EventEmitter<any> = new EventEmitter();
  // @Input() editcotizaciones:Boolean;
    // @Input() notaentrega:Boolean;
  cotizaciones
  deleteButton = false
  button = "Generar Nota"
  source: LocalDataSource;
  loading: boolean = false;
  settings = {
    pager:{
      display:true,
      perPage:20
    },
    columns: {
      id: {
        title: 'ID',
        filter: false,
        class: 'tableColumn',
        width:'15%'
      },
      nota: {
        title: 'Observacion',
        filter: false,
        width:'20%'
      },
      productos:{
        title:'Cantidad de Productos',
        filter: false,
        class: 'tableColumn',
        width:'15%'
      },
      total:{
        title:'Total',
        filter: false,
        class:'tableColumn',
        editable: false,
        width:'10%'
      },
      creado:{
        title:'Fecha Generada',
        filter: false,
        class:'tableColumn',
        editable: false,
        width:'25%'
      },
      button:{
        title: this.button,
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponent,
        // https://github.com/akveo/ng2-smart-table/issues/626  JavaScript closures
        onComponentInitFunction:(instance)=> {
          // 
            instance.save.subscribe(row => {
            this.notaClick.emit({
              row:row.id,
              nota:row.nota,
              empresa:this.empresa,
              encargadoEntrega: row.encargadoEntrega,
              encargadoRecepcion: row.encargadoRecepcion
            })
            console.log(this.cotizaciones)
            
          });
        }
      }
      
      
  },
    actions: {
      add:false,
      edit:false,
      delete: false,
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
 data =[]
  constructor(private http:HttpClient,public dialog: MatDialog) {  

  }

  onDelete(event) {
      console.log(event.data)
      var deleteCotizacion ={
        empresa:this.empresa.nombre,
        Id: event.data.id
      }
      this.http.post('/cotizaciones/delete',deleteCotizacion)
      .subscribe(
        data => {
          this.dialog.open(DialogDataComponent,{
            data: data
          })        
        }
      )

  }
  onSearch(query: string ) {
    console.log(query)
    if(query.length <1){
      this.source.setFilter([]);}
      else{
    this.source.setFilter([
      // fields we want to inclue in the searcha
      {
        field: 'id',
        search: query,
      },
      {
        field: 'nota',
        search: query,
      },
      {
        field: 'productos',
        search: query,
      },
      {
        field: 'total',
        search: query,
      },
      {
        field: 'creado',
        search: query,
      },
    ], false);}
    // second parameter specifying whether to perform 'AND' or 'OR' search
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }
  ngOnInit() {
    this.loading = true
    console.log('Se va a editar la nota?',this.empresa.accion)
    if (this.empresa.accion === 'notaEdit'){
      this.button = "Editar Nota"
          console.log(this.button)
          console.log('iniciando')
          var name = this.empresa.nombre;
          console.log(name)
          
          var cotizacion;
          this.http.get('/nota/'+name)
              .subscribe(
            data => { 
              this.cotizaciones = data
              for (var i = 0 ;i <this.cotizaciones.length; i++){
                var cantidadProductos = 0 
                for(var j = 0; j< this.cotizaciones[i].productos.length;j++){
                  if (this.cotizaciones[i].productos[j].unidad !== 'pieza' ){
                    cantidadProductos = cantidadProductos +1
                  }
                  else{
                    cantidadProductos = cantidadProductos + this.cotizaciones[i].productos[j].cantidad
                    console.log('La cantidad de productos es:',this.cotizaciones[i].productos[j].cantidad)
                  }
                }
                console.log('NotaEntrega:',this.cotizaciones[i].notas[0].nota)
                  cotizacion = {
                    id: this.cotizaciones[i].id,
                    nota: this.cotizaciones[i].notas[0].nota,
                    productos: cantidadProductos,
                    total: this.cotizaciones[i].total,
                    creado: this.cotizaciones[i].creado,
                    button: this.button,
                    encargadoEntrega: this.cotizaciones[i].notas[0].encargadoEntrega,
                    encargadoRecepcion: this.cotizaciones[i].notas[0].encargadoRecepcion
                    }
                  this.data.push(cotizacion)
            }
            this.source = new LocalDataSource(this.data);
            this.loading = false
            console.log(this.data)
            console.log(this.source)
            })
    }
    else{
      if (this.empresa.accion !== 'cotizacionEdit'){
          
          console.log(this.button)
        
          console.log('iniciando')
          var name = this.empresa.nombre;
          console.log(name)
          
          var cotizacion;
          this.http.get('/cotizaciones/edit/'+name)
              .subscribe(
            data => { 
              this.cotizaciones = data
              for (var i = 0 ;i <this.cotizaciones.length; i++){
                var cantidadProductos = 0 
                for(var j = 0; j< this.cotizaciones[i].productos.length;j++){
                  if (this.cotizaciones[i].productos[j].unidad !== 'pieza' ){
                    cantidadProductos = cantidadProductos +1
                  }
                  else{
                    cantidadProductos = cantidadProductos + this.cotizaciones[i].productos[j].cantidad
                    console.log('La cantidad de productos es:',this.cotizaciones[i].productos[j].cantidad)
                  }
                }
                  cotizacion = {
                    id: this.cotizaciones[i].id,
                    nota: this.cotizaciones[i].nota,
                    productos: cantidadProductos,
                    total: this.cotizaciones[i].total,
                    creado: this.cotizaciones[i].creado,
                    button: this.button
                    }
                  this.data.push(cotizacion)
            }
            this.source = new LocalDataSource(this.data);
            this.loading = false
            console.log(this.data)
            console.log(this.source)
            })
      }  
      else{
      console.log('iniciando')
      var name = this.empresa.nombre;
      console.log(name)
      // this.settings.actions.delete = true
      console.log('Delete:button',this.deleteButton)
      this.button = "Editar Cotización"
      var cotizacion;
      this.http.get('/cotizaciones/'+name)
          .subscribe(
        data => { 
          this.cotizaciones = data
          for (var i = 0 ;i <this.cotizaciones.length; i++){
            var cantidadProductos = 0 
            for(var j = 0; j< this.cotizaciones[i].productos.length;j++){
              if (this.cotizaciones[i].productos[j].unidad !== 'pieza' ){
                cantidadProductos = cantidadProductos +1
              }
              else{
                cantidadProductos = cantidadProductos + this.cotizaciones[i].productos[j].cantidad
                console.log('La cantidad de productos es:',this.cotizaciones[i].productos[j].cantidad)
              }
            }
            console.log(cantidadProductos)
              cotizacion = {
                id: this.cotizaciones[i].id,
                nota: this.cotizaciones[i].nota,
                productos: cantidadProductos,
                total: this.cotizaciones[i].total,
                creado: this.cotizaciones[i].creado,
                button: this.button
                }
              this.data.push(cotizacion)
        }
        this.source = new LocalDataSource(this.data);
        this.loading = false
        console.log(this.data)
        console.log(this.source)
        })

      }
  }
  }

}
  