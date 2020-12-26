/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ProjectdetailsComponent } from './projectdetails.component';

let component: ProjectdetailsComponent;
let fixture: ComponentFixture<ProjectdetailsComponent>;

describe('projectdetails component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ProjectdetailsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ProjectdetailsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});