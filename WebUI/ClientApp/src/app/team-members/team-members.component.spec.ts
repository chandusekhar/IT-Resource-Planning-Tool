/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { TeamMembersComponent } from './team-members.component';

let component: TeamMembersComponent;
let fixture: ComponentFixture<TeamMembersComponent>;

describe('TeamMembers component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ TeamMembersComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(TeamMembersComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});