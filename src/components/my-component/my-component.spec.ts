import { newSpecPage} from '@stencil/core/testing';
import { MyComponent } from './my-component';

describe('my-component', () => {
  let page: any;
  let root: any;
  let doc: Document;
  beforeEach(async () => {
    page = await newSpecPage({
      components: [MyComponent],
      html: '<my-component></my-component>'
    });
    root = page.root;
    doc = page.doc;
  });
  afterEach (async () => {
    page = null;
  });
  
  it('renders changes when first property is given', async () => {
    root.first = "John";
    await page.waitForChanges();
    const div = await root.shadowRoot.querySelector('div');
    expect(div.textContent).toEqual(`Hello, World! I'm John`);
  }); 
  
  it('renders changes when first and last properties are given', async () => {
    root.first = "John";
    root.last = "Smith"
    await page.waitForChanges();
    const div = await root.shadowRoot.querySelector('div');
    expect(div.textContent).toEqual(`Hello, World! I'm John Smith`);
  }); 

  it('renders changes to the name data', async () => {
    expect(root).toEqualHtml(`<my-component class=\"hydrated\">
      <shadow-root>
        <div class=\"mytext\">
          Hello, World! I'm
        </div>
      </shadow-root>
    </my-component>`);
    expect(root).toHaveClass('hydrated');
    const div = await root.shadowRoot.querySelector('div');
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
    const div = await root.shadowRoot.querySelector('div');
    expect(div.textContent).toEqual(`Hello, World! I'm  Jeep`);
  });

});
