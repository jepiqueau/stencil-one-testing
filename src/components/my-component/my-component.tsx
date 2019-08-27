import { JSX, h, Component, Element, Prop, State, Watch, Method, Event, EventEmitter, Listen } from '@stencil/core';
import { format, cssVar } from '../../utils/utils';
import { LocalCSS } from '../../global/interface';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  @Element() el!: HTMLMyComponentElement;
  //************************
  //* Property Definitions *
  //************************

  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  //************************
  //* State Definitions *
  //************************

  @State() innerFirst: string;
  @State() innerMiddle: string;
  @State() innerLast: string;
//  @State() backColor: string;

  //*****************************
  //* Watch on Property Changes *
  //*****************************

  @Watch('first')
  parseFirstProp(newValue: string) {
    this.innerFirst = newValue ? newValue : "";
  }
  @Watch('middle')
  parseMiddleProp(newValue: string) {
    this.innerMiddle = newValue ? newValue : "";
  }
  @Watch('last')
  parseLastProp(newValue: string) {
    this.innerLast = newValue ? newValue : "";
  }
  //*********************
  //* Event Definitions *
  //*********************

  /**
   * Emitted when the component Loads
   */

  @Event() initevent : EventEmitter<{init:boolean}>;

  //*******************************
  //* Listen to Event Definitions *
  //*******************************

  @Listen('testevent',{ target: 'document' })
  handleTestEvent(event: CustomEvent) {
    this.parseLastProp(event.detail.last ? event.detail.last : "");
  };

  //**********************
  //* Method Definitions *
  //**********************

  /**
   * Method initialize
   */
  @Method()
  init(): Promise<void> {
    return Promise.resolve(this._init());
  }

  /**
   * Method get local CSS variables
   */
  @Method()
  getLocalCSS(): Promise<LocalCSS> {
    return Promise.resolve(this._localCSS);
  }
  /**
   * Method get a CSS variable by name
   */
  @Method()
  getCSSVar(win:any,elem:any,name:string): Promise<string> {
    return Promise.resolve(cssVar(win,elem,name));
  }

  //*********************************
  //* Internal Variable Definitions *
  //*********************************
  _localCSS: LocalCSS = {};
  //*******************************
  //* Component Lifecycle Methods *
  //*******************************

  async componentWillLoad() {
      await this.init();
  }
  async componentDidLoad() {
  }
  //******************************
  //* Private Method Definitions *
  //******************************

  private async _init(): Promise<void> {
      this.parseFirstProp(this.first ? this.first : "");
      this.parseMiddleProp(this.middle ? this.middle : "");       
      this.parseLastProp(this.last ? this.last : "");
      this._localCSS.backgroundColor = cssVar(window,this.el,'--my-background-color');
      this._localCSS.backgroundColor = this._localCSS.backgroundColor ? this._localCSS.backgroundColor : cssVar(window,this.el,'--my-background-color','#242424');
      this._localCSS.top = cssVar(window,this.el,'--my-top');
      this._localCSS.top = this._localCSS.top ? this._localCSS.top : cssVar(window,this.el,'my-top','10vh');
      this._localCSS.left = cssVar(window,this.el,'--my-left');
      this._localCSS.left = this._localCSS.left ? this._localCSS.left : cssVar(window,this.el,'my-left','10vw');
      this._localCSS.width = cssVar(window,this.el,'--my-width');
      this._localCSS.width = this._localCSS.width ? this._localCSS.width : cssVar(window,this.el,'my-width','50vw');
      this._localCSS.height = cssVar(window,this.el,'--my-height');
      this._localCSS.height = this._localCSS.height ? this._localCSS.height : cssVar(window,this.el,'my-height','50vh');
  
      this.initevent.emit({init:true});
      return;
  }

  private getText(): string {
    return format(this.innerFirst, this.innerMiddle, this.innerLast);
  }

  //*************************
  //* Rendering JSX Element *
  //*************************

  render(): JSX.Element {
    return (
      <div class="container">
        <div class="wrapper">
          <svg width="100%" height="100%">
            <rect id="svgBackground" width="100%" height="100%" fill="var(--my-background-color)"/>
          </svg>
          <div class="mytext">Hello, World! I'm {this.getText()}</div>
        </div>
      </div>
    );
  }
}
