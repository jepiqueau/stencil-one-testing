import { JSX, h, Component, Element, Prop, State, Watch, Method, Event, EventEmitter, Listen } from '@stencil/core';
import { format } from '../../utils/utils';


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
  @State() backColor: string;

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

  //*********************************
  //* Internal Variable Definitions *
  //*********************************

 
  //*******************************
  //* Component Lifecycle Methods *
  //*******************************

  async componentWillLoad() {
      await this.init();
  }
    
  //******************************
  //* Private Method Definitions *
  //******************************

  private async _init(): Promise<void> {
      this.parseFirstProp(this.first ? this.first : "");
      this.parseMiddleProp(this.middle ? this.middle : "");       
      this.parseLastProp(this.last ? this.last : "");
      this.backColor= window.getComputedStyle(this.el).getPropertyValue('--my-background-color').trim();
      console.log('this._backColor ',this.backColor) 
      const top = window.getComputedStyle(this.el).getPropertyValue('--my-top');
      console.log('in _init top ',top) 
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
            <rect id="svgBackground" width="100%" height="100%" fill={this.backColor}/>
          </svg>
          <div class="mytext">Hello, World! I'm {this.getText()}</div>
        </div>
      </div>
    );
  }
}
