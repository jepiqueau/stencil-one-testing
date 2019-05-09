import { format, cssVar } from './utils';
import { MockWindow, MockElement, MockDocument } from '@stencil/core/dist/mock-doc'

describe('format', () => {
  it('returns empty string for no names defined', () => {
    expect(format(undefined, undefined, undefined)).toEqual('');
  });

  it('formats just first names', () => {
    expect(format('Joseph', undefined, undefined)).toEqual('Joseph');
  });

  it('formats first and last names', () => {
    expect(format('Joseph', undefined, 'Publique')).toEqual('Joseph Publique');
  });

  it('formats first, middle and last names', () => {
    expect(format('Joseph', 'Quincy', 'Publique')).toEqual(
      'Joseph Quincy Publique'
    );
  });
});
/* below does not work
describe('cssVar', () => {
  it('should set a css variables', () => {
    const mockWindow = new MockWindow();
    const mockDocument = new MockDocument();
    mockDocument.body.innerHTML = '\
    <style type="text/css">\
      :root {--my-bgcolor:#fff000;}\
      body {padding:0;}\
      #container {position:absolute;width:40vw;height:20vh;left:10;top:10;background-color:var(--my-bgcolor);}\
      </style>\
      <div id="container"></div>';
    const root: MockElement  = mockDocument.documentElement;
    const divEl: MockElement = mockDocument.body.querySelector('#container');
    const retDiv = mockWindow.getComputedStyle(divEl).getPropertyValue('background-color');
    expect(retDiv).toEqual('#fff000') ;
    const retVar: string = cssVar(mockWindow,root,'--my-bgcolor');
    expect(retVar).toEqual('#fff000') ;

  });

});
*/

