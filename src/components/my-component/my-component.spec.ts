import { newSpecPage} from '@stencil/core/testing';
import { MyComponent } from './my-component';

describe('my-component', () => {
  let page: any;
  let root: any;
  let doc: Document;
  let win: Window;
  beforeEach(async () => {
    page = await newSpecPage({
      components: [MyComponent],
      html: '<my-component></my-component>'
    });
    root = page.root;
    doc = page.doc;
    win = page.win;
  });
  afterEach (async () => {
    page = null;
  });
  
  it('renders changes when first property is given', async () => {
   root.first = "John";
    await page.waitForChanges();
    const div = await root.shadowRoot.querySelector('.mytext');
    expect(div.textContent).toEqual(`Hello, World! I'm John`);
  }); 
  
  it('renders changes when first and last properties are given', async () => {
    root.first = "John";
    root.last = "Smith"
    await page.waitForChanges();
    const div = await root.shadowRoot.querySelector('.mytext');
    expect(div.textContent).toEqual(`Hello, World! I'm John Smith`);
  }); 

  it('renders changes to the name data', async () => {
    root.init();
    await page.waitForChanges();
    expect(root).toEqualHtml(`
    <my-component style="--my-background-color: #242424; --my-top: 10vh; --my-left: 10vw; --my-width: 50vw; --my-height: 50vh;">
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
    </my-component>`);
    const div = await root.shadowRoot.querySelector('.mytext');
    expect(div.textContent).toEqual(`Hello, World! I'm `);
    root.first = "James";
    await page.waitForChanges();
    expect(div.textContent).toEqual(`Hello, World! I'm James`);
    root.last = "Quincy";
    await page.waitForChanges();
    expect(div.textContent).toEqual(`Hello, World! I'm James Quincy`);
    root.middle = "Earl";
    await page.waitForChanges();
    expect(div.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);

  }); 

  it('should emit "initevent" on init ', async () => {
    root.addEventListener('initevent',(ev: CustomEvent) => {
      expect(ev.detail.init).toBeTruthy();
    },false)
    root.init();
    await page.waitForChanges();
  });
  it('should respond to "testevent" ', async () => {
    const myevent = new CustomEvent("testevent", {
      detail: {
        last: "Jeep"
      }
    });
    doc.dispatchEvent(myevent); 
    await page.waitForChanges();   
    const div = await root.shadowRoot.querySelector('.mytext');
    expect(div.textContent).toEqual(`Hello, World! I'm  Jeep`);
  });
  it('should render with all css variables set to default ', async () => {
    root.init();
    await page.waitForChanges();
    const cssVar:any = await root.getLocalCSS();
    expect(cssVar.backgroundColor).toEqual('#242424');
    expect(cssVar.top).toEqual('10vh');
    expect(cssVar.left).toEqual('10vw');
    expect(cssVar.width).toEqual('50vw');
    expect(cssVar.height).toEqual('50vh');
  });
  it('should render with --my-background-color set to #ffff00 and all other css variables set to default ', async () => {
    root.style.setProperty('--my-background-color','#ffff00');
    root.init();
    await page.waitForChanges();
    const cssVar:any = await root.getLocalCSS();
    expect(cssVar.backgroundColor).toEqual('#ffff00');
    expect(cssVar.top).toEqual('10vh');
    expect(cssVar.left).toEqual('10vw');
    expect(cssVar.width).toEqual('50vw');
    expect(cssVar.height).toEqual('50vh');
  });
  it('should render with --my-top set to 50vh and all other css variables set to default ', async () => {
    root.style.setProperty('--my-top','50vh');
    root.init();
    await page.waitForChanges();
    const cssVar:any = await root.getLocalCSS();
    expect(cssVar.backgroundColor).toEqual('#242424');
    expect(cssVar.top).toEqual('50vh');
    expect(cssVar.left).toEqual('10vw');
    expect(cssVar.width).toEqual('50vw');
    expect(cssVar.height).toEqual('50vh');
  });
  it('should render with --my-left set to 50vw and all other css variables set to default ', async () => {
    root.style.setProperty('--my-left','50vw');
    root.init();
    await page.waitForChanges();
    const cssVar:any = await root.getLocalCSS();
    expect(cssVar.backgroundColor).toEqual('#242424');
    expect(cssVar.top).toEqual('10vh');
    expect(cssVar.left).toEqual('50vw');
    expect(cssVar.width).toEqual('50vw');
    expect(cssVar.height).toEqual('50vh');
  });
  it('should render with --my-width set to 80vw and all other css variables set to default ', async () => {
    root.style.setProperty('--my-width','80vw');
    root.init();
    await page.waitForChanges();
    const cssVar:any = await root.getLocalCSS();
    expect(cssVar.backgroundColor).toEqual('#242424');
    expect(cssVar.top).toEqual('10vh');
    expect(cssVar.left).toEqual('10vw');
    expect(cssVar.width).toEqual('80vw');
    expect(cssVar.height).toEqual('50vh');
  });
  it('should render with --my-height set to 75vh and all other css variables set to default ', async () => {
    root.style.setProperty('--my-height','75vh');
    root.init();
    await page.waitForChanges();
    const cssVar:any = await root.getLocalCSS();
    expect(cssVar.backgroundColor).toEqual('#242424');
    expect(cssVar.top).toEqual('10vh');
    expect(cssVar.left).toEqual('10vw');
    expect(cssVar.width).toEqual('50vw');
    expect(cssVar.height).toEqual('75vh');
  });

  it('should display svg rect color #ffff00 ', async () => {
    root.style.setProperty('--my-background-color','#ffff00');
    root.init();
    await page.waitForChanges();      
    const rectEl:SVGRectElement = await root.shadowRoot.querySelector('#svgBackground');
    const fill:string = rectEl.getAttribute('fill');
    const fillColor = await root.getCSSVar(win,root,fill.substring(4).slice(0,-1));
    expect(fillColor).toEqual(`#ffff00`);
  });

});




