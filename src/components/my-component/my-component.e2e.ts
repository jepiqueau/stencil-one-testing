import { newE2EPage, E2EPage, E2EElement } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';
import { Viewport } from 'puppeteer';

describe('my-component', () => {
  let page: E2EPage;
  let cmp: E2EElement;

  async function getBoundingClientRect(component:string,selector:string) : Promise<any> {
    const retRect:any = await page.evaluate((component,selector) => {
      const cmpEl = document.querySelector(component);
      const textEl = cmpEl.shadowRoot.querySelector(selector);
      const rect = textEl.getBoundingClientRect();
      return {top:rect.top,left:rect.left,width:rect.width,height:rect.height}},component,selector)
    return retRect;
  }

  beforeEach(async () => {
    page = await newE2EPage();
    
    await page.setContent('<body style="margin:0px;"><my-component></my-component>');
    const viewPort: Viewport = {width:360,height:640, deviceScaleFactor: 1};
    page.setViewport(viewPort);
    innerWidth = await page.evaluate(_ => {return window.innerWidth})
    innerHeight = await page.evaluate(_ => {return window.innerHeight})
    cmp = await page.find('my-component');
  });

  it('should work without parameters', async () => {
    expect(cmp).toEqualHtml(`
      <my-component class=\"hydrated\">
      <shadow-root>
        <div class=\"mytext\">
          Hello, World! I'm
        </div>
      </shadow-root>
    </my-component>
    `);
    expect(cmp.innerHTML).toEqualHtml(``);
    expect(cmp.shadowRoot).toEqualHtml(`<div class=\"mytext\">Hello, World! I'm</div>`);
  });

  it('renders changes to the name data', async () => {
    const elm = await page.find('my-component >>> div');
    expect(elm.textContent).toEqual(`Hello, World! I'm `);

    cmp.setProperty('first', 'James');
    await cmp.callMethod('init');
    await page.waitForChanges();
    expect(elm.textContent).toEqual(`Hello, World! I'm James`);

    cmp.setProperty('last', 'Quincy');
    await cmp.callMethod('init');
    await page.waitForChanges();
    expect(elm.textContent).toEqual(`Hello, World! I'm James Quincy`);

    cmp.setProperty('middle', 'Earl');
    await cmp.callMethod('init');
    await page.waitForChanges();
    expect(elm.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });

  it('should not fire "initevent" if init method not called', async () => {
    const eventSpy:EventSpy = await cmp.spyOnEvent('initevent');
    await page.waitForChanges();
    expect(eventSpy).toHaveReceivedEventTimes(0);
  });
  it('should fire "initevent" on init ', async () => {
    const eventSpy:EventSpy = await cmp.spyOnEvent('initevent');
    await cmp.callMethod('init');
    await page.waitForChanges();
    expect(eventSpy).toHaveReceivedEventTimes(1);
    expect(eventSpy).toHaveReceivedEventDetail({init:true});    
    const receivedEvent = eventSpy.lastEvent;
    expect(receivedEvent.detail.init).toEqual(true);
    expect(receivedEvent.type).toEqual('initevent');
  });
  it('should change the last name when "testevent" is triggered', async () => {
    const eventSpy:EventSpy = await cmp.spyOnEvent('testevent');
    const elm = await page.find('my-component >>> div');
    cmp.setProperty('first', 'James');
    cmp.setProperty('last', 'Quincy');
    cmp.setProperty('middle', 'Earl');
    await cmp.callMethod('init');
    await page.waitForChanges();
    expect(elm.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
    cmp.triggerEvent('testevent',{detail: {last: 'Jeep'}});
    await page.waitForChanges();
    expect(elm.textContent).toEqual(`Hello, World! I'm James Earl Jeep`);
    expect(eventSpy).toHaveReceivedEventDetail({last: 'Jeep'});

  });

  it('should display the text at position top 10vh left 10vw', async () => {

    const rect:any = await getBoundingClientRect('my-component','.mytext'); 
    expect(rect.top).toEqual(64);
    expect(rect.left).toEqual(36);
    expect(rect.width).toEqual(360);
    expect(rect.height).toEqual(18);
    
  });
});

