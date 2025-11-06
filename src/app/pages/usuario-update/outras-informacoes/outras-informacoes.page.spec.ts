import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutrasInformacoesPage } from './outras-informacoes.page';

describe('OutrasInformacoesPage', () => {
  let component: OutrasInformacoesPage;
  let fixture: ComponentFixture<OutrasInformacoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OutrasInformacoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
