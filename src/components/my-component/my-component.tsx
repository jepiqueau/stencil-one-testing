import { JSX, h, Component, Element, Prop, State, Watch, Method, Event, EventEmitter, Listen } from '@stencil/core';
import { format } from '../../utils/utils';

const getBoundingClientRect = (el:Element,delay:number): Promise<ClientRect> => {
  return new Promise((resolve) => {
      setTimeout(() => {
          let rectBB:ClientRect;
          rectBB = el.getBoundingClientRect();
          resolve(rectBB);
      },delay);    
  });
}

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
    return <div class="mytext">Hello, World! I'm {this.getText()}</div>;
  }
}
