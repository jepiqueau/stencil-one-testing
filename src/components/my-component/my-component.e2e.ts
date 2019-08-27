import { newE2EPage, E2EPage, E2EElement } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';
import { Viewport } from 'puppeteer';

describe('my-component', () => {
  let page: E2EPage;

  async function getBoundingClientRect(component:string,selector:string) : Promise<any> {
    const retRect:any = await page.evaluate((component,selector) => {
      const cmpEl = document.querySelector(component);
      const textEl = cmpEl.shadowRoot.querySelector(selector);
      const rect = textEl.getBoundingClientRect();
      return {top:rect.top,left:rect.left,width:rect.width,height:rect.height}},component,selector)
    return retRect;
  }
  async function getSVGFillColor(component:string,selector:string) : Promise<string> {
    const fillColor: string = await page.evaluate((component,selector) => {
      const cmpEl: Element = document.querySelector(component);
      const selEl:SVGElement = cmpEl.shadowRoot.querySelector(selector);
      const fillColorAttr = selEl.getAttribute('fill');
      const fillColor = window.getComputedStyle(cmpEl).getPropertyValue(fillColorAttr.substring(4).slice(0,-1));
      return fillColor;
    },component,selector)
    return fillColor;
  }
  beforeEach(async () => {
    page = await newE2EPage();
    
    const viewPort: Viewport = {width:360,height:640, deviceScaleFactor: 1};
    page.setViewport(viewPort);
  });

  it('should open a window of size 360x640', async () => {
    innerWidth = await page.evaluate(_ => {return window.innerWidth});
    innerHeight = await page.evaluate(_ => {return window.innerHeight});
    expect(innerWidth).toEqual(360);
    expect(innerHeight).toEqual(640);
  });
  it('should work without parameters', async () => {
    await page.setContent('<body style="margin:0px;"><my-component></my-component>');
    const cmp:E2EElement = await page.find('my-component');
    await cmp.callMethod('init');
    await page.waitForChanges();

    expect(cmp).toEqualHtml(`
      <my-component class="hydrated">
      <mock:shadow-root>
        <div class="container">
          <div class="wrapper">
            <svg height="100%" width="100%">
              <rect id="svgBackground" width="100%" height="100%" fill="var(--my-background-color)"></rect>
            </svg>
            <div class="mytext">
              Hello, World! I'm
            </div>
          </div>
        </div>
      </mock:shadow-root>
    </my-component>
    `);
    expect(cmp.innerHTML).toEqualHtml(``);
    expect(cmp.shadowRoot).toEqualHtml(`
      <div class="container">
        <div class="wrapper">
          <svg height="100%" width="100%">
            <rect id="svgBackground" width="100%" height="100%" fill="var(--my-background-color)"></rect>
          </svg>
          <div class="mytext">
            Hello, World! I'm
          </div>
        </div>
      </div>
    `);
  });

  it('renders changes to the name data', async () => {
    await page.setContent('<body style="margin:0px;"><my-component></my-component>');
    const cmp:E2EElement = await page.find('my-component');
    const elm = await page.find('my-component >>> .mytext');
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
  it('renders should display ther full name', async () => {
    await page.setContent('<body style="margin:0px;"><my-component first="James" middle="Earl" last="Quincy"></my-component>');
    const elm = await page.find('my-component >>> .mytext');
    expect(elm.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
  it('should not fire "initevent" if init method not called', async () => {
    await page.setContent('<body style="margin:0px;"><my-component></my-component>');
    const cmp:E2EElement = await page.find('my-component');
    const eventSpy:EventSpy = await cmp.spyOnEvent('initevent');
    await page.waitForChanges();
    expect(eventSpy).toHaveReceivedEventTimes(0);
  });
  it('should fire "initevent" on init ', async () => {
    await page.setContent('<body style="margin:0px;"><my-component></my-component>');
    const cmp:E2EElement = await page.find('my-component');
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
    await page.setContent('<body style="margin:0px;"><my-component></my-component>');
    const cmp:E2EElement = await page.find('my-component');
    const eventSpy:EventSpy = await cmp.spyOnEvent('testevent');
    const elm = await page.find('my-component >>> .mytext');
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
  it('should display the wrapper at position top 10vh left 10vw', async () => {
    await page.setContent('<body style="margin:0px;"><my-component></my-component>');
    const rect:any = await getBoundingClientRect('my-component','.wrapper'); 
    expect(rect.top).toEqual(64);
    expect(rect.left).toEqual(36);
    expect(rect.width).toEqual(180);
    expect(rect.height).toEqual(320);
    
  });
  it('should display the svg rect at position top 10vh left 10vw', async () => {
    await page.setContent('<body style="margin:0px;"><my-component></my-component>');
    const rect:any = await getBoundingClientRect('my-component','#svgBackground'); 
    expect(rect.top).toEqual(64);
    expect(rect.left).toEqual(36);
    expect(rect.width).toEqual(180);
    expect(rect.height).toEqual(320);
  });
  it('should display the svg rect at position top 5vh left 5vw', async () => {
    await page.setContent('<body style="margin:0px;"><my-component style="--my-top:5vh;--my-left:5vw;"></my-component>');
    const rect:any = await getBoundingClientRect('my-component','#svgBackground'); 
    expect(rect.top).toEqual(32);
    expect(rect.left).toEqual(18);
    expect(rect.width).toEqual(180);
    expect(rect.height).toEqual(320);
  });
  it('should display the svg rect with width of 40vw and height of 200px', async () => {
    await page.setContent('<body style="margin:0px;"><my-component style="--my-width:40vw;--my-height:200px;"></my-component>');
    const rect:any = await getBoundingClientRect('my-component','#svgBackground'); 
    expect(rect.top).toEqual(64);
    expect(rect.left).toEqual(36);
    expect(rect.width).toEqual(144);
    expect(rect.height).toEqual(200);
  });

  it('should display the svg rect fill with color #242424', async () => {
    await page.setContent('<body style="margin:0px;"><my-component></my-component>');
    const rectColor:string = await getSVGFillColor('my-component','#svgBackground');
    expect(rectColor).toEqual('#242424');    
  });

  it('should display the svg rect fill with color #ff0000', async () => {
    await page.setContent('<body style="margin:0px;"><my-component style="--my-background-color:#ff0000;"></my-component>');
    const rectColor:string = await getSVGFillColor('my-component','#svgBackground');
    expect(rectColor).toEqual('#ff0000');    
  });

  it('should display the text at position top 10vh+5vh left 10vw+5vw', async () => {
    await page.setContent('<body style="margin:0px;"><my-component></my-component>');
    const rect:any = await getBoundingClientRect('my-component','.mytext'); 
    expect(rect.top).toEqual(96);
    expect(rect.left).toEqual(54);
    expect(rect.width).toEqual(141.046875);
    expect(rect.height).toEqual(23); 
  });
});

