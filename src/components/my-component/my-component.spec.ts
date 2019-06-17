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

  it('should display svg rect color #242424 ', async () => {
    root.style.setProperty('--my-background-color','#ffff00');
    root.init();
    await page.waitForChanges();
    const rectEl:SVGRectElement = await root.shadowRoot.querySelector('#svgBackground');
    const fill:string = rectEl.getAttribute('fill');
    console.log('rectEl fill attribute ', fill);
    const fillColor = win.getComputedStyle(root).getPropertyValue(fill.substring(4).slice(0,-1));
    expect(fillColor).toEqual(`#242424`);
  });

});

describe('my-component change in css properties', () => {
  it('should display svg rect color #ff0000 ', async () => {
    const page:any = await newSpecPage({
      components: [MyComponent],
      html: '<my-component style="--my-background-color:#ff0000"></my-component>'
    });
    const root:any = page.root;
    const win = page.win;
    const rectEl:SVGRectElement = await root.shadowRoot.querySelector('#svgBackground');
    const fill:string = rectEl.getAttribute('fill');
    const fillColor = win.getComputedStyle(root).getPropertyValue(fill.substring(4).slice(0,-1));
    expect(fillColor).toEqual(`#ff0000`);
  });

});



