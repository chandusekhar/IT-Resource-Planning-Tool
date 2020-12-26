/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AddEditProjectComponent } from './add-edit-project.component';

let component: AddEditProjectComponent;
let fixture: ComponentFixture<AddEditProjectComponent>;

describe('AddEditProject component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AddEditProjectComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AddEditProjectComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});