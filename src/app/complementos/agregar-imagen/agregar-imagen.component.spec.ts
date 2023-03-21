import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarImagenComponent } from './agregar-imagen.component';

describe('AgregarImagenComponent', () => {
  let component: AgregarImagenComponent;
  let fixture: ComponentFixture<AgregarImagenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarImagenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
