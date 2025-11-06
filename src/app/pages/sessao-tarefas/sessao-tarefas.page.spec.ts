import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessaoTarefasPage } from './sessao-tarefas.page';

describe('SessaoTarefasPage', () => {
  let component: SessaoTarefasPage;
  let fixture: ComponentFixture<SessaoTarefasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SessaoTarefasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
