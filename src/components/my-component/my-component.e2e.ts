import { newE2EPage, E2EPage, E2EElement } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

describe('my-component', () => {
  let page: E2EPage;
  let cmp: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
    
    await page.setContent('<my-component></my-component>');
    cmp = await page.find('my-component');
  });

  it('should work without parameters', async () => {
    expect(cmp).toEqualHtml(`
      <my-component class=\"hydrated\">
      <shadow-root>
        <div>
          Hello, World! I'm
        </div>
      </shadow-root>
    </my-component>
    `);
    expect(cmp.innerHTML).toEqualHtml(``);
    expect(cmp.shadowRoot).toEqualHtml(`<div>Hello, World! I'm</div>`);
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

});

