import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlterarFotoPage } from './alterar-foto.page';

describe('AlterarFotoPage', () => {
  let component: AlterarFotoPage;
  let fixture: ComponentFixture<AlterarFotoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterarFotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
